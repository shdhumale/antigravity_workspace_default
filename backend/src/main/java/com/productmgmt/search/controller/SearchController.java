package com.productmgmt.search.controller;

import com.productmgmt.product.model.Product;
import com.productmgmt.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(searchService.searchProducts(q));
    }
}
