-- scripts/10_debug_profiles_table.sql
-- Este script verifica se a tabela profiles existe e tem a estrutura correta

-- 1. Verificar se a tabela profiles existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'profiles' 
  AND table_schema = 'public';

-- 2. Verificar estrutura da tabela profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se existem usuários na tabela auth.users
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- 4. Verificar se existem perfis na tabela profiles
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as student_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teacher_profiles,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles
FROM public.profiles;

-- 5. Verificar usuários sem perfil
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 6. Verificar se o trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Verificar se a função handle_new_user existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
  AND routine_schema = 'public';
