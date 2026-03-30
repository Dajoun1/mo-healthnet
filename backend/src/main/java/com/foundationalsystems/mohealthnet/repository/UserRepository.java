package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity providing database operations.
 * Authenticates users by email (stored in the username field).
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
