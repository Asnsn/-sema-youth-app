-- Script super simples para adicionar coluna password_hash
-- Execute este script no Neon Database

-- Verificar se a coluna já existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'password_hash';

-- Adicionar a coluna se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE profiles ADD COLUMN password_hash TEXT;
        RAISE NOTICE 'Coluna password_hash adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna password_hash já existe!';
    END IF;
END $$;

-- Verificar se foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'password_hash';
