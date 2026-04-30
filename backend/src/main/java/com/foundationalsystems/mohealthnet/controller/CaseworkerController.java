package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.dto.ApplicationDTO;
import com.foundationalsystems.mohealthnet.entity.Application;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.service.ApplicationService;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/caseworker")
public class CaseworkerController {

    private static final Logger LOG = LoggerFactory.getLogger(CaseworkerController.class);

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all applications for caseworker review
     */
    @GetMapping("/applications")
    public ResponseEntity<Map<String, Object>> getAllApplications() {
        try {
            List<Application> applications = applicationService.getAllApplications();

            // Convert to DTOs and populate applicant names
            List<ApplicationDTO> applicationDTOs = applications.stream()
                    .map(app -> {
                        ApplicationDTO dto = new ApplicationDTO(app);
                        // Fetch user details
                        userRepository.findById(app.getUserId()).ifPresent(user -> {
                            dto.setApplicantFirstName(user.getFirstName());
                            dto.setApplicantLastName(user.getLastName());
                            dto.setApplicantFullName(user.getFirstName() + " " + user.getLastName());
                        });
                        return dto;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("applications", applicationDTOs);
            response.put("total", applicationDTOs.size());
            response.put("success", true);

            LOG.info("Fetched {} applications for caseworker", applicationDTOs.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOG.error("Failed to fetch applications: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to fetch applications");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get application by ID with full details
     */
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<Map<String, Object>> getApplicationById(@PathVariable Integer applicationId) {
        try {
            Application application = applicationService.getApplicationById(applicationId);
            ApplicationDTO applicationDTO = new ApplicationDTO(application);

            // Populate applicant name
            userRepository.findById(application.getUserId()).ifPresent(user -> {
                applicationDTO.setApplicantFirstName(user.getFirstName());
                applicationDTO.setApplicantLastName(user.getLastName());
                applicationDTO.setApplicantFullName(user.getFirstName() + " " + user.getLastName());
            });

            Map<String, Object> response = new HashMap<>();
            response.put("application", applicationDTO);
            response.put("success", true);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            LOG.warn("Application not found: {}", applicationId);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Application not found");
            errorResponse.put("success", false);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LOG.error("Failed to fetch application {}: {}", applicationId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to fetch application details");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Update application status (approve, deny, under review)
     */
    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<Map<String, Object>> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestBody Map<String, Object> request) {
        try {
            String status = (String) request.get("status");
            Integer reviewedBy = (Integer) request.get("reviewedBy");
            String reviewNotes = (String) request.get("reviewNotes");

            if (status == null || status.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Status is required");
                errorResponse.put("success", false);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Application updated = applicationService.updateApplicationStatus(
                    applicationId, status, reviewedBy, reviewNotes);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application status updated successfully");
            response.put("application", updated);
            response.put("success", true);

            LOG.info("Caseworker {} updated application {} to status {}", reviewedBy, applicationId, status);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.warn("Invalid application status update: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid status or application not found");
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            LOG.error("Failed to update application status: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to update application status");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get application statistics for caseworker dashboard
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            List<Application> allApplications = applicationService.getAllApplications();

            long pending = allApplications.stream()
                    .filter(app -> app.getStatus() == Application.ApplicationStatus.Pending)
                    .count();
            long underReview = allApplications.stream()
                    .filter(app -> app.getStatus() == Application.ApplicationStatus.Under_Review)
                    .count();
            long approved = allApplications.stream()
                    .filter(app -> app.getStatus() == Application.ApplicationStatus.Approved)
                    .count();
            long denied = allApplications.stream()
                    .filter(app -> app.getStatus() == Application.ApplicationStatus.Denied)
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", allApplications.size());
            stats.put("pending", pending);
            stats.put("underReview", underReview);
            stats.put("approved", approved);
            stats.put("denied", denied);
            stats.put("success", true);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            LOG.error("Failed to fetch statistics: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unable to fetch statistics");
            errorResponse.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}

