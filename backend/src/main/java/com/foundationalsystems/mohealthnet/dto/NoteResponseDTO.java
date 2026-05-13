package com.foundationalsystems.mohealthnet.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoteResponseDTO {
    private Long id;
    private String title;
    private String content;
    private Integer authorId;
    private String authorName; 
    private String authorEmail; 
    private Integer targetUserId;
    private String targetUserName; 
    private String targetUserEmail; 
    private Boolean isGlobal;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}