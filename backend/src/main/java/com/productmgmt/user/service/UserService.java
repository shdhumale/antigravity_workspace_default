package com.productmgmt.user.service;

import com.productmgmt.user.model.User;
import com.productmgmt.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> findAllActive() {
        return userRepository.findAll().stream()
                .filter(u -> u.getDeletedAt() == null)
                .toList();
    }

    @SuppressWarnings("null")
    public User findById(UUID id) {
        return userRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(UUID id, User userDetails) {
        User user = findById(id);
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @Transactional
    public void softDelete(UUID id) {
        User user = findById(id);
        user.setDeletedAt(LocalDateTime.now());
        user.setActive(false);
        userRepository.save(user);
    }
}
