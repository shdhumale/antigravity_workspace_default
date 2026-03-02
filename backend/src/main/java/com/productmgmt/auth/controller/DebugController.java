package com.productmgmt.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/debug")
public class DebugController {

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.ok(Map.of("message", "No authentication found"));
        }
        return ResponseEntity.ok(Map.of(
                "principal", auth.getPrincipal().toString(),
                "authorities", auth.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .collect(Collectors.toList()),
                "authenticated", auth.isAuthenticated()));
    }
}
