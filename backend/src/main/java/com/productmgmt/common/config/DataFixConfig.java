package com.productmgmt.common.config;

import com.productmgmt.user.model.User;
import com.productmgmt.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataFixConfig {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner updateAdminRole() {
        return args -> {
            Optional<User> userOpt = userRepository.findByEmail("admin@productmgmt.com");
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getRole() != User.Role.ADMIN) {
                    log.info("Updating role for admin@productmgmt.com from {} to ADMIN", user.getRole());
                    user.setRole(User.Role.ADMIN);
                    userRepository.save(user);
                } else {
                    log.info("admin@productmgmt.com already has ADMIN role");
                }
            } else {
                log.warn("admin@productmgmt.com not found in database");
            }
        };
    }
}
