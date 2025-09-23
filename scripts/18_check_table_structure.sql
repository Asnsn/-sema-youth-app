-- scripts/18_check_table_structure.sql
-- Verificar estrutura da tabela activities

-- 1. Verificar estrutura da tabela activities
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'activities' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se a tabela existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'activities' 
  AND table_schema = 'public';

-- 3. Verificar dados existentes na tabela
SELECT 
  COUNT(*) as total_activities
FROM public.activities;
