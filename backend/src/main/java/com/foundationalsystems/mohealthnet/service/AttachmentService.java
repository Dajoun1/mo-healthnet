package com.foundationalsystems.mohealthnet.service;

import com.foundationalsystems.mohealthnet.entity.Attachment;
import com.foundationalsystems.mohealthnet.entity.FileStorage;
import com.foundationalsystems.mohealthnet.repository.AttachmentRepository;
import com.foundationalsystems.mohealthnet.repository.FileStorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private FileStorageRepository fileStorageRepository;

    public List<Attachment> saveAttachments(Integer applicationId, MultipartFile[] files) throws IOException {
        List<Attachment> savedAttachments = new ArrayList<>();

        for (MultipartFile file : files) {
            // Save file data to FileStorage
            FileStorage fileStorage = new FileStorage();
            fileStorage.setFileName(file.getOriginalFilename());
            fileStorage.setData(file.getBytes());
            fileStorage = fileStorageRepository.save(fileStorage);

            // Save attachment metadata
            Attachment attachment = new Attachment();
            attachment.setApplicationId(applicationId);
            attachment.setFileId(fileStorage.getId());
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFilePath("/files/" + fileStorage.getId());

            attachment = attachmentRepository.save(attachment);
            savedAttachments.add(attachment);
        }

        return savedAttachments;
    }

    public List<Attachment> getAttachmentsByApplicationId(Integer applicationId) {
        return attachmentRepository.findByApplicationId(applicationId);
    }

    public FileStorage getFileById(Integer fileId) {
        return fileStorageRepository.findById(fileId).orElse(null);
    }
}