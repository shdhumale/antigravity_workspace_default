package com.productmgmt.product.service;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductApprovalService {

    private final ProductRepository productRepository;

    @Transactional
    @SuppressWarnings("null")
    public void submitForApproval(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus() != Product.ProductStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT products can be submitted for approval");
        }

        product.setStatus(Product.ProductStatus.PENDING);
        productRepository.save(product);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @SuppressWarnings("null")
    public void approveProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus() != Product.ProductStatus.PENDING) {
            throw new RuntimeException("Only PENDING products can be approved");
        }

        product.setStatus(Product.ProductStatus.ACTIVE);
        productRepository.save(product);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @SuppressWarnings("null")
    public void rejectProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(Product.ProductStatus.DRAFT);
        productRepository.save(product);
    }
}
