package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.dto.NoteRequestDTO;
import com.foundationalsystems.mohealthnet.dto.NoteResponseDTO;
import com.foundationalsystems.mohealthnet.dto.UserSummary;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import com.foundationalsystems.mohealthnet.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<NoteResponseDTO> createNote(
            @RequestBody NoteRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = true) Integer userId) {
        NoteResponseDTO note = noteService.createNote(request, userId);
        return new ResponseEntity<>(note, HttpStatus.CREATED);
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<NoteResponseDTO> updateNote(
            @PathVariable Long noteId,
            @RequestBody NoteRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = true) Integer userId) {
        NoteResponseDTO note = noteService.updateNote(noteId, request, userId);
        return ResponseEntity.ok(note);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long noteId,
            @RequestHeader(value = "X-User-Id", required = true) Integer userId) {
        noteService.deleteNote(noteId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employee/my-notes")
    public ResponseEntity<Page<NoteResponseDTO>> getMyNotes(
            @RequestHeader(value = "X-User-Id", required = true) Integer userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponseDTO> notes = noteService.getNotesByAuthor(userId, pageable);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/global")
    public ResponseEntity<Page<NoteResponseDTO>> getGlobalNotes(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponseDTO> notes = noteService.getAllGlobalNotes(pageable);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/applicant/my-notes")
    public ResponseEntity<Page<NoteResponseDTO>> getMyNotesAsApplicant(
            @RequestHeader(value = "X-User-Id", required = true) Integer userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponseDTO> notes = noteService.getNotesForApplicant(userId, pageable);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponseDTO> getNoteById(
            @PathVariable Long noteId,
            @RequestHeader(value = "X-User-Id", required = true) Integer userId) {
        NoteResponseDTO note = noteService.getNoteById(noteId, userId);
        return ResponseEntity.ok(note);
    }
    
    // New endpoint to validate applicant by email
    @GetMapping("/validate-applicant/{email}")
    public ResponseEntity<?> validateApplicantByEmail(
            @PathVariable String email,
            @RequestHeader(value = "X-User-Id", required = true) Integer userId) {
        
        // Verify the requesting user is employee or admin
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (requester.getRole() != User.UserRole.Employee && requester.getRole() != User.UserRole.Admin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }
        
        User applicant = userRepository.findByUsername(email)
                .orElse(null);
        
        if (applicant == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ValidationResponse(false, "No user found with this email"));
        }
        
        if (applicant.getRole() != User.UserRole.Applicant) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ValidationResponse(false, "User is not an applicant"));
        }
        
        return ResponseEntity.ok(new ValidationResponse(true, "Valid applicant", applicant.getId(), 
                applicant.getFirstName(), applicant.getLastName(), applicant.getUsername()));
    }
    
    // Inner class for validation response
    static class ValidationResponse {
        private boolean valid;
        private String message;
        private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
        
        public ValidationResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }
        
        public ValidationResponse(boolean valid, String message, Integer userId, String firstName, String lastName, String email) {
            this.valid = valid;
            this.message = message;
            this.userId = userId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }
        
        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Integer getUserId() { return userId; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
    }
}