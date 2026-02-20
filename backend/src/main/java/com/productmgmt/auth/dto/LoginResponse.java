package com.productmgmt.auth.dto;

import com.productmgmt.user.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
    }
}
