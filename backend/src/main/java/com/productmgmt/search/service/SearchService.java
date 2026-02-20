package com.productmgmt.search.service;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;

    public List<Product> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return productRepository.findAll();
        }
        // Using Boolean Mode for better flexibility
        return productRepository.searchByKeyword("+" + query + "*");
    }
}
