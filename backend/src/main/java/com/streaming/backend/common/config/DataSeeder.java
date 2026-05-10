package com.streaming.backend.common.config;

import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.enums.CategoryStatus;
import com.streaming.backend.domain.enums.RoleName;
import com.streaming.backend.domain.enums.UserStatus;
import com.streaming.backend.features.admin.repository.AdminCategoryRepository;
import com.streaming.backend.features.auth.repository.AuthRepository;
import com.streaming.backend.features.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final AuthRepository authRepository;
    private final AdminCategoryRepository adminCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    private static final List<CategorySeed> DEFAULT_CATEGORIES = List.of(
            new CategorySeed("Action", "High-energy movies and series with fights, chases, and adventure."),
            new CategorySeed("Animation", "Animated stories for families, kids, and animation fans."),
            new CategorySeed("Comedy", "Lighthearted videos made for laughs and easy watching."),
            new CategorySeed("Documentary", "Non-fiction stories, investigations, and real-world topics."),
            new CategorySeed("Drama", "Character-driven stories with emotional stakes."),
            new CategorySeed("Fantasy", "Magic, myth, and imaginative worlds."),
            new CategorySeed("Horror", "Scary, suspenseful, and supernatural stories."),
            new CategorySeed("Romance", "Love stories, relationships, and heartfelt moments."),
            new CategorySeed("Sci-Fi", "Futuristic stories, technology, space, and speculative ideas."),
            new CategorySeed("Thriller", "Tense stories built around danger, mystery, and suspense.")
    );

    @Value("${app.seed.default-admin.enabled:true}")
    private boolean defaultAdminEnabled;

    @Value("${app.seed.default-categories.enabled:true}")
    private boolean defaultCategoriesEnabled;

    @Value("${app.seed.default-admin.username:admin}")
    private String defaultAdminUsername;

    @Value("${app.seed.default-admin.email:admin@viewix.local}")
    private String defaultAdminEmail;

    @Value("${app.seed.default-admin.password:Admin@12345}")
    private String defaultAdminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedRoles();

        if (defaultCategoriesEnabled) {
            seedDefaultCategories();
        }

        if (defaultAdminEnabled) {
            seedDefaultAdmin();
        }
    }

    private void seedRoles() {
        Arrays.stream(RoleName.values())
                .filter(roleName -> roleRepository.findByRoleName(roleName).isEmpty())
                .map(this::createRole)
                .forEach(roleRepository::save);
    }

    private Role createRole(RoleName roleName) {
        Role role = new Role();
        role.setRoleName(roleName);
        return role;
    }

    private void seedDefaultCategories() {
        DEFAULT_CATEGORIES.stream()
                .filter(categorySeed -> !adminCategoryRepository.existsByCategoryName(categorySeed.name()))
                .map(this::createCategory)
                .forEach(adminCategoryRepository::save);
    }

    private Category createCategory(CategorySeed categorySeed) {
        Category category = new Category();
        category.setCategoryName(categorySeed.name());
        category.setDescription(categorySeed.description());
        category.setStatus(CategoryStatus.ACTIVE);
        return category;
    }

    private void seedDefaultAdmin() {
        if (authRepository.existsByUsername(defaultAdminUsername) || authRepository.existsByEmail(defaultAdminEmail)) {
            return;
        }

        Role adminRole = roleRepository.findByRoleName(RoleName.ADMIN)
                .orElseThrow(() -> new IllegalStateException("ADMIN role was not seeded."));

        User admin = new User();
        admin.setUsername(defaultAdminUsername);
        admin.setEmail(defaultAdminEmail);
        admin.setPasswordHash(passwordEncoder.encode(defaultAdminPassword));
        admin.setFirstName("Default");
        admin.setLastName("Admin");
        admin.setStatus(UserStatus.ACTIVE);
        admin.setEmailVerified(true);
        admin.setFailedAttempts(0);
        admin.setRoles(Set.of(adminRole));

        authRepository.save(admin);
    }

    private record CategorySeed(String name, String description) {
    }
}
