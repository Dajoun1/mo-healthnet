package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.dto.NoteRequestDTO;
import com.foundationalsystems.mohealthnet.dto.NoteResponseDTO;
import com.foundationalsystems.mohealthnet.entity.Note;
import com.foundationalsystems.mohealthnet.entity.User;
import com.foundationalsystems.mohealthnet.repository.NoteRepository;
import com.foundationalsystems.mohealthnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Transactional
    public NoteResponseDTO createNote(NoteRequestDTO request, Integer authorId) {
        // Get author details
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        
        // Verify author is employee or admin
        if (author.getRole() != User.UserRole.EMPLOYEE && author.getRole() != User.UserRole.ADMIN) {
            throw new RuntimeException("Only employees and admins can create notes");
        }
        
        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setAuthorId(authorId);
        note.setIsGlobal(request.getIsGlobal() != null ? request.getIsGlobal() : false);
        
        // Handle targeting by email or user ID
        if (!note.getIsGlobal()) {
            Integer targetId = null;
            
            // Priority: Use email if provided, otherwise use targetUserId
            if (request.getTargetUserEmail() != null && !request.getTargetUserEmail().trim().isEmpty()) {
                User targetUser = userRepository.findByUsername(request.getTargetUserEmail())
                        .orElseThrow(() -> new RuntimeException("Applicant not found with email: " + request.getTargetUserEmail()));
                
                // Verify target is an applicant
                if (targetUser.getRole() != User.UserRole.APPLICANT) {
                    throw new RuntimeException("Notes can only be sent to applicants");
                }
                targetId = targetUser.getId();
            } else if (request.getTargetUserId() != null) {
                targetId = request.getTargetUserId();
            } else {
                throw new RuntimeException("Either target user email or ID is required for non-global notes");
            }
            
            note.setTargetUserId(targetId);
        }
        
        Note savedNote = noteRepository.save(note);
        return convertToDTO(savedNote);
    }

    @Transactional
    public NoteResponseDTO updateNote(Long noteId, NoteRequestDTO request, Integer authorId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (!note.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You can only update your own notes");
        }
        
        if (request.getTitle() != null) note.setTitle(request.getTitle());
        if (request.getContent() != null) note.setContent(request.getContent());
        if (request.getIsGlobal() != null) {
            note.setIsGlobal(request.getIsGlobal());
            // If changing to global, remove target
            if (request.getIsGlobal()) {
                note.setTargetUserId(null);
            }
        }
        
        // Handle targeting by email or user ID for non-global notes
        if (!note.getIsGlobal() && request.getTargetUserEmail() != null && !request.getTargetUserEmail().trim().isEmpty()) {
            User targetUser = userRepository.findByUsername(request.getTargetUserEmail())
                    .orElseThrow(() -> new RuntimeException("Applicant not found with email: " + request.getTargetUserEmail()));
            
            if (targetUser.getRole() != User.UserRole.APPLICANT) {
                throw new RuntimeException("Notes can only be sent to applicants");
            }
            note.setTargetUserId(targetUser.getId());
        } else if (request.getTargetUserId() != null && !note.getIsGlobal()) {
            note.setTargetUserId(request.getTargetUserId());
        }
        
        Note updatedNote = noteRepository.save(note);
        return convertToDTO(updatedNote);
    }

    @Transactional
    public void deleteNote(Long noteId, Integer authorId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (!note.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You can only delete your own notes");
        }
        
        noteRepository.deleteById(noteId);
    }

    @Transactional(readOnly = true)
    public Page<NoteResponseDTO> getNotesForApplicant(Integer userId, Pageable pageable) {
        Page<Note> notes = noteRepository.findByTargetUserIdOrIsGlobalTrue(userId, pageable);
        return notes.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<NoteResponseDTO> getNotesByAuthor(Integer authorId, Pageable pageable) {
        Page<Note> notes = noteRepository.findByAuthorId(authorId, pageable);
        return notes.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<NoteResponseDTO> getAllGlobalNotes(Pageable pageable) {
        Page<Note> notes = noteRepository.findByIsGlobalTrue(pageable);
        return notes.map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public NoteResponseDTO getNoteById(Long noteId, Integer userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        // Check if user has access
        if (!note.getIsGlobal() && !note.getAuthorId().equals(userId) && !note.getTargetUserId().equals(userId)) {
            throw new RuntimeException("You don't have access to this note");
        }
        
        return convertToDTO(note);
    }

    private NoteResponseDTO convertToDTO(Note note) {
        NoteResponseDTO dto = new NoteResponseDTO();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setAuthorId(note.getAuthorId());
        dto.setTargetUserId(note.getTargetUserId());
        dto.setIsGlobal(note.getIsGlobal());
        dto.setStatus(note.getStatus() != null ? note.getStatus().name() : "ACTIVE");
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());
        
        // Get author details
        userRepository.findById(note.getAuthorId()).ifPresent(author -> {
            dto.setAuthorName(author.getFirstName() + " " + author.getLastName());
            dto.setAuthorEmail(author.getUsername());
        });
        
        // Get target user details
        if (note.getTargetUserId() != null) {
            userRepository.findById(note.getTargetUserId()).ifPresent(target -> {
                dto.setTargetUserName(target.getFirstName() + " " + target.getLastName());
                dto.setTargetUserEmail(target.getUsername());
            });
        }
        
        return dto;
    }
}