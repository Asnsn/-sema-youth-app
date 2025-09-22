-- Script simples para adicionar apenas a coluna password_hash
-- Execute este script se você receber erro de coluna não encontrada

-- Adicionar a coluna password_hash se ela não existir
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'password_hash';

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Coluna password_hash adicionada com sucesso!';
  RAISE NOTICE 'Agora você pode fazer o deploy e testar o cadastro';
END $$;
