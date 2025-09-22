-- Script para adicionar a coluna password_hash à tabela profiles existente
-- Execute este script se você já executou o script anterior

-- Adicionar a coluna password_hash se ela não existir
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Atualizar usuários existentes com senhas padrão
UPDATE profiles 
SET password_hash = 'sema2024admin' 
WHERE email = 'admin@sema.org.br' AND password_hash IS NULL;

UPDATE profiles 
SET password_hash = 'sema2024prof' 
WHERE email = 'professor@sema.org.br' AND password_hash IS NULL;

UPDATE profiles 
SET password_hash = 'sema2024aluno' 
WHERE email = 'joao@email.com' AND password_hash IS NULL;

UPDATE profiles 
SET password_hash = 'sema2024aluno' 
WHERE email = 'maria@email.com' AND password_hash IS NULL;

UPDATE profiles 
SET password_hash = 'sema2024aluno' 
WHERE email = 'pedro@email.com' AND password_hash IS NULL;

-- Tornar a coluna obrigatória para novos registros
ALTER TABLE profiles 
ALTER COLUMN password_hash SET NOT NULL;

-- Verificar se tudo foi criado corretamente
SELECT 
  'profiles' as table_name, 
  count(*) as records,
  'password_hash column added' as status
FROM profiles;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Coluna password_hash adicionada com sucesso!';
  RAISE NOTICE 'Usuários existentes atualizados com senhas padrão';
  RAISE NOTICE 'Sistema de cadastro agora está funcional';
END $$;
