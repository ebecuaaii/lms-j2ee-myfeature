package com.lms.lms.dto.response;

import com.lms.lms.entity.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {
    private String paymentId;
    private String courseId;
    private double amount;
    private PaymentStatus status;
    private String paymentUrl; // redirect URL for PAID courses
}
