-- Test users for SEMA app
-- Note: These users will be created through Supabase Auth, but we're preparing their profile data

-- Test credentials (use these to sign up in the app):
-- Admin: admin@sema.org.br / senha123
-- Professor: professor@sema.org.br / senha123  
-- Aluno: aluno@sema.org.br / senha123

-- This script will run after users sign up to update their profiles
-- You can run this manually after creating the test accounts

-- Update admin user profile (replace with actual user ID after signup)
-- UPDATE profiles SET 
--   full_name = 'Administrador SEMA',
--   user_type = 'admin',
--   unit_id = (SELECT id FROM units WHERE name = 'Carmem Cristina' LIMIT 1),
--   phone = '(19) 99999-0001',
--   address = 'Hortolândia, SP',
--   birth_date = '1980-01-01',
--   updated_at = NOW()
-- WHERE email = 'admin@sema.org.br';

-- Update teacher user profile (replace with actual user ID after signup)  
-- UPDATE profiles SET
--   full_name = 'Professor João Silva',
--   user_type = 'teacher', 
--   unit_id = (SELECT id FROM units WHERE name = 'Carmem Cristina' LIMIT 1),
--   phone = '(19) 99999-0002',
--   address = 'Hortolândia, SP',
--   birth_date = '1985-05-15',
--   updated_at = NOW()
-- WHERE email = 'professor@sema.org.br';

-- Update student user profile (replace with actual user ID after signup)
-- UPDATE profiles SET
--   full_name = 'Maria Santos',
--   user_type = 'student',
--   unit_id = (SELECT id FROM units WHERE name = 'Carmem Cristina' LIMIT 1), 
--   phone = '(19) 99999-0003',
--   address = 'Hortolândia, SP',
--   birth_date = '2010-03-20',
--   guardian_name = 'Ana Santos',
--   guardian_phone = '(19) 99999-0004',
--   updated_at = NOW()
-- WHERE email = 'aluno@sema.org.br';

-- Sample enrollments for the student
-- INSERT INTO enrollments (student_id, activity_id, enrollment_date, status)
-- SELECT 
--   (SELECT id FROM profiles WHERE email = 'aluno@sema.org.br'),
--   a.id,
--   CURRENT_DATE,
--   'active'
-- FROM activities a 
-- WHERE a.name IN ('Futebol', 'Reforço Escolar')
-- AND a.unit_id = (SELECT unit_id FROM profiles WHERE email = 'aluno@sema.org.br')
-- LIMIT 2;
