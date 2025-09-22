-- scripts/11_force_create_profiles.sql
-- Este script força a criação de perfis para todos os usuários existentes

-- 1. Criar perfis para todos os usuários que não têm perfil
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.email,
  'student' -- Sempre student para usuários criados pelo app
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar quantos perfis foram criados
SELECT 
  COUNT(*) as total_profiles_after,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as student_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teacher_profiles,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles
FROM public.profiles;

-- 3. Verificar se ainda existem usuários sem perfil
SELECT 
  COUNT(*) as users_without_profile
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Listar todos os perfis criados
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
