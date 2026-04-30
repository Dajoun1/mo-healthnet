package com.foundationalsystems.mohealthnet.repository;

import com.foundationalsystems.mohealthnet.dto.UserSummary;
import com.foundationalsystems.mohealthnet.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);


    Page<UserSummary> findByRole(User.UserRole role, Pageable pageable);

    Page<UserSummary> findByStatus(User.UserStatus status, Pageable pageable);

    List<UserSummary> findByRole(User.UserRole role);

    List<UserSummary> findByStatus(User.UserStatus status);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    int updateUserStatus(@Param("userId") Integer userId, @Param("status") User.UserStatus status);

    long countByRole(User.UserRole role);

    long countByStatus(User.UserStatus status);
}