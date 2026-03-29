package com.lms.lms.service;

import com.lms.lms.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {
    // PAID course: create payment order and return VNPay URL
    PaymentResponse createPayment(String courseId, String studentId, String ipAddr);

    // VNPay callback: verify and finalize
    String handleVNPayCallback(Map<String, String> params);
}
