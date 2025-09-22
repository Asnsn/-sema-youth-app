-- scripts/13_disable_rls_completely.sql
-- Este script desabilita completamente o RLS para desenvolvimento
-- ATENÇÃO: Use apenas para desenvolvimento, nunca em produção!

-- 1. Desabilitar RLS em todas as tabelas principais
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 2. Verificar status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'units', 'activities', 'enrollments', 'attendance', 'events', 'event_registrations', 'notifications')
ORDER BY tablename;

-- 3. Testar acesso às tabelas
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM public.profiles
UNION ALL
SELECT 'units' as table_name, COUNT(*) as record_count FROM public.units
UNION ALL
SELECT 'activities' as table_name, COUNT(*) as record_count FROM public.activities
UNION ALL
SELECT 'enrollments' as table_name, COUNT(*) as record_count FROM public.enrollments
UNION ALL
SELECT 'attendance' as table_name, COUNT(*) as record_count FROM public.attendance
UNION ALL
SELECT 'events' as table_name, COUNT(*) as record_count FROM public.events
UNION ALL
SELECT 'event_registrations' as table_name, COUNT(*) as record_count FROM public.event_registrations
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as record_count FROM public.notifications;

-- 4. Mensagem de confirmação
SELECT 'RLS desabilitado para todas as tabelas principais. Use apenas para desenvolvimento!' as status;
