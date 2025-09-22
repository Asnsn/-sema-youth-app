-- Script para desabilitar confirmação de email (APENAS PARA DESENVOLVIMENTO)
-- Execute este script no Supabase SQL Editor

-- IMPORTANTE: Este script desabilita a confirmação de email
-- Use apenas em ambiente de desenvolvimento/teste
-- Em produção, mantenha a confirmação de email habilitada

-- 1. Desabilitar confirmação de email
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = false,
  enable_email_change_confirmations = false
WHERE id = 1;

-- 2. Verificar configuração atual
SELECT 
  enable_signup,
  enable_email_confirmations,
  enable_email_change_confirmations
FROM auth.config;

-- 3. Mensagem de aviso
DO $$
BEGIN
  RAISE NOTICE 'ATENÇÃO: Confirmação de email foi DESABILITADA!';
  RAISE NOTICE 'Isso é apenas para desenvolvimento/teste.';
  RAISE NOTICE 'Em produção, reabilite a confirmação de email.';
  RAISE NOTICE 'Agora os usuários podem fazer login sem confirmar o email.';
END $$;
