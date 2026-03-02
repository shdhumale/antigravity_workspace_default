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
    public void serviceWriteMethods() {
    }

    @Around("serviceWriteMethods()")
    public Object auditLog(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String entityType = className.replace("Service", "").toUpperCase();

        Object[] args = joinPoint.getArgs();
        String oldValueStr = null;

        if ((methodName.contains("update") || methodName.contains("delete")) && args.length > 0) {
            try {
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
                try {
                    entityId = result.getClass().getMethod("getId").invoke(result).toString();
                } catch (Exception e) {
                    if (args.length > 0)
                        entityId = args[0].toString();
                }
            } catch (Exception e) {
                if (args.length > 0)
                    entityId = args[0].toString();
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
        User actor = null;
        if (auth != null && auth.getPrincipal() instanceof User user) {
            actor = user;
        }

        auditService.log(entityType, entityId, methodName.toUpperCase(), actor, oldValueStr, newValueStr);

        return result;
    }
}
