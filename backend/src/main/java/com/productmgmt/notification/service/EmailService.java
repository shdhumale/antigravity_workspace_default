package com.productmgmt.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Retryable(retryFor = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void sendEmail(String to, String subject, String body) {
        log.info("Attempting to send email to {}", to);
        // Placeholder for actual email sending logic (e.g. JavaMailSender)
        if (Math.random() > 0.8) {
            throw new RuntimeException("Simulated email server failure");
        }
        log.info("Email sent successfully to {}", to);
    }

    @Recover
    public void recover(Exception e, String to, String subject, String body) {
        log.error("Failed to send email to {} after retries. Error: {}", to, e.getMessage());
        // Potential logic to log failure in DB or notify admin
    }
}
