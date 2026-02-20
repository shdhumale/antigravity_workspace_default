package com.productmgmt.dashboard.service;

import com.productmgmt.product.repository.ProductRepository;
import com.productmgmt.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        // Add more complex KPIs if needed
        return stats;
    }
}
