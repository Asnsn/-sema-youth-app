-- scripts/15_emergency_disable_rls.sql
-- Script de emergência para desabilitar RLS completamente
-- Use apenas para desenvolvimento!

-- 1. Desabilitar RLS em todas as tabelas
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.units DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 2. Verificar status
SELECT 
  'RLS_DISABLED' as status,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'units', 'activities', 'enrollments', 'attendance', 'events', 'event_registrations', 'notifications')
ORDER BY tablename;

-- 3. Testar acesso às tabelas
SELECT 
  'profiles' as table_name, 
  COUNT(*) as record_count,
  'ACCESS_OK' as status
FROM public.profiles;

-- 4. Listar todos os perfis
SELECT 
  id,
  full_name,
  email,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 5. Mensagem de confirmação
SELECT 'RLS desabilitado com sucesso! Todas as tabelas agora são acessíveis.' as message;
