package com.productmgmt.audit.service;

import com.productmgmt.audit.model.AuditLog;
import com.productmgmt.audit.repository.AuditLogRepository;
import com.productmgmt.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Async
    @SuppressWarnings("null")
    public void log(String entityType, String entityId, String action, User actor, String oldValue, String newValue) {
        log.info("Creating audit log: {} {} by {}", action, entityType, actor != null ? actor.getEmail() : "SYSTEM");

        AuditLog entry = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(actor)
                .performedAt(LocalDateTime.now())
                .oldValue(oldValue)
                .newValue(newValue)
                .build();

        try {
            entry = auditLogRepository.save(entry);
            log.info("Audit log saved with ID: {}", entry.getId());

            // Broadcast to dashboard
            messagingTemplate.convertAndSend("/topic/audit", entry);
            log.info("Audit log broadcast to /topic/audit");
        } catch (Exception e) {
            log.error("Failed to save or broadcast audit log", e);
        }
    }
}
