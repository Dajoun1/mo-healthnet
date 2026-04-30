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
    birth_date DATE,
    ssn CHAR(9),
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

CREATE TABLE Application (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    household_size INT,
    verification_status ENUM('Pending','Approved','Denied') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES  User(id)
);

CREATE TABLE Employer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    phone CHAR(10)
);

CREATE TABLE Employment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    employer_id INT NOT NULL,
    -- separate phone if employee has business line
    phone CHAR(10),
    title VARCHAR(100),
    start_date DATE,
    end_date DATE,
    monthly_income DECIMAL(12,2),
    FOREIGN KEY (application_id) REFERENCES Application(id),
    FOREIGN KEY (employer_id) REFERENCES Employer(id)
);

CREATE TABLE File_Storage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255),
    data LONGBLOB
);

CREATE TABLE Attachment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    file_id INT,
    file_name VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES Application(id),
    FOREIGN KEY (file_id) REFERENCES File_Storage(id)
);

CREATE TABLE Verification_Action (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM(
        'Reviewed Tax Records',
        'Contacted Employer',
        'Requested Additional Info',
        'Approved',
        'Denied'
    ),
    notes TEXT,
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES Application(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);


INSERT INTO User VALUES (NULL,'johndoe@example.com', '$2a$10$RhAhKs6o4YJ2pYMPtvFzDOwtm.9pkesynV9Bx6KhUH9TIkwB.D/.O', 'John', NULL, 'Doe', '1990-01-01', '123456789', '5551234567', '111 street', 'St. Louis', 'MO', 63000, 'Applicant', False, NULL, NULL);
-- applicant123
INSERT INTO User VALUES (NULL,'janedoe@example.com', '$2a$10$Jghmn5yEi0wgjPe2lkGZBeDDHlmz.KJSGjO5fY5yfa4/tdK2bjY5S', 'Jane', NULL, 'Doe', '1992-01-01', '023456789', '5551234521', '111 street', 'St. Louis', 'MO', 63000, 'Admin', False, NULL, NULL);
-- admin123
INSERT INTO User VALUES (NULL,'Stevendoe@example.com', '$2a$10$lT83r0FXBIHadIWNCzYgE.b8q3sosWFup2EqQ/Wp0GQ9PfE3jzhEa', 'Steven', NULL, 'Doe', '1991-01-04', '223456789', '5551234543', '111 street', 'St. Louis', 'MO', 63000, 'Employee', False, NULL, NULL);
-- caseworker123
SELECT * FROM User;

-- Additional test data to be added