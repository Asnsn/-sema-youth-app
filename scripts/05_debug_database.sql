-- Script para debugar problemas no banco de dados
-- Execute este script para verificar o estado atual

-- 1. Verificar se a tabela profiles existe e sua estrutura
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Verificar se a tabela units existe e tem dados
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'units' 
ORDER BY ordinal_position;

-- 3. Verificar dados existentes na tabela units
SELECT id, name, location, country FROM units LIMIT 5;

-- 4. Verificar constraints da tabela profiles
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'profiles';

-- 5. Verificar se há dados na tabela profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- 6. Verificar se a coluna password_hash existe e é nullable
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'password_hash';

-- 7. Testar inserção de um usuário de teste (comentado para não inserir)
/*
INSERT INTO profiles (
  full_name, email, role, unit_id, password_hash
) VALUES (
  'Teste User', 'teste@teste.com', 'student', 
  (SELECT id FROM units LIMIT 1), 'teste123'
);
*/

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Script de debug executado com sucesso!';
  RAISE NOTICE 'Verifique os resultados acima para identificar problemas.';
END $$;
