package com.lms.lms.controller;

import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.PaymentResponse;
import com.lms.lms.service.PaymentService;
import com.lms.lms.utils.ApiResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${vnpay.return-url}")
    private String frontendReturnUrl;

    // PAID course: create payment order → returns VNPay URL
    @PostMapping("/create/{courseId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @PathVariable String courseId,
            Authentication auth,
            HttpServletRequest request) {
        String studentId = (String) auth.getPrincipal();
        String ipAddr = getClientIp(request);
        return ResponseEntity.ok(ApiResponseUtil.success(
                paymentService.createPayment(courseId, studentId, ipAddr)));
    }

    // VNPay callback — GET request from VNPay after payment
    @GetMapping("/vnpay/callback")
    public ResponseEntity<Void> vnpayCallback(
            @RequestParam Map<String, String> params,
            HttpServletRequest request) {

        String result = paymentService.handleVNPayCallback(params);
        String courseId = params.getOrDefault("vnp_OrderInfo", "").contains(":")
                ? params.get("vnp_TxnRef") : "";

        // redirect FE to success or failed page
        String redirectUrl = "SUCCESS".equals(result)
                ? frontendReturnUrl.replace("/payment/callback", "/payment/success?courseId=" + params.get("vnp_TxnRef"))
                : frontendReturnUrl.replace("/payment/callback", "/payment/failed");

        return ResponseEntity.status(302)
                .header("Location", redirectUrl)
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return (ip != null && !ip.isEmpty()) ? ip.split(",")[0].trim() : request.getRemoteAddr();
    }
}
