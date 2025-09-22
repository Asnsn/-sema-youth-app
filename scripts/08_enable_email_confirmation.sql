-- Script para reabilitar confirmação de email (PARA PRODUÇÃO)
-- Execute este script no Supabase SQL Editor quando for para produção

-- 1. Reabilitar confirmação de email
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = true,
  enable_email_change_confirmations = true
WHERE id = 1;

-- 2. Verificar configuração atual
SELECT 
  enable_signup,
  enable_email_confirmations,
  enable_email_change_confirmations
FROM auth.config;

-- 3. Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE 'Confirmação de email foi REABILITADA!';
  RAISE NOTICE 'Agora os usuários precisam confirmar o email antes de fazer login.';
  RAISE NOTICE 'Configure o SMTP para envio de emails de confirmação.';
END $$;
