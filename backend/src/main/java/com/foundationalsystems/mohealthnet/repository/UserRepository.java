package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity providing database operations.
 * Authenticates users by email (email serves as unique username).
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

