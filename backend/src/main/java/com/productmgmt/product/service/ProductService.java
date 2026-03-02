package com.productmgmt.product.service;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.repository.ProductRepository;
import com.productmgmt.user.model.User;
import com.productmgmt.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @SuppressWarnings("null")
    public Product findById(UUID id) {
        return productRepository.findByIdFetch(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    @SuppressWarnings("null")
    public Product createProduct(Product product) {
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException(
                    "Category must be provided via 'category', 'categoryId', or 'category_id'. Use GET /api/v1/categories to find available IDs.");
        }

        // Auto-generate SKU if not provided
        if (product.getSku() == null || product.getSku().isBlank()) {
            product.setSku("PROD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Get currently authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail;
        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else {
            userEmail = principal.toString();
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        product.setCreatedBy(user);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setStatus(Product.ProductStatus.DRAFT);
        product.setVersion(0L);

        return productRepository.save(product);
    }

    @Transactional
    @SuppressWarnings("null")
    public Product updateProduct(UUID id, Product productDetails) {
        Product product = findById(id);

        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }

        // Update inventory quantity
        product.setInventoryQty(productDetails.getInventoryQty());

        // Null-safe category update
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            product.setCategory(productDetails.getCategory());
        }

        product.setUpdatedAt(LocalDateTime.now());

        // Optimistic locking handled by @Version in Product entity
        return productRepository.save(product);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }
}
