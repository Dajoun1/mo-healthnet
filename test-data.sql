-- Test Data for Employment_App Database
-- Hashes generated from TestPasswordHashGenerator.java with fixed seed

USE Employment_App;

-- Create test users with bcrypt password hashes
-- SSN format: 9 digits without dashes (as per User entity constraint)

INSERT INTO User (username, password_hash, first_name, middle_name, last_name, birth_date, ssn_hash, phone, street_address, city, state, zip_code, role, status, profile_complete, created_at, last_login)
VALUES
  -- Username: applicant@test.com, Password: applicant123
  ('applicant@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'John', NULL, 'Doe', '1990-01-15', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551234567', '123 Main St', 'Kansas City', 'MO', '64101', 'Applicant', 'Active', FALSE, NOW(), NOW()),

  -- Username: admin@test.com, Password: admin123
  ('admin@test.com', '$2a$10$gsVts3fytdh9nHp.nUXfVuiSzkp9x9vOQoqlQ7qZAaVWlwdTIv7oy', 'Admin', NULL, 'User', '1985-05-20', '$2a$10$gsVts3fytdh9nHp.nUXfVuiSzkp9x9vOQoqlQ7qZAaVWlwdTIv7oy', '5551234568', '456 Admin Blvd', 'Jefferson City', 'MO', '65101', 'Admin', 'Active', TRUE, NOW(), NOW()),

  -- Username: caseworker@test.com, Password: caseworker123
  ('caseworker@test.com', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', 'Jane', 'Marie', 'Smith', '1988-08-10', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', '5551234569', '789 Oak Ave', 'Springfield', 'MO', '65802', 'Employee', 'Active', TRUE, NOW(), NOW()),

  -- Additional Applicants
  -- Username: michael.brown@test.com, Password: applicant123
  ('michael.brown@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'Michael', 'James', 'Brown', '1995-03-22', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551237890', '234 Elm St', 'St. Louis', 'MO', '63101', 'Applicant', 'Active', TRUE, NOW(), NOW()),

  -- Username: sarah.johnson@test.com, Password: applicant123
  ('sarah.johnson@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'Sarah', NULL, 'Johnson', '1992-07-14', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551238901', '567 Pine Rd', 'Columbia', 'MO', '65201', 'Applicant', 'Active', FALSE, NOW(), NOW()),

  -- Username: david.garcia@test.com, Password: applicant123
  ('david.garcia@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'David', 'Luis', 'Garcia', '1987-11-05', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551239012', '890 Maple Dr', 'Independence', 'MO', '64050', 'Applicant', 'Active', TRUE, NOW(), NOW()),

  -- Username: emily.davis@test.com, Password: applicant123
  ('emily.davis@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'Emily', 'Rose', 'Davis', '1998-09-18', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551230123', '345 Cedar Ln', 'Kansas City', 'MO', '64108', 'Applicant', 'Pending', FALSE, NOW(), NOW()),

  -- Username: robert.wilson@test.com, Password: applicant123
  ('robert.wilson@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'Robert', 'Lee', 'Wilson', '1993-12-30', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551231234', '678 Birch St', 'St. Joseph', 'MO', '64501', 'Applicant', 'Active', TRUE, NOW(), NOW()),

  -- Username: lisa.martinez@test.com, Password: applicant123
  ('lisa.martinez@test.com', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', 'Lisa', 'Ann', 'Martinez', '1991-04-25', '$2a$10$cvFfC/237EGbt5l0t3oumuck2tfYEPCIrIuwFHRI74V7wor63RgLS', '5551232345', '901 Walnut Ave', 'Joplin', 'MO', '64801', 'Applicant', 'Suspended', FALSE, NOW(), '2026-03-15 10:30:00'),

  -- Additional Employees (Caseworkers)
  -- Username: thomas.anderson@test.com, Password: caseworker123
  ('thomas.anderson@test.com', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', 'Thomas', 'Edward', 'Anderson', '1986-06-12', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', '5551233456', '123 Professional Way', 'Jefferson City', 'MO', '65109', 'Employee', 'Active', TRUE, NOW(), NOW()),

  -- Username: patricia.taylor@test.com, Password: caseworker123
  ('patricia.taylor@test.com', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', 'Patricia', 'Lynn', 'Taylor', '1984-02-28', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', '5551234567', '456 Government St', 'Springfield', 'MO', '65806', 'Employee', 'Active', TRUE, NOW(), NOW()),

  -- Username: christopher.lee@test.com, Password: caseworker123
  ('christopher.lee@test.com', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', 'Christopher', 'Michael', 'Lee', '1989-10-17', '$2a$10$TNYeCGntmMr8SJIJsD60Du4oIoQ36C/Ch/4v7ETWeLgoXpQ4dzzqq', '5551235678', '789 Services Blvd', 'Columbia', 'MO', '65203', 'Employee', 'Active', TRUE, NOW(), NOW());


-- Execute this SQL in MySQL Workbench