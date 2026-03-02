package com.productmgmt.product.service;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @SuppressWarnings("null")
    public Product findById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    @SuppressWarnings("null")
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    @SuppressWarnings("null")
    public Product updateProduct(UUID id, Product productDetails) {
        Product product = findById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setInventoryQty(productDetails.getInventoryQty());
        product.setCategory(productDetails.getCategory());
        // Optimistic locking handled by @Version in Product entity
        return productRepository.save(product);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }
}
