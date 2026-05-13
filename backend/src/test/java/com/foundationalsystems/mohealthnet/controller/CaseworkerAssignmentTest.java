//package com.foundationalsystems.mohealthnet.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.foundationalsystems.mohealthnet.dto.ApplicationDTO;
//import com.foundationalsystems.mohealthnet.entity.Application;
//import com.foundationalsystems.mohealthnet.entity.User;
//import com.foundationalsystems.mohealthnet.repository.UserRepository;
//import com.foundationalsystems.mohealthnet.service.ApplicationService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(CaseworkerController.class)
//class CaseworkerAssignmentTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private ApplicationService applicationService;
//
//    @MockBean
//    private UserRepository userRepository;
//
//    private Application testApplication;
//    private User testCaseworker;
//    private User testApplicant;
//
//    @BeforeEach
//    void setUp() {
//        // Setup test applicant
//        testApplicant = new User();
//        testApplicant.setId(1);
//        testApplicant.setUsername("applicant@test.com");
//        testApplicant.setFirstName("John");
//        testApplicant.setLastName("Doe");
//        testApplicant.setRole(User.UserRole.Applicant);
//        testApplicant.setStatus(User.UserStatus.Active);
//
//        // Setup test caseworker
//        testCaseworker = new User();
//        testCaseworker.setId(5);
//        testCaseworker.setUsername("caseworker@test.com");
//        testCaseworker.setFirstName("Jane");
//        testCaseworker.setLastName("Smith");
//        testCaseworker.setRole(User.UserRole.Employee);
//        testCaseworker.setStatus(User.UserStatus.Active);
//
//        // Setup test application
//        testApplication = new Application();
//        testApplication.setId(1);
//        testApplication.setUserId(1);
//        testApplication.setHouseholdSize(3);
//        testApplication.setStreetAddress("123 Main St");
//        testApplication.setCity("Springfield");
//        testApplication.setState("MO");
//        testApplication.setZipCode("65801");
//        testApplication.setIsMissouriResident(true);
//        testApplication.setTotalHoursPerMonth(160);
//        testApplication.setStatus(Application.ApplicationStatus.Pending);
//        testApplication.setSubmittedAt(LocalDateTime.now());
//        testApplication.setActivities(new ArrayList<>());
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testAssignApplicationToMyselfSuccess() throws Exception {
//        // Given
//        when(applicationService.getApplicationById(1)).thenReturn(testApplication);
//        when(applicationService.saveApplication(any(Application.class))).thenReturn(testApplication);
//        when(userRepository.findById(5)).thenReturn(Optional.of(testCaseworker));
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("caseworkerId", 5);
//
//        // When & Then
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Application assigned successfully"))
//                .andExpect(jsonPath("$.application").exists())
//                .andExpect(jsonPath("$.application.assignedToName").value("Jane Smith"));
//
//        verify(applicationService).getApplicationById(1);
//        verify(applicationService).saveApplication(any(Application.class));
//        verify(userRepository).findById(5);
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testUnassignApplicationSuccess() throws Exception {
//        // Given
//        testApplication.setAssignedTo(5);
//        when(applicationService.getApplicationById(1)).thenReturn(testApplication);
//        when(applicationService.saveApplication(any(Application.class))).thenReturn(testApplication);
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("caseworkerId", null);
//
//        // When & Then
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.message").value("Application unassigned"));
//
//        verify(applicationService).getApplicationById(1);
//        verify(applicationService).saveApplication(any(Application.class));
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testAssignApplicationWithDifferentNumberTypes() throws Exception {
//        // Test with Integer
//        when(applicationService.getApplicationById(1)).thenReturn(testApplication);
//        when(applicationService.saveApplication(any(Application.class))).thenReturn(testApplication);
//        when(userRepository.findById(5)).thenReturn(Optional.of(testCaseworker));
//
//        Map<String, Object> request1 = new HashMap<>();
//        request1.put("caseworkerId", 5); // Integer
//
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request1)))
//                .andExpect(status().isOk());
//
//        // Test with Long
//        Map<String, Object> request2 = new HashMap<>();
//        request2.put("caseworkerId", 5L); // Long
//
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request2)))
//                .andExpect(status().isOk());
//
//        // Test with String
//        Map<String, Object> request3 = new HashMap<>();
//        request3.put("caseworkerId", "5"); // String
//
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request3)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testAssignApplicationNotFound() throws Exception {
//        // Given
//        when(applicationService.getApplicationById(999))
//                .thenThrow(new IllegalArgumentException("Application not found with ID: 999"));
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("caseworkerId", 5);
//
//        // When & Then
//        mockMvc.perform(put("/api/caseworker/applications/999/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").value("Application not found"));
//
//        verify(applicationService).getApplicationById(999);
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testGetAllApplicationsIncludesAssignedToName() throws Exception {
//        // Given
//        testApplication.setAssignedTo(5);
//        List<Application> applications = Arrays.asList(testApplication);
//
//        when(applicationService.getAllApplications()).thenReturn(applications);
//        when(userRepository.findById(1)).thenReturn(Optional.of(testApplicant));
//        when(userRepository.findById(5)).thenReturn(Optional.of(testCaseworker));
//
//        // When & Then
//        mockMvc.perform(get("/api/caseworker/applications")
//                        .with(csrf()))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.applications").isArray())
//                .andExpect(jsonPath("$.applications[0].assignedToName").value("Jane Smith"))
//                .andExpect(jsonPath("$.applications[0].applicantFullName").value("John Doe"));
//
//        verify(applicationService).getAllApplications();
//        verify(userRepository).findById(1);
//        verify(userRepository).findById(5);
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testGetAllApplicationsWithNoAssignment() throws Exception {
//        // Given
//        testApplication.setAssignedTo(null);
//        List<Application> applications = Arrays.asList(testApplication);
//
//        when(applicationService.getAllApplications()).thenReturn(applications);
//        when(userRepository.findById(1)).thenReturn(Optional.of(testApplicant));
//
//        // When & Then
//        mockMvc.perform(get("/api/caseworker/applications")
//                        .with(csrf()))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.applications").isArray())
//                .andExpect(jsonPath("$.applications[0].assignedToName").doesNotExist());
//
//        verify(applicationService).getAllApplications();
//        verify(userRepository).findById(1);
//        verify(userRepository, never()).findById(5);
//    }
//
//    @Test
//    @WithMockUser(roles = "EMPLOYEE")
//    void testAssignApplicationHandlesDatabaseError() throws Exception {
//        // Given
//        when(applicationService.getApplicationById(1)).thenReturn(testApplication);
//        when(applicationService.saveApplication(any(Application.class)))
//                .thenThrow(new RuntimeException("Database connection error"));
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("caseworkerId", 5);
//
//        // When & Then
//        mockMvc.perform(put("/api/caseworker/applications/1/assign")
//                        .with(csrf())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isInternalServerError())
//                .andExpect(jsonPath("$.success").value(false))
//                .andExpect(jsonPath("$.message").exists())
//                .andExpect(jsonPath("$.error").value("RuntimeException"));
//
//        verify(applicationService).getApplicationById(1);
//        verify(applicationService).saveApplication(any(Application.class));
//    }
//}
//
