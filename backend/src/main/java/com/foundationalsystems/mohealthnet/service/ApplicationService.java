package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.entity.Application;
import com.foundationalsystems.mohealthnet.entity.ApplicationActivity;
import com.foundationalsystems.mohealthnet.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private static final Logger LOG = LoggerFactory.getLogger(ApplicationService.class);

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * Submit a new application with multiple activities.
     */
    public Application submitApplication(Integer userId, Map<String, Object> data, List<Map<String, Object>> activitiesData) {
        Application application = new Application();
        application.setUserId(userId);
        application.setHouseholdSize(Integer.parseInt(data.get("householdSize").toString()));
        application.setPhone((String) data.getOrDefault("phone", null));
        application.setStreetAddress((String) data.get("streetAddress"));
        application.setCity((String) data.get("city"));
        application.setState((String) data.get("state"));
        application.setZipCode((String) data.get("zipCode"));
        Object moRes = data.get("isMissouriResident");
        application.setIsMissouriResident(moRes instanceof Boolean ? (Boolean) moRes : Boolean.parseBoolean(moRes.toString()));
        application.setStatus(Application.ApplicationStatus.Pending);

        // Calculate total hours per month from all activities
        int totalHours = 0;
        for (Map<String, Object> act : activitiesData) {
            ApplicationActivity activity = new ApplicationActivity();
            activity.setApplication(application);

            String typeStr = ((String) act.get("activityType")).replace(" ", "_");
            activity.setActivityType(ApplicationActivity.ActivityType.valueOf(typeStr));
            activity.setOrganizationName((String) act.get("organizationName"));
            int hours = Integer.parseInt(act.get("hoursPerMonth").toString());
            activity.setHoursPerMonth(hours);

            totalHours += hours;
            application.getActivities().add(activity);
        }

        // Set the total hours on the application
        application.setTotalHoursPerMonth(totalHours);

        Application saved = applicationRepository.save(application);
        LOG.info("Application submitted successfully for user: {}, applicationId: {}", userId, saved.getId());
        return saved;
    }

    public List<Application> getUserApplications(Integer userId) {
        return applicationRepository.findByUserId(userId);
    }

    /**
     * Get all applications (for caseworkers/admin)
     */
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    /**
     * Get application by ID
     */
    public Application getApplicationById(Integer applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + applicationId));
    }

    /**
     * Update application status and add review information
     */
    public Application updateApplicationStatus(Integer applicationId, String statusStr, Integer reviewedBy, String reviewNotes) {
        Application application = getApplicationById(applicationId);

        // Parse and set status
        Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(statusStr.replace(" ", "_"));
        application.setStatus(newStatus);

        // Set review information
        if (reviewedBy != null) {
            application.setReviewedBy(reviewedBy);
            application.setReviewedAt(java.time.LocalDateTime.now());
        }

        if (reviewNotes != null && !reviewNotes.trim().isEmpty()) {
            application.setReviewNotes(reviewNotes);
        }

        Application updated = applicationRepository.save(application);
        LOG.info("Application {} status updated to {} by user {}", applicationId, newStatus, reviewedBy);
        return updated;
    }

    /**
     * Save application (used for assignment updates)
     */
    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }
}

