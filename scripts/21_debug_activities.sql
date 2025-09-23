-- scripts/21_debug_activities.sql
-- Script para debugar por que as atividades não aparecem

-- 1. Verificar se as atividades foram criadas (sem RLS)
SELECT 
  COUNT(*) as total_activities,
  'Total de atividades na tabela' as description
FROM public.activities;

-- 2. Verificar atividades ativas
SELECT 
  COUNT(*) as active_activities,
  'Atividades ativas' as description
FROM public.activities
WHERE is_active = true;

-- 3. Listar todas as atividades
SELECT 
  id,
  name,
  description,
  category,
  is_active,
  created_at
FROM public.activities
ORDER BY created_at DESC;

-- 4. Verificar se RLS está ativo na tabela activities
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'activities' 
  AND schemaname = 'public';

-- 5. Verificar políticas de RLS para activities
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'activities' 
  AND schemaname = 'public';

-- 6. Testar acesso direto às atividades
SELECT 
  'Teste de acesso direto' as test_name,
  COUNT(*) as accessible_activities
FROM public.activities
WHERE is_active = true;
