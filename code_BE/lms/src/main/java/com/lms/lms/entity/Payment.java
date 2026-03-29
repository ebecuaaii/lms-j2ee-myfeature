package com.lms.lms.entity;

import com.lms.lms.entity.enums.PaymentStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String studentId;
    private String courseId;
    private double amount;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    // unique transaction reference sent to VNPay
    private String txnRef;

    private String paymentUrl;

    @CreatedDate
    private Instant createdAt;

    private Instant paidAt;
}
