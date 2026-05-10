package com.streaming.backend.common.config;

import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.enums.RoleName;
import com.streaming.backend.domain.enums.UserStatus;
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
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.default-admin.enabled:true}")
    private boolean defaultAdminEnabled;

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
}
