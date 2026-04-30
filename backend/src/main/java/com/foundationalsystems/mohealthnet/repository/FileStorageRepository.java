package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.FileStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileStorageRepository extends JpaRepository<FileStorage, Integer> {
}