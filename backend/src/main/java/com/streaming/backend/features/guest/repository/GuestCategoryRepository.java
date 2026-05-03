package com.streaming.backend.features.guest.repository;

import com.streaming.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestCategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByCategoryId(Integer categoryId);
}
