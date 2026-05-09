package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.entity.Attachment;
import com.foundationalsystems.mohealthnet.entity.FileStorage;
import com.foundationalsystems.mohealthnet.repository.AttachmentRepository;
import com.foundationalsystems.mohealthnet.repository.FileStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentService.class);

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private FileStorageRepository fileStorageRepository;

    public List<Attachment> saveAttachments(Integer applicationId, MultipartFile[] files) throws IOException {
        LOG.info("Starting file upload for application {}: {} files", applicationId, files.length);
        List<Attachment> savedAttachments = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            LOG.debug("Processing file {}/{}: {} ({} bytes)", i + 1, files.length, file.getOriginalFilename(), file.getSize());

            try {
                // Save file data to FileStorage
                LOG.debug("Creating FileStorage entity for: {}", file.getOriginalFilename());
                FileStorage fileStorage = new FileStorage();
                fileStorage.setFileName(file.getOriginalFilename());

                LOG.debug("Reading file bytes...");
                byte[] fileBytes = file.getBytes();
                LOG.debug("File bytes read: {} bytes", fileBytes.length);
                fileStorage.setData(fileBytes);

                LOG.debug("Saving to FileStorage repository...");
                fileStorage = fileStorageRepository.save(fileStorage);
                LOG.info("✅ Saved file to FileStorage with ID: {}", fileStorage.getId());

                // Save attachment metadata
                LOG.debug("Creating Attachment entity...");
                Attachment attachment = new Attachment();
                attachment.setApplicationId(applicationId);
                attachment.setFileId(fileStorage.getId());
                attachment.setFileName(file.getOriginalFilename());
                attachment.setFilePath("/files/" + fileStorage.getId());

                LOG.debug("Saving to Attachment repository...");
                attachment = attachmentRepository.save(attachment);
                savedAttachments.add(attachment);
                LOG.info("✅ Successfully saved attachment: {} (ID: {})", file.getOriginalFilename(), attachment.getId());
            } catch (Exception e) {
                LOG.error("❌ FAILED to save file: {}", file.getOriginalFilename());
                LOG.error("Exception type: {}", e.getClass().getName());
                LOG.error("Exception message: {}", e.getMessage());
                if (e.getCause() != null) {
                    LOG.error("Root cause type: {}", e.getCause().getClass().getName());
                    LOG.error("Root cause message: {}", e.getCause().getMessage());
                }
                LOG.error("Full stack trace:", e);
                throw new IOException("Failed to save file: " + file.getOriginalFilename(), e);
            }
        }

        LOG.info("Successfully uploaded {} files for application {}", savedAttachments.size(), applicationId);
        return savedAttachments;
    }

    public List<Attachment> getAttachmentsByApplicationId(Integer applicationId) {
        return attachmentRepository.findByApplicationId(applicationId);
    }

    public FileStorage getFileById(Integer fileId) {
        return fileStorageRepository.findById(fileId).orElse(null);
    }
}