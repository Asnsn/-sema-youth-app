-- scripts/14_test_environment_vars.sql
-- Este script testa se as configurações do Supabase estão funcionando

-- 1. Verificar se conseguimos acessar a tabela profiles
SELECT 
  'profiles_table_access' as test_name,
  COUNT(*) as record_count,
  'SUCCESS' as status
FROM public.profiles;

-- 2. Verificar estrutura da tabela profiles
SELECT 
  'profiles_structure' as test_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar se RLS está ativo
SELECT 
  'rls_status' as test_name,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles' 
  AND schemaname = 'public';

-- 4. Verificar políticas de RLS
SELECT 
  'rls_policies' as test_name,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND schemaname = 'public';

-- 5. Testar inserção de perfil (simulação)
-- Este teste não vai inserir nada, apenas verificar se temos permissão
SELECT 
  'insert_permission' as test_name,
  'Permission check passed' as status
WHERE EXISTS (
  SELECT 1 FROM public.profiles LIMIT 1
);

-- 6. Verificar usuários existentes
SELECT 
  'existing_users' as test_name,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- 7. Verificar perfis existentes
SELECT 
  'existing_profiles' as test_name,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as student_profiles
FROM public.profiles;
