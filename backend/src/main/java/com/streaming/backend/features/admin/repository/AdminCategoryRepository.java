package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminCategoryRepository extends JpaRepository<Category, Integer> {
}
