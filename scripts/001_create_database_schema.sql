-- SEMA Youth App Database Schema
-- Create tables for managing students, teachers, activities, and attendance

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
