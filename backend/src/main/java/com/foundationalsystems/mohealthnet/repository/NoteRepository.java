// NoteRepository.java
package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Page<Note> findByAuthorId(Integer authorId, Pageable pageable);
    Page<Note> findByIsGlobalTrue(Pageable pageable);
    Page<Note> findByTargetUserIdOrIsGlobalTrue(Integer targetUserId, Pageable pageable);
    List<Note> findByTargetUserId(Integer targetUserId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Note n SET n.status = 'ARCHIVED' WHERE n.id = :noteId")
    int archiveNote(@Param("noteId") Long noteId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Note n SET n.status = 'DELETED', n.deletedAt = :deletedAt WHERE n.id = :noteId")
    int softDeleteNote(@Param("noteId") Long noteId, @Param("deletedAt") LocalDateTime deletedAt);
}