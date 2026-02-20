package com.productmgmt.audit.aspect;

import com.productmgmt.audit.service.AuditService;
import com.productmgmt.user.model.User;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditService auditService;

    @Pointcut("execution(* com.productmgmt.*.service.*.create*(..)) || " +
              "execution(* com.productmgmt.*.service.*.update*(..)) || " +
              "execution(* com.productmgmt.*.service.*.delete*(..)) || " +
              "execution(* com.productmgmt.*.service.*.approve*(..)) || " +
              "execution(* com.productmgmt.*.service.*.submit*(..))")
    public void serviceWriteMethods() {}

    @AfterReturning(pointcut = "serviceWriteMethods()", returning = "result")
    public void auditLog(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID actorId = null;
        if (auth != null && auth.getPrincipal() instanceof User user) {
            actorId = user.getId();
        }

        // Simplistic logic to extract entity type and ID
        String entityType = className.replace("Service", "");
        String entityId = "N/A";
        
        if (result != null) {
            try {
                // Try to get 'id' field via reflection if it's a model
                entityId = result.getClass().getMethod("getId").invoke(result).toString();
            } catch (Exception e) {
                // Fallback to arguments if result is void or doesn't have getId
                Object[] args = joinPoint.getArgs();
                if (args.length > 0) {
                    entityId = args[0].toString();
                }
            }
        } else {
            Object[] args = joinPoint.getArgs();
            if (args.length > 0) {
                entityId = args[0].toString();
            }
        }

        auditService.log(entityType, entityId, methodName, actorId, null, null);
    }
}
