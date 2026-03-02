package com.productmgmt.auth.service;

import com.productmgmt.auth.dto.LoginRequest;
import com.productmgmt.auth.dto.LoginResponse;
import com.productmgmt.auth.model.RefreshToken;
import com.productmgmt.auth.repository.RefreshTokenRepository;
import com.productmgmt.user.model.User;
import com.productmgmt.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final RefreshTokenRepository refreshTokenRepository;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public LoginResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                saveRefreshToken(user, refreshToken);

                return LoginResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .user(LoginResponse.UserInfo.builder()
                                                .id(user.getId().toString())
                                                .email(user.getEmail())
                                                .firstName(user.getFirstName())
                                                .lastName(user.getLastName())
                                                .role(user.getRole().name())
                                                .build())
                                .build();
        }

        private void saveRefreshToken(User user, String token) {
                RefreshToken refreshToken = RefreshToken.builder()
                                .user(user)
                                .tokenHash(token) // In real world, hash this
                                .issuedAt(Instant.now())
                                .expiresAt(Instant.now()
                                                .plusMillis(jwtService.extractClaim(token,
                                                                claims -> claims.getExpiration().getTime()
                                                                                - System.currentTimeMillis())))
                                .build();
                refreshTokenRepository.save(refreshToken);
        }

        @Transactional
        @SuppressWarnings("null")
        public void logout(String refreshToken) {
                refreshTokenRepository.findByTokenHash(refreshToken)
                                .ifPresent(token -> {
                                        token.setRevokedAt(Instant.now());
                                        refreshTokenRepository.save(token);
                                });
        }
}
