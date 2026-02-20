package com.productmgmt.product.controller;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.service.ProductApprovalService;
import com.productmgmt.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductApprovalService productApprovalService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> submit(@PathVariable UUID id) {
        productApprovalService.submitForApproval(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> approve(@PathVariable UUID id) {
        productApprovalService.approveProduct(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<String> uploadImage(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        // Simple placeholder for image upload logic
        return ResponseEntity.ok("Image uploaded for product " + id);
    }
}
