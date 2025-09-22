-- Script para corrigir o problema de criação automática de perfil
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a função existe
SELECT 
  routine_name, 
  routine_type, 
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 2. Verificar se o trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. Recriar a função se necessário
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

-- 4. Recriar o trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Verificar se há usuários sem perfil
SELECT 
  au.id,
  au.email,
  au.created_at,
  p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 6. Criar perfis para usuários existentes que não têm perfil
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'student')
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 7. Verificar se todos os usuários agora têm perfil
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profiles
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id;

-- 8. Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Trigger de criação de perfil corrigido!';
  RAISE NOTICE 'Perfis criados para usuários existentes.';
  RAISE NOTICE 'Novos usuários terão perfil criado automaticamente.';
END $$;
