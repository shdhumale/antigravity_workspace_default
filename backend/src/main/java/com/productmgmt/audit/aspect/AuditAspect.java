package com.productmgmt.audit.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productmgmt.audit.service.AuditService;
import com.productmgmt.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Pointcut("execution(* com.productmgmt.*.service.*.create*(..)) || " +
              "execution(* com.productmgmt.*.service.*.update*(..)) || " +
              "execution(* com.productmgmt.*.service.*.delete*(..)) || " +
              "execution(* com.productmgmt.*.service.*.approve*(..)) || " +
              "execution(* com.productmgmt.*.service.*.submit*(..)) || " +
              "execution(* com.productmgmt.*.service.*.softDelete*(..))")
    public void serviceWriteMethods() {}

    @Around("serviceWriteMethods()")
    public Object auditLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String entityType = className.replace("Service", "").toUpperCase();
        
        Object[] args = joinPoint.getArgs();
        String oldValueStr = null;
        
        // Try to capture old value if it's an update/delete and we have an ID
        // This is a simplified approach; in a real enterprise app, we might use a generic repository to fetch
        if ((methodName.contains("update") || methodName.contains("delete")) && args.length > 0) {
            try {
                // Assuming first argument is the ID for updates/deletes
                oldValueStr = objectMapper.writeValueAsString(args[0]);
            } catch (Exception e) {
                log.warn("Failed to serialize old value for method: {}", methodName);
            }
        }

        Object result = joinPoint.proceed();

        String newValueStr = null;
        String entityId = "N/A";

        if (result != null) {
            try {
                newValueStr = objectMapper.writeValueAsString(result);
                // Try to get 'id' field via reflection if it's a model
                entityId = result.getClass().getMethod("getId").invoke(result).toString();
            } catch (Exception e) {
                // Fallback to arguments if result is void or doesn't have getId
                if (args.length > 0) {
                    entityId = args[0].toString();
                }
            }
        } else {
            if (args.length > 0) {
                entityId = args[0].toString();
                try {
                    newValueStr = objectMapper.writeValueAsString(args.clone());
                } catch (Exception e) {
                    newValueStr = "Operation: " + methodName;
                }
            }
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID actorId = null;
        if (auth != null && auth.getPrincipal() instanceof User user) {
            actorId = user.getId();
        }

        auditService.log(entityType, entityId, methodName.toUpperCase(), actorId, oldValueStr, newValueStr);

        return result;
    }
}
