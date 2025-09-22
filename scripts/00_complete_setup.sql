-- SEMA Youth App - Setup Completo
-- Execute este script completo no seu banco Neon

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

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  unit_id UUID REFERENCES units(id),
  date_of_birth DATE,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
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
-- 2. ROW LEVEL SECURITY
-- ==============================================

-- Enable Row Level Security on all tables
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units (readable by all authenticated users)
CREATE POLICY "units_select_all" ON units FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "units_admin_all" ON units FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_same_unit" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND (p.role IN ('teacher', 'admin') AND p.unit_id = profiles.unit_id)
  )
);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- RLS Policies for activities
CREATE POLICY "activities_select_unit" ON activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.unit_id = activities.unit_id
  )
);
CREATE POLICY "activities_teacher_manage" ON activities FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
    AND profiles.unit_id = activities.unit_id
  )
);

-- RLS Policies for enrollments
CREATE POLICY "enrollments_select_own" ON enrollments FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN activities a ON a.id = enrollments.activity_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = a.unit_id
  )
);
CREATE POLICY "enrollments_insert_own" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "enrollments_teacher_manage" ON enrollments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN activities a ON a.id = enrollments.activity_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = a.unit_id
  )
);

-- RLS Policies for attendance
CREATE POLICY "attendance_select_related" ON attendance FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN activities a ON a.id = attendance.activity_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = a.unit_id
  )
);
CREATE POLICY "attendance_teacher_manage" ON attendance FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN activities a ON a.id = attendance.activity_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = a.unit_id
  )
);

-- RLS Policies for events
CREATE POLICY "events_select_unit" ON events FOR SELECT USING (
  is_public = true OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.unit_id = events.unit_id
  )
);
CREATE POLICY "events_teacher_manage" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
    AND profiles.unit_id = events.unit_id
  )
);

-- RLS Policies for event_registrations
CREATE POLICY "event_registrations_select_own" ON event_registrations FOR SELECT USING (
  auth.uid() = student_id OR
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN events e ON e.id = event_registrations.event_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = e.unit_id
  )
);
CREATE POLICY "event_registrations_insert_own" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "event_registrations_teacher_manage" ON event_registrations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN events e ON e.id = event_registrations.event_id
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
    AND p.unit_id = e.unit_id
  )
);

-- ==============================================
-- 3. TRIGGERS
-- ==============================================

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    role, 
    unit_id
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(new.raw_user_meta_data ->> 'unit_id', (SELECT id FROM units LIMIT 1))
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- 4. DADOS DE EXEMPLO
-- ==============================================

-- Insert sample activities
INSERT INTO activities (name, description, category, unit_id, max_participants, age_min, age_max, schedule_days, schedule_time, teacher_id) VALUES
  ('Futebol Masculino', 'Treinos e jogos de futebol para jovens', 'sports', (SELECT id FROM units WHERE name = 'Carmem Cristina'), 25, 12, 18, ARRAY['monday', 'wednesday', 'friday'], '18:00', NULL),
  ('Dança Contemporânea', 'Aulas de dança contemporânea', 'cultural', (SELECT id FROM units WHERE name = 'Carmem Cristina'), 20, 10, 16, ARRAY['tuesday', 'thursday'], '16:00', NULL),
  ('Capoeira', 'Aulas de capoeira tradicional', 'cultural', (SELECT id FROM units WHERE name = 'São Clemente'), 22, 8, 16, ARRAY['monday', 'wednesday'], '17:00', NULL),
  ('Teatro Juvenil', 'Grupo de teatro para jovens', 'cultural', (SELECT id FROM units WHERE name = 'Nova Hortolândia'), 15, 12, 18, ARRAY['saturday'], '14:00', NULL)
ON CONFLICT DO NOTHING;

-- ==============================================
-- 5. SISTEMA DE NOTIFICAÇÕES
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

-- Enable Row Level Security for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
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
SECURITY definer
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
SECURITY definer
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
SECURITY definer
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
-- 6. USUÁRIOS DE TESTE (via Supabase Auth)
-- ==============================================

-- Note: Os usuários de teste devem ser criados via Supabase Auth
-- Use as seguintes credenciais para teste:

-- Admin:
-- Email: admin@sema.org.br
-- Senha: sema2024admin
-- Role: admin

-- Professor:
-- Email: professor@sema.org.br  
-- Senha: sema2024prof
-- Role: teacher

-- Aluno:
-- Email: aluno@sema.org.br
-- Senha: sema2024aluno
-- Role: student

-- ==============================================
-- SETUP COMPLETO!
-- ==============================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'units' as table_name, count(*) as records 
FROM units
UNION ALL
SELECT 
  'activities' as table_name, count(*) as records 
FROM activities
UNION ALL
SELECT 
  'notifications' as table_name, count(*) as records 
FROM notifications;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'SEMA Youth App - Setup completo realizado com sucesso!';
  RAISE NOTICE 'Tabelas criadas: units, profiles, activities, enrollments, attendance, events, event_registrations, notifications';
  RAISE NOTICE 'Políticas RLS configuradas para todas as tabelas';
  RAISE NOTICE 'Triggers de notificação configurados';
  RAISE NOTICE 'Dados de exemplo inseridos';
  RAISE NOTICE 'Próximo passo: Configurar variáveis de ambiente e testar a aplicação';
END $$;
