package com.productmgmt.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Test {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "AdminPassword123!";
        String storedHash = encoder.encode(rawPassword);
        System.out.println(storedHash);
        BCryptPasswordEncoder decoder = new BCryptPasswordEncoder();
        // String storedHash =
        // "$2a$12$R9h/lSAbvpyK7931q9p4UeM1Jq2r0X6XpM9kP1Q7f2f1R7q7y5W.G";

        // This is the ONLY way to check the value:
        boolean isCorrect = decoder.matches(rawPassword, storedHash);
        System.out.println(isCorrect);

    }
}