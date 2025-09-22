-- scripts/12_fix_rls_policies.sql
-- Este script corrige as políticas de RLS para permitir acesso aos perfis

-- 1. Desabilitar RLS temporariamente para testar
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se RLS está desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles' 
  AND schemaname = 'public';

-- 3. Testar se conseguimos acessar os perfis
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as student_profiles
FROM public.profiles;

-- 4. Reabilitar RLS com políticas corretas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;

-- 6. Criar políticas mais permissivas para desenvolvimento
-- Permitir que usuários autenticados vejam seus próprios perfis
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários autenticados insiram seus próprios perfis
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir que usuários autenticados atualizem seus próprios perfis
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 7. Política temporária para permitir acesso via API (desenvolvimento)
-- ATENÇÃO: Esta política é muito permissiva, use apenas para desenvolvimento
CREATE POLICY "Allow API access for development" ON public.profiles
  FOR ALL USING (true);

-- 8. Verificar as políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND schemaname = 'public';

-- 9. Testar acesso novamente
SELECT 
  COUNT(*) as total_profiles_after_rls,
  COUNT(CASE WHEN role = 'student' THEN 1 END) as student_profiles_after_rls
FROM public.profiles;
