package com.lms.lms.service.impl;

import com.lms.lms.dto.response.PaymentResponse;
import com.lms.lms.entity.Course;
import com.lms.lms.entity.Payment;
import com.lms.lms.entity.enums.PaymentStatus;
import com.lms.lms.exception.AppException;
import com.lms.lms.repository.CourseRepository;
import com.lms.lms.repository.PaymentRepository;
import com.lms.lms.service.EnrollmentService;
import com.lms.lms.service.PaymentService;
import com.lms.lms.utils.ResponseCode;
import com.lms.lms.utils.VNPayUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Override
    public PaymentResponse createPayment(String courseId, String studentId, String ipAddr) {
        Course course = courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Course not found"));

        if (course.getPrice() <= 0) {
            throw new AppException(ResponseCode.ERROR, "This course is free, use enroll instead");
        }

        // prevent duplicate pending payment
        if (paymentRepository.existsByStudentIdAndCourseIdAndStatus(
                studentId, courseId, PaymentStatus.SUCCESS)) {
            throw new AppException(ResponseCode.ERROR, "You have already purchased this course");
        }

        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        long amountVnd = (long) course.getPrice();

        String paymentUrl = VNPayUtil.buildPaymentUrl(
                vnpUrl, tmnCode, hashSecret,
                txnRef, amountVnd,
                returnUrl + "?courseId=" + courseId,
                ipAddr,
                "Payment for course: " + course.getTitle()
        );

        Payment payment = Payment.builder()
                .studentId(studentId)
                .courseId(courseId)
                .amount(course.getPrice())
                .txnRef(txnRef)
                .paymentUrl(paymentUrl)
                .status(PaymentStatus.PENDING)
                .build();

        Payment saved = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .paymentId(saved.getId())
                .courseId(courseId)
                .amount(saved.getAmount())
                .status(saved.getStatus())
                .paymentUrl(paymentUrl)
                .build();
    }

    @Override
    public String handleVNPayCallback(Map<String, String> params) {
        // verify signature
        if (!VNPayUtil.verifySignature(params, hashSecret)) {
            return "INVALID_SIGNATURE";
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Payment payment = paymentRepository.findByTxnRef(txnRef)
                .orElse(null);

        if (payment == null) return "ORDER_NOT_FOUND";

        if ("00".equals(responseCode)) {
            // payment success
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(Instant.now());
            paymentRepository.save(payment);

            // create enrollment
            enrollmentService.createEnrollment(payment.getCourseId(), payment.getStudentId());
            return "SUCCESS";
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            return "FAILED";
        }
    }
}
