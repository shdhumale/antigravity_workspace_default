package com.productmgmt.audit.service;

import com.productmgmt.audit.model.AuditLog;
import com.productmgmt.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @SuppressWarnings("null")
    public void log(String entityType, String entityId, String action, UUID actorId, String oldValue, String newValue) {
        AuditLog entry = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(actorId)
                .performedAt(LocalDateTime.now())
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        auditLogRepository.save(entry);
    }
}
