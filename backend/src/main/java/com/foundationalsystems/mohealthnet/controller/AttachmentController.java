package com.foundationalsystems.mohealthnet.controller;

import com.foundationalsystems.mohealthnet.entity.Attachment;
import com.foundationalsystems.mohealthnet.entity.FileStorage;
import com.foundationalsystems.mohealthnet.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:3000")
public class AttachmentController {

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentController.class);

    @Autowired
    private AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFiles(
            @RequestParam("applicationId") Integer applicationId,
            @RequestParam("files") MultipartFile[] files) {

        Map<String, Object> response = new HashMap<>();

        LOG.info("Received file upload request for application {}: {} files", applicationId, files.length);

        // Log file details
        for (int i = 0; i < files.length; i++) {
            LOG.debug("File {}: name={}, size={}, contentType={}",
                i + 1, files[i].getOriginalFilename(), files[i].getSize(), files[i].getContentType());
        }

        try {
            List<Attachment> attachments = attachmentService.saveAttachments(applicationId, files);

            // Build simple response without full entities to avoid serialization issues
            List<Map<String, Object>> attachmentData = new ArrayList<>();
            for (Attachment att : attachments) {
                Map<String, Object> attMap = new HashMap<>();
                attMap.put("id", att.getId());
                attMap.put("fileName", att.getFileName());
                attMap.put("filePath", att.getFilePath());
                attMap.put("uploadedAt", att.getUploadedAt().toString());
                attachmentData.add(attMap);
            }

            response.put("success", true);
            response.put("message", "Files uploaded successfully");
            response.put("attachments", attachmentData);
            LOG.info("Successfully uploaded {} files for application {}", files.length, applicationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOG.error("Failed to upload files for application {}: {}", applicationId, e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Unable to upload files: " + e.getMessage());
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
            LOG.error("Failed to retrieve attachments for application {}: {}", applicationId, e.getMessage());
            response.put("success", false);
            response.put("message", "Unable to retrieve attachments");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Integer fileId) {
        try {
            FileStorage fileStorage = attachmentService.getFileById(fileId);

            if (fileStorage == null) {
                LOG.warn("File not found: {}", fileId);
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileStorage.getFileName());

            LOG.info("File downloaded: {}", fileStorage.getFileName());
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileStorage.getData());

        } catch (Exception e) {
            LOG.error("Failed to download file {}: {}", fileId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}