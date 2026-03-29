package com.lms.lms.repository;

import com.lms.lms.entity.Payment;
import com.lms.lms.entity.enums.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByTxnRef(String txnRef);
    List<Payment> findByStudentIdAndStatus(String studentId, PaymentStatus status);
    boolean existsByStudentIdAndCourseIdAndStatus(String studentId, String courseId, PaymentStatus status);
}
