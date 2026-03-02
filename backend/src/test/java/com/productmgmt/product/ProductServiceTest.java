package com.productmgmt.product;

import com.productmgmt.product.model.Product;
import com.productmgmt.product.repository.ProductRepository;
import com.productmgmt.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    @SuppressWarnings("null")
    public void findById_ShouldReturnProduct_WhenExists() {
        UUID id = UUID.randomUUID();
        Product product = Product.builder().id(id).name("Test").price(BigDecimal.TEN).build();
        when(productRepository.findById(id)).thenReturn(Optional.of(product));

        Product found = productService.findById(id);
        assertEquals("Test", found.getName());
    }

    @Test
    @SuppressWarnings("null")
    public void findById_ShouldThrowException_WhenNotExists() {
        UUID id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> productService.findById(id));
    }
}
