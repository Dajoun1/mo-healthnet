// NoteResponseDTO.java
package com.foundationalsystems.mohealthnet.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoteResponseDTO {
    private Long id;
    private String title;
    private String content;
    private Integer authorId;
    private String authorName; // New field
    private String authorEmail; // New field
    private Integer targetUserId;
    private String targetUserName; // New field
    private String targetUserEmail; // New field
    private Boolean isGlobal;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}