-- Eli Koyn
-- Employment Application initialization script
DROP DATABASE IF EXISTS Employment_App;
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
    birth_date DATE NOT NULL,
    ssn CHAR(9) NOT NULL,
    phone CHAR(10),
    -- holds all users, defined by role attribute
    role ENUM('Applicant','Employee','Admin') NOT NULL,
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


INSERT INTO User VALUES (NULL,'johndoe@example.com', '$2a$10$cvFfC/237EGbt5l0t3oumu3EmxCBPX.pl8D3OveOx707g4kET6DVO', 'John', NULL, 'Doe', '1990-01-01', '123456789', '5551234567', 'Employee', NULL, NULL);
INSERT INTO User VALUES (NULL,'janedoe@example.com', '$2a$10$gsVts3fytdh9nHp.nUXfVuiSzkp9x9vOQoqlQ7qZAaVWlwdTIv7oy', 'Jane', NULL, 'Doe', '1992-01-01', '023456789', '5551234521', 'Admin', NULL, NULL);
INSERT INTO User VALUES (NULL,'Stevendoe@example.com', '$2a$10$TNYeCGntmMr8SJIJsD60DuMSkMnKtE/.8F65pYqIV4OYmD.rgkTsi', 'Steven', NULL, 'Doe', '1991-01-04', '223456789', '5551234543', 'Applicant', NULL, NULL);

-- Additional test data to be added
