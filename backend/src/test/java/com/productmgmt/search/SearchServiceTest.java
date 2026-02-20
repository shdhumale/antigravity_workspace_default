package com.productmgmt.search;

import com.productmgmt.product.repository.ProductRepository;
import com.productmgmt.search.service.SearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SearchServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private SearchService searchService;

    @Test
    public void searchProducts_ShouldCallRepository_WhenQueryProvided() {
        when(productRepository.searchByKeyword(anyString())).thenReturn(List.of());

        searchService.searchProducts("test");
    }
}
