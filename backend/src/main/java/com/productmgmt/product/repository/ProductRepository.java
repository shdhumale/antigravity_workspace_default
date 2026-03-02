package com.productmgmt.product.repository;

import com.productmgmt.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.createdBy")
    List<Product> findAll();

    @Query(value = "SELECT * FROM products WHERE MATCH(name, description) AGAINST (?1 IN BOOLEAN MODE)", nativeQuery = true)
    List<Product> searchByKeyword(String keyword);
}
