package com.streaming.backend.domain;

import com.streaming.backend.domain.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "user_id", columnDefinition = "uuid")
    private UUID userId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String firstName;
    private String lastName;
    private String phone;
    private String profileImage;
    private String bio;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    private Boolean emailVerified = false;
    private Integer failedAttempts = 0;
    private LocalDateTime lockedUntil;

    /* ================== RELATIONSHIPS ================== */

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "uploadedBy")
    private List<Video> uploadedVideos = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<WatchHistory> watchHistories = new ArrayList<>();
}
