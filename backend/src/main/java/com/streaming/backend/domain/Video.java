package com.streaming.backend.domain;

import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.*;


@Entity
@Table(name = "videos")
@Getter
@Setter
@NoArgsConstructor
public class Video extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID videoId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(unique = true)
    private String slug;

    @Column(nullable = false)
    private String filePath;

    private String thumbnailPath;
    private Integer durationSeconds;
    private Long fileSize;
    private LocalDate releaseDate;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    private VideoStatus status = VideoStatus.ACTIVE;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_trending")
    private Boolean isTrending = false;
    private Long totalViews = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @ManyToMany
    @JoinTable(
            name = "video_categories",
            joinColumns = @JoinColumn(name = "video_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
}