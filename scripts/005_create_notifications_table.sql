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

-- Enable Row Level Security
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
