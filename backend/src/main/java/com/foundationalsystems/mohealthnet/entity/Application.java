package com.foundationalsystems.mohealthnet.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "household_size", nullable = false)
    private Integer householdSize;

    @Column(length = 10)
    private String phone;

    @Column(name = "street_address", nullable = false, length = 100)
    private String streetAddress;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(name = "zip_code", nullable = false, length = 5)
    private String zipCode;

    @Column(name = "is_missouri_resident", nullable = false)
    private Boolean isMissouriResident = false;

    @Column(name = "total_hours_per_month", nullable = false)
    private Integer totalHoursPerMonth = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.Pending;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_by")
    private Integer reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;

    @JsonManagedReference
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ApplicationActivity> activities = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }

    public enum ApplicationStatus {
        Pending, Approved, Denied, Under_Review
    }
}

