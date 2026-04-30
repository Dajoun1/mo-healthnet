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

        for (Map<String, Object> act : activitiesData) {
            ApplicationActivity activity = new ApplicationActivity();
            activity.setApplication(application);

            String typeStr = ((String) act.get("activityType")).replace(" ", "_");
            activity.setActivityType(ApplicationActivity.ActivityType.valueOf(typeStr));
            activity.setOrganizationName((String) act.get("organizationName"));
            activity.setHoursPerMonth(Integer.parseInt(act.get("hoursPerMonth").toString()));

            application.getActivities().add(activity);
        }

        Application saved = applicationRepository.save(application);
        LOG.info("Application submitted successfully for user: {}, applicationId: {}", userId, saved.getId());
        return saved;
    }

    public List<Application> getUserApplications(Integer userId) {
        return applicationRepository.findByUserId(userId);
    }
}

