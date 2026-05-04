package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminCategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByCategoryId(Integer categoryId);

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Integer categoryId);
}
