// UserSummary.java
package com.foundationalsystems.mohealthnet.dto;

import com.foundationalsystems.mohealthnet.entity.User;
import java.time.LocalDate;

public interface UserSummary {
    Integer getId();

    String getUsername(); // email

    String getFirstName();

    String getLastName();

    String getMiddleName();

    User.UserRole getRole();

    User.UserStatus getStatus();
}