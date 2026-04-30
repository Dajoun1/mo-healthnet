package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.entity.Attachment;
import com.foundationalsystems.mohealthnet.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:3000")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFiles(
            @RequestParam("applicationId") Integer applicationId,
            @RequestParam("files") MultipartFile[] files) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<Attachment> attachments = attachmentService.saveAttachments(applicationId, files);
            response.put("success", true);
            response.put("message", "Files uploaded successfully");
            response.put("attachments", attachments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload files: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<Map<String, Object>> getAttachments(@PathVariable Integer applicationId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Attachment> attachments = attachmentService.getAttachmentsByApplicationId(applicationId);
            response.put("success", true);
            response.put("attachments", attachments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve attachments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}