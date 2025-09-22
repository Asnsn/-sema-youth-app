-- SEMA Youth App - Setup para Neon Database (sem Supabase Auth)
-- Execute este script no seu banco Neon

-- ==============================================
-- 1. SCHEMA PRINCIPAL
-- ==============================================

-- Units table (SEMA locations)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Brasil',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert SEMA units
INSERT INTO units (name, location, country) VALUES
  ('Carmem Cristina', 'Hortolândia', 'Brasil'),
  ('São Clemente', 'Monte Mor', 'Brasil'),
  ('Nova Hortolândia', 'Hortolândia', 'Brasil'),
  ('Jardim Paulista', 'Monte Mor', 'Brasil'),
  ('Nawampity', 'Uganda', 'Uganda')
ON CONFLICT DO NOTHING;

-- User profiles table (sem referência ao auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  unit_id UUID REFERENCES units(id),
  date_of_birth DATE,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities/Modalidades table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('sports', 'cultural', 'educational', 'social')),
  unit_id UUID REFERENCES units(id),
  max_participants INTEGER DEFAULT 30,
  age_min INTEGER DEFAULT 6,
  age_max INTEGER DEFAULT 18,
  schedule_days TEXT[], -- Array of days: ['monday', 'wednesday', 'friday']
  schedule_time TIME,
  teacher_id UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student enrollments in activities
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'completed', 'dropped')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, activity_id)
);

-- Attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, activity_id, date)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  unit_id UUID REFERENCES units(id),
  activity_id UUID REFERENCES activities(id), -- Optional: event specific to an activity
  is_public BOOLEAN DEFAULT true,
  max_participants INTEGER,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show')),
  UNIQUE(event_id, student_id)
);

-- ==============================================
-- 2. DADOS DE EXEMPLO
-- ==============================================

-- Insert sample users
INSERT INTO profiles (id, full_name, email, role, unit_id, phone, date_of_birth, password_hash) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Admin SEMA', 'admin@sema.org.br', 'admin', (SELECT id FROM units WHERE name = 'Carmem Cristina'), '(11) 99999-0001', '1980-01-01', 'sema2024admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Professor Silva', 'professor@sema.org.br', 'teacher', (SELECT id FROM units WHERE name = 'Carmem Cristina'), '(11) 99999-0002', '1985-05-15', 'sema2024prof'),
  ('550e8400-e29b-41d4-a716-446655440003', 'João Silva', 'joao@email.com', 'student', (SELECT id FROM units WHERE name = 'Carmem Cristina'), '(11) 99999-0003', '2005-03-20', 'sema2024aluno'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Maria Santos', 'maria@email.com', 'student', (SELECT id FROM units WHERE name = 'São Clemente'), '(11) 99999-0004', '2006-07-10', 'sema2024aluno'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Pedro Costa', 'pedro@email.com', 'student', (SELECT id FROM units WHERE name = 'Nova Hortolândia'), '(11) 99999-0005', '2004-12-05', 'sema2024aluno')
ON CONFLICT (email) DO NOTHING;

-- Insert sample activities
INSERT INTO activities (name, description, category, unit_id, max_participants, age_min, age_max, schedule_days, schedule_time, teacher_id) VALUES
  ('Futebol Masculino', 'Treinos e jogos de futebol para jovens', 'sports', (SELECT id FROM units WHERE name = 'Carmem Cristina'), 25, 12, 18, ARRAY['monday', 'wednesday', 'friday'], '18:00', '550e8400-e29b-41d4-a716-446655440002'),
  ('Dança Contemporânea', 'Aulas de dança contemporânea', 'cultural', (SELECT id FROM units WHERE name = 'Carmem Cristina'), 20, 10, 16, ARRAY['tuesday', 'thursday'], '16:00', '550e8400-e29b-41d4-a716-446655440002'),
  ('Capoeira', 'Aulas de capoeira tradicional', 'cultural', (SELECT id FROM units WHERE name = 'São Clemente'), 22, 8, 16, ARRAY['monday', 'wednesday'], '17:00', '550e8400-e29b-41d4-a716-446655440002'),
  ('Teatro Juvenil', 'Grupo de teatro para jovens', 'cultural', (SELECT id FROM units WHERE name = 'Nova Hortolândia'), 15, 12, 18, ARRAY['saturday'], '14:00', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Insert sample enrollments
INSERT INTO enrollments (student_id, activity_id, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM activities WHERE name = 'Futebol Masculino'), 'active'),
  ('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM activities WHERE name = 'Dança Contemporânea'), 'active'),
  ('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM activities WHERE name = 'Capoeira'), 'active')
ON CONFLICT (student_id, activity_id) DO NOTHING;

-- Insert sample attendance
INSERT INTO attendance (student_id, activity_id, date, status, recorded_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM activities WHERE name = 'Futebol Masculino'), CURRENT_DATE, 'present', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM activities WHERE name = 'Dança Contemporânea'), CURRENT_DATE, 'present', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM activities WHERE name = 'Capoeira'), CURRENT_DATE, 'absent', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (student_id, activity_id, date) DO NOTHING;

-- ==============================================
-- 3. SISTEMA DE NOTIFICAÇÕES
-- ==============================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('enrollment', 'attendance', 'activity', 'system', 'reminder')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger to send notification when student enrolls
CREATE OR REPLACE FUNCTION notify_enrollment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Send notification to student
  PERFORM send_notification(
    NEW.student_id,
    'Inscrição Confirmada',
    'Sua inscrição na atividade foi confirmada com sucesso!',
    'enrollment',
    jsonb_build_object(
      'activity_id', NEW.activity_id,
      'enrollment_id', NEW.id
    )
  );
  
  -- Send notification to teacher
  PERFORM send_notification(
    (SELECT teacher_id FROM activities WHERE id = NEW.activity_id),
    'Nova Inscrição',
    'Um novo aluno se inscreveu na sua atividade.',
    'enrollment',
    jsonb_build_object(
      'activity_id', NEW.activity_id,
      'student_id', NEW.student_id,
      'enrollment_id', NEW.id
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_enrollment_created ON enrollments;
CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION notify_enrollment();

-- Create trigger to send notification when attendance is marked
CREATE OR REPLACE FUNCTION notify_attendance()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Send notification to student about attendance
  PERFORM send_notification(
    NEW.student_id,
    'Presença Registrada',
    CASE 
      WHEN NEW.status = 'present' THEN 'Sua presença foi registrada com sucesso!'
      WHEN NEW.status = 'absent' THEN 'Sua ausência foi registrada.'
      WHEN NEW.status = 'late' THEN 'Você foi marcado como atrasado.'
      ELSE 'Seu status de presença foi atualizado.'
    END,
    'attendance',
    jsonb_build_object(
      'activity_id', NEW.activity_id,
      'date', NEW.date,
      'status', NEW.status,
      'attendance_id', NEW.id
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_attendance_created ON attendance;
CREATE TRIGGER on_attendance_created
  AFTER INSERT OR UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION notify_attendance();

-- ==============================================
-- 4. VERIFICAÇÃO FINAL
-- ==============================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'units' as table_name, count(*) as records 
FROM units
UNION ALL
SELECT 
  'profiles' as table_name, count(*) as records 
FROM profiles
UNION ALL
SELECT 
  'activities' as table_name, count(*) as records 
FROM activities
UNION ALL
SELECT 
  'enrollments' as table_name, count(*) as records 
FROM enrollments
UNION ALL
SELECT 
  'attendance' as table_name, count(*) as records 
FROM attendance
UNION ALL
SELECT 
  'notifications' as table_name, count(*) as records 
FROM notifications;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'SEMA Youth App - Setup Neon Database completo!';
  RAISE NOTICE 'Tabelas criadas: units, profiles, activities, enrollments, attendance, events, event_registrations, notifications';
  RAISE NOTICE 'Dados de exemplo inseridos';
  RAISE NOTICE 'Triggers de notificação configurados';
  RAISE NOTICE 'Próximo passo: Configurar Supabase Auth e variáveis de ambiente';
END $$;
