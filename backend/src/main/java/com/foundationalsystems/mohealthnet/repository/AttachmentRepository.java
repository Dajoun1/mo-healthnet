package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Integer> {
    List<Attachment> findByApplicationId(Integer applicationId);
}