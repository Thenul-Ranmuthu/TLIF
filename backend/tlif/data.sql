-- Run with: psql -d <db> -f backend/tlif/data.sql

-- Drop tables if they exist 
DROP TABLE IF EXISTS scoring_records CASCADE;
DROP TABLE IF EXISTS progress_reports CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS budget_categories CASCADE;
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS grantees CASCADE;

-- Grantees 
CREATE TABLE grantees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  faculty VARCHAR(128) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  research_title TEXT NOT NULL,
  amount_allocated BIGINT NOT NULL
);

-- Applicants 
CREATE TABLE applicants (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  faculty VARCHAR(128) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  research_title TEXT NOT NULL,
  status VARCHAR(16) NOT NULL,
  amount_requested BIGINT NOT NULL
);

-- Budget categories 
CREATE TABLE budget_categories (
  id BIGSERIAL PRIMARY KEY,
  grantee_id BIGINT NOT NULL REFERENCES grantees(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  amount_requested BIGINT NOT NULL,
  amount_approved BIGINT NOT NULL,
  amount_spent BIGINT NOT NULL DEFAULT 0
);

-- Receipts 
CREATE TABLE receipts (
  id BIGSERIAL PRIMARY KEY,
  receipt_code VARCHAR(64) NOT NULL UNIQUE,
  grantee_id BIGINT NOT NULL REFERENCES grantees(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_claimed BIGINT NOT NULL,
  status VARCHAR(16) NOT NULL,
  uploaded_date DATE,
  amount_approved BIGINT,
  approved_by VARCHAR(128),
  comment TEXT
);

-- Progress reports 
CREATE TABLE progress_reports (
  id BIGSERIAL PRIMARY KEY,
  grantee_id BIGINT NOT NULL REFERENCES grantees(id) ON DELETE CASCADE,
  quarter VARCHAR(8) NOT NULL,
  due_date DATE NOT NULL,
  submitted_date DATE,
  status VARCHAR(16) NOT NULL
);

-- Scoring records 
CREATE TABLE scoring_records (
  id BIGSERIAL PRIMARY KEY,
  applicant_id BIGINT NOT NULL UNIQUE REFERENCES applicants(id) ON DELETE CASCADE,
  alignment INTEGER NOT NULL,
  contribution INTEGER NOT NULL,
  innovation INTEGER NOT NULL,
  outcomes INTEGER NOT NULL,
  budget INTEGER NOT NULL,
  stakeholders INTEGER NOT NULL,
  students INTEGER NOT NULL,
  total_score INTEGER NOT NULL
);

-- Seed grantees
INSERT INTO grantees (name, faculty, email, research_title, amount_allocated) VALUES
('Dr. D. Wickramasinghe', 'Computing', 'd.wickramasinghe@sliit.lk', 'AI-Enhanced Blended Learning', 250000),
('Prof. K. Perera', 'Engineering', 'k.perera@sliit.lk', 'PBL Curriculum Redesign', 300000),
('Dr. S. Abeynayake', 'Information Tech.', 's.abeynayake@sliit.lk', 'Student Engagement Analytics', 200000),
('Dr. N. Fernando', 'Business', 'n.fernando@sliit.lk', 'Gamified Assessment Tools', 180000),
('Ms. M. Rajapaksha', 'Computing', 'm.rajapaksha@sliit.lk', 'Adaptive Feedback Systems', 200000)
;

-- Seed applicants 
INSERT INTO applicants (name, faculty, email, research_title, status, amount_requested) VALUES
('Dr. D. Wickramasinghe', 'Computing', 'd.wickramasinghe@sliit.lk', 'AI-Enhanced Blended Learning', 'SELECTED', 280000),
('Prof. K. Perera', 'Engineering', 'k.perera@sliit.lk', 'PBL Curriculum Redesign', 'SELECTED', 320000),
('Dr. S. Abeynayake', 'Information Tech.', 's.abeynayake@sliit.lk', 'Student Engagement Analytics', 'SELECTED', 220000),
('Dr. N. Fernando', 'Business', 'n.fernando@sliit.lk', 'Gamified Assessment Tools', 'SELECTED', 190000),
('Ms. M. Rajapaksha', 'Computing', 'm.rajapaksha@sliit.lk', 'Adaptive Feedback Systems', 'SELECTED', 200000),
('Dr. R. Silva', 'Science', 'r.silva@sliit.lk', 'Virtual Lab Platform', 'REJECTED', 410000)
;

-- Associate applicants to grantees where applicable by updating applicants to reference grantee rows (simple approach using emails)
-- This updates applicants table to add linkage by finding the grantee with the same email (if present)
ALTER TABLE applicants ADD COLUMN linked_grantee_id BIGINT;
UPDATE applicants a
SET linked_grantee_id = g.id
FROM grantees g
WHERE a.email = g.email;

-- Seed budget categories (for each grantee by id)
-- We assume grantee ids are 1..5 (insert order) — use joins if DB assigns different ids
INSERT INTO budget_categories (grantee_id, category_name, amount_requested, amount_approved, amount_spent) VALUES
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Research Assistants', 80000, 60000, 40000),
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Equipment', 70000, 70000, 70000),
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Workshops', 80000, 80000, 50000),
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Miscellaneous', 50000, 40000, 20000),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Research Assistants', 90000, 80000, 40000),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Workshops', 120000, 100000, 80000),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Materials', 60000, 60000, 60000),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Miscellaneous', 50000, 60000, 30000),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Research Assistants', 60000, 50000, 25000),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Equipment', 80000, 80000, 45000),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Software Licenses', 50000, 50000, 25000),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Miscellaneous', 30000, 20000, 0),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'), 'Research Assistants', 60000, 50000, 10000),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'), 'Travel', 40000, 30000, 8200),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'), 'Workshops', 50000, 50000, 0),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'), 'Miscellaneous', 40000, 50000, 22000),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'), 'Research Assistants', 70000, 70000, 45000),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'), 'Equipment', 60000, 60000, 60000),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'), 'Workshops', 40000, 40000, 25000),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'), 'Miscellaneous', 30000, 30000, 0)
;

-- Seed receipts
INSERT INTO receipts (receipt_code, grantee_id, category_name, description, amount_claimed, status, uploaded_date, amount_approved, approved_by, comment) VALUES
('R001', (SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Research Assistants', 'RA salary Oct 2024', 20000, 'PENDING', '2024-11-01', NULL, NULL, NULL),
('R002', (SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Equipment', 'Laptop for RA', 70000, 'APPROVED', '2024-10-20', 70000, 'Admin A', 'Verified'),
('R003', (SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'), 'Workshops', 'TL Workshop Nov', 25000, 'APPROVED', '2024-11-15', 25000, 'Admin B', ''),
('R004', (SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Workshops', 'Faculty dev. workshop', 45000, 'PENDING', '2024-11-20', NULL, NULL, NULL),
('R005', (SELECT id FROM grantees WHERE email='k.perera@sliit.lk'), 'Materials', 'Printed curriculum kits', 60000, 'APPROVED', '2024-10-28', 60000, 'Admin A', 'Full amount approved'),
('R006', (SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Equipment', 'Survey licenses', 12500, 'PENDING', '2024-11-25', NULL, NULL, NULL),
('R007', (SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'), 'Research Assistants', 'RA stipend Sep', 25000, 'APPROVED', '2024-10-05', 25000, 'Admin B', ''),
('R008', (SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'), 'Travel', 'Conference – Kandy', 8200, 'PENDING', '2024-11-28', NULL, NULL, NULL),
('R009', (SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'), 'Equipment', 'Dev laptop', 60000, 'APPROVED', '2024-10-18', 60000, 'Admin A', 'Verified with quote')
;

-- Seed progress reports
INSERT INTO progress_reports (grantee_id, quarter, due_date, submitted_date, status) VALUES
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'),'Q1','2024-10-31','2024-10-05','SUBMITTED'),
((SELECT id FROM grantees WHERE email='d.wickramasinghe@sliit.lk'),'Q2','2025-01-31',NULL,'UPCOMING'),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'),'Q1','2024-10-31','2024-10-08','SUBMITTED'),
((SELECT id FROM grantees WHERE email='k.perera@sliit.lk'),'Q2','2025-01-31',NULL,'UPCOMING'),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'),'Q1','2024-10-31','2024-10-12','SUBMITTED'),
((SELECT id FROM grantees WHERE email='s.abeynayake@sliit.lk'),'Q2','2025-01-31',NULL,'UPCOMING'),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'),'Q1','2024-10-31',NULL,'OVERDUE'),
((SELECT id FROM grantees WHERE email='n.fernando@sliit.lk'),'Q2','2025-01-31',NULL,'UPCOMING'),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'),'Q1','2024-10-31','2024-10-11','SUBMITTED'),
((SELECT id FROM grantees WHERE email='m.rajapaksha@sliit.lk'),'Q2','2025-01-31',NULL,'UPCOMING')
;

-- Seed scoring_records 
-- We assume applicants were inserted and can be matched by email
INSERT INTO scoring_records (applicant_id, alignment, contribution, innovation, outcomes, budget, stakeholders, students, total_score) VALUES
((SELECT id FROM applicants WHERE email='d.wickramasinghe@sliit.lk'), 3,3,4,3,3,4,3, 78),
((SELECT id FROM applicants WHERE email='k.perera@sliit.lk'), 3,3,4,3,3,3,3, 74),
((SELECT id FROM applicants WHERE email='s.abeynayake@sliit.lk'), 3,2,4,3,3,4,2, 71),
((SELECT id FROM applicants WHERE email='n.fernando@sliit.lk'), 2,2,3,2,2,4,2, 68),
((SELECT id FROM applicants WHERE email='m.rajapaksha@sliit.lk'), 2,2,3,2,3,3,2, 66),
((SELECT id FROM applicants WHERE email='r.silva@sliit.lk'), 1,2,2,2,1,1,1, 48)
;

-- Clean up temporary column if not needed (linked_grantee_id stored in applicants; convert to proper FK if desired)
ALTER TABLE applicants
  ALTER COLUMN linked_grantee_id DROP DEFAULT;
-- Optionally add FK constraint if you want strict referential integrity:
-- ALTER TABLE applicants ADD CONSTRAINT fk_applicant_linked_grantee FOREIGN KEY (linked_grantee_id) REFERENCES grantees(id) ON DELETE SET NULL;

-- End of seed




