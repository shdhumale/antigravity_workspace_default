package com.productmgmt.product.service;

import com.productmgmt.product.model.Category;
import com.productmgmt.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories")
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    @SuppressWarnings("null")
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}
