package com.foundationalsystems.mohealthnet.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Application_Activity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Column(name = "organization_name", nullable = false, length = 150)
    private String organizationName;

    @Column(name = "hours_per_month", nullable = false)
    private Integer hoursPerMonth;

    public enum ActivityType {
        Employment, Education, Community_Service
    }
}

