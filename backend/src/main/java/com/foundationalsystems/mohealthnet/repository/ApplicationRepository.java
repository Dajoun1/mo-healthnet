package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByUserId(Integer userId);
}

