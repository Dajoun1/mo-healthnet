package com.foundationalsystems.mohealthnet.dto;

import com.foundationalsystems.mohealthnet.entity.Application;
import com.foundationalsystems.mohealthnet.entity.ApplicationActivity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ApplicationDTO {
    private Integer id;
    private Integer userId;
    private String applicantFirstName;
    private String applicantLastName;
    private String applicantFullName;
    private Integer householdSize;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private Boolean isMissouriResident;
    private Integer totalHoursPerMonth;
    private String status;
    private LocalDateTime submittedAt;
    private Integer reviewedBy;
    private Integer assignedTo;
    private String assignedToName;
    private LocalDateTime reviewedAt;
    private String reviewNotes;
    private List<ActivityDTO> activities;

    public void setActivityType(String applicationSubmitted) {
    }

    public static class ActivityDTO {
        private Integer id;
        private String activityType;
        private String organizationName;
        private Integer hoursPerMonth;

        public ActivityDTO(ApplicationActivity activity) {
            this.id = activity.getId();
            this.activityType = activity.getActivityType().name();
            this.organizationName = activity.getOrganizationName();
            this.hoursPerMonth = activity.getHoursPerMonth();
        }

        // Add no-argument constructor if needed for testing
        public ActivityDTO() {
        }

        // Getters
        public Integer getId() {
            return id;
        }

        public String getActivityType() {
            return activityType;
        }

        public String getOrganizationName() {
            return organizationName;
        }

        public Integer getHoursPerMonth() {
            return hoursPerMonth;
        }

        // Add setters for testing
        public void setId(Integer id) {
            this.id = id;
        }

        public void setActivityType(String activityType) {
            this.activityType = activityType;
        }

        public void setOrganizationName(String organizationName) {
            this.organizationName = organizationName;
        }

        public void setHoursPerMonth(Integer hoursPerMonth) {
            this.hoursPerMonth = hoursPerMonth;
        }
    }

    public ApplicationDTO(Application app) {
        this.id = app.getId();
        this.userId = app.getUserId();
        this.householdSize = app.getHouseholdSize();
        this.phone = app.getPhone();
        this.streetAddress = app.getStreetAddress();
        this.city = app.getCity();
        this.state = app.getState();
        this.zipCode = app.getZipCode();
        this.isMissouriResident = app.getIsMissouriResident();
        this.totalHoursPerMonth = app.getTotalHoursPerMonth();
        this.status = app.getStatus().name();
        this.submittedAt = app.getSubmittedAt();
        this.reviewedBy = app.getReviewedBy();
        this.assignedTo = app.getAssignedTo();
        this.reviewedAt = app.getReviewedAt();
        this.reviewNotes = app.getReviewNotes();
        this.activities = app.getActivities().stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getApplicantFirstName() {
        return applicantFirstName;
    }

    public String getApplicantLastName() {
        return applicantLastName;
    }

    public String getApplicantFullName() {
        return applicantFullName;
    }

    public Integer getHouseholdSize() {
        return householdSize;
    }

    public String getPhone() {
        return phone;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public Boolean getIsMissouriResident() {
        return isMissouriResident;
    }

    public Integer getTotalHoursPerMonth() {
        return totalHoursPerMonth;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public Integer getReviewedBy() {
        return reviewedBy;
    }

    public Integer getAssignedTo() {
        return assignedTo;
    }

    public String getAssignedToName() {
        return assignedToName;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public String getReviewNotes() {
        return reviewNotes;
    }

    public List<ActivityDTO> getActivities() {
        return activities;
    }

    // Setters
    public void setApplicantFirstName(String applicantFirstName) {
        this.applicantFirstName = applicantFirstName;
    }

    public void setApplicantLastName(String applicantLastName) {
        this.applicantLastName = applicantLastName;
    }

    public void setApplicantFullName(String applicantFullName) {
        this.applicantFullName = applicantFullName;
    }

    public void setAssignedToName(String assignedToName) {
        this.assignedToName = assignedToName;
    }
}