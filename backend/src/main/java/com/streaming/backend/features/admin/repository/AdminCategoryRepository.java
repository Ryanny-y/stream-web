package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminCategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByCategoryId(Integer categoryId);

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Integer categoryId);

    @Query("""
            select c.categoryId as categoryId,
                   c.categoryName as categoryName,
                   coalesce(sum(v.totalViews), 0) as totalViews
            from Category c
            left join c.videos v
            group by c.categoryId, c.categoryName
            order by coalesce(sum(v.totalViews), 0) desc, c.categoryName asc
            """)
    List<CategoryViewStats> findMostWatchedCategories(Pageable pageable);

    interface CategoryViewStats {

        Integer getCategoryId();

        String getCategoryName();

        Long getTotalViews();
    }
}
