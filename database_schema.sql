-- Eli Koyn
-- Employment Application initialization script
-- DROP DATABASE IF EXISTS Employment_App;
CREATE DATABASE IF NOT EXISTS Employment_App;
USE Employment_App;

CREATE TABLE User (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL UNIQUE,
    -- to store hash
                      password_hash CHAR(60) NOT NULL,
                      first_name VARCHAR(50) NOT NULL,
                      middle_name VARCHAR(50),
                      last_name VARCHAR(50) NOT NULL,
                      birth_date DATE,
                      ssn CHAR(4),
                      phone CHAR(10),
                      street_address VARCHAR(100),
                      city VARCHAR(50),
                      state CHAR(2),
                      zip_code CHAR(5),
    -- holds all users, defined by role attribute
                      role ENUM('Applicant','Employee','Admin') NOT NULL,
                      profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                      last_login DATETIME
);

CREATE TABLE User_Audit_Log (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
    -- lock out? would need additional table
                                action_type ENUM(
        'Login',
        'Logout',
        'Password Change',
        'Account Created',
        'Account Updated',
        'Application Submitted',
        'Attachment Uploaded',
        'User Role Changed'
    ),
    -- entity could be enum but would relate to an object with associated id
                                entity_id INT,
                                entity_type VARCHAR(50),
                                action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                                ip_address VARCHAR(45),
    -- browser, etc. where the req came from
                                user_agent VARCHAR(255),
                                FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Login_Attempt (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               user_id INT,
                               attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                               success BOOLEAN NOT NULL,
                               ip_address VARCHAR(45),
                               user_agent VARCHAR(255),
    -- could make this bigger if we want to dump application error here
                               failure_reason VARCHAR(255),
                               FOREIGN KEY (user_id) REFERENCES User(id)
);