// NoteRequestDTO.java
package com.foundationalsystems.mohealthnet.dto;

import lombok.Data;

@Data
public class NoteRequestDTO {
    private String title;
    private String content;
    private Integer targetUserId;  
    private String targetUserEmail; 
    private Boolean isGlobal = false;
}