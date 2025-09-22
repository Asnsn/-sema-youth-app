-- Script de migração para Supabase
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de unidades (se não existir)
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Brasil',
  address TEXT,
  phone TEXT,
  email TEXT,
  capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir unidades de exemplo
INSERT INTO units (id, name, location, country, address, phone, email, capacity) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'Carmem Cristina', 'São Paulo', 'Brasil', 'Rua das Flores, 123', '(11) 99999-0001', 'carmem@sema.org.br', 100),
  ('550e8400-e29b-41d4-a716-446655440011', 'São Clemente', 'São Paulo', 'Brasil', 'Av. São Clemente, 456', '(11) 99999-0002', 'sao.clemente@sema.org.br', 80),
  ('550e8400-e29b-41d4-a716-446655440012', 'Nova Hortolândia', 'Hortolândia', 'Brasil', 'Rua Nova, 789', '(19) 99999-0003', 'nova.hortolandia@sema.org.br', 60),
  ('550e8400-e29b-41d4-a716-446655440013', 'Kampala', 'Kampala', 'Uganda', 'Main Street, 101', '+256 99999-0004', 'kampala@sema.org.br', 120)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar tabela de perfis (usando auth.users do Supabase)
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

-- 4. Criar tabela de atividades
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  unit_id UUID REFERENCES units(id),
  teacher_id UUID REFERENCES profiles(id),
  max_participants INTEGER DEFAULT 20,
  age_min INTEGER DEFAULT 0,
  age_max INTEGER DEFAULT 18,
  schedule_days TEXT[], -- Array de dias da semana
  schedule_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela de inscrições
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(student_id, activity_id)
);

-- 6. Criar tabela de presença
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  marked_by UUID REFERENCES profiles(id),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, activity_id, date)
);

-- 7. Criar tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  unit_id UUID REFERENCES units(id),
  max_participants INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar tabela de inscrições em eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  UNIQUE(event_id, student_id)
);

-- 9. Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Inserir usuários de exemplo (serão criados via Supabase Auth)
-- Estes serão inseridos após criar as contas no Supabase Auth

-- 11. Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 12. Criar políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 13. Criar políticas RLS para activities
CREATE POLICY "Anyone can view active activities" ON activities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can view their activities" ON activities
  FOR SELECT USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins can manage activities" ON activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 14. Criar políticas RLS para enrollments
CREATE POLICY "Students can view their enrollments" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view enrollments for their activities" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE id = activity_id AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in activities" ON enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can manage enrollments for their activities" ON enrollments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE id = activity_id AND teacher_id = auth.uid()
    )
  );

-- 15. Criar políticas RLS para attendance
CREATE POLICY "Students can view their attendance" ON attendance
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage attendance for their activities" ON attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE id = activity_id AND teacher_id = auth.uid()
    )
  );

-- 16. Criar políticas RLS para notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- 17. Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Criar trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 19. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_unit_id ON profiles(unit_id);
CREATE INDEX IF NOT EXISTS idx_activities_unit_id ON activities(unit_id);
CREATE INDEX IF NOT EXISTS idx_activities_teacher_id ON activities(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_activity_id ON enrollments(activity_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_activity_id ON attendance(activity_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 20. Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Migração para Supabase concluída com sucesso!';
  RAISE NOTICE 'Schema criado com RLS habilitado';
  RAISE NOTICE 'Próximo passo: Configurar variáveis de ambiente do Supabase';
END $$;
