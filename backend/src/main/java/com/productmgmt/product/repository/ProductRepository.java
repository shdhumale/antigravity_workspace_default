package com.productmgmt.product.repository;

import com.productmgmt.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Override
    @org.springframework.lang.NonNull
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.createdBy")
    List<Product> findAll();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.createdBy WHERE p.id = :id")
    Optional<Product> findByIdFetch(@Param("id") UUID id);

    @Query(value = "SELECT * FROM products WHERE MATCH(name, description) AGAINST (?1 IN BOOLEAN MODE)", nativeQuery = true)
    List<Product> searchByKeyword(String keyword);
}
