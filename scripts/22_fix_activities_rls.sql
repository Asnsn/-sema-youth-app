-- scripts/22_fix_activities_rls.sql
-- Corrigir RLS para a tabela activities

-- 1. Desabilitar RLS na tabela activities
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se RLS foi desabilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'activities' 
  AND schemaname = 'public';

-- 3. Testar acesso às atividades
SELECT 
  COUNT(*) as total_activities,
  'Atividades acessíveis após desabilitar RLS' as description
FROM public.activities;

-- 4. Listar atividades disponíveis
SELECT 
  id,
  name,
  description,
  category,
  schedule_time,
  is_active
FROM public.activities
WHERE is_active = true
ORDER BY created_at DESC;

-- 5. Mensagem de confirmação
SELECT 'RLS desabilitado para tabela activities!' as status;
