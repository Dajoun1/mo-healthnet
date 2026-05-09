package com.foundationalsystems.mohealthnet.dto;

import lombok.Data;

@Data
public class NoteUpdateRequestDTO {
    private String title;
    private String content;
    private Boolean isGlobal;
    private Integer targetUserId;
    private String targetUserEmail; 
}