-- scripts/23_disable_enrollments_rls.sql
-- Este script desabilita o Row Level Security (RLS) para a tabela 'enrollments'.
-- Use para desenvolvimento e depuração.

-- 1. Desabilitar RLS na tabela enrollments
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes na tabela enrollments
DROP POLICY IF EXISTS "Allow authenticated users to view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow authenticated users to update their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow admins to view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Allow admins to manage all enrollments" ON public.enrollments;

SELECT 'Row Level Security (RLS) desabilitado para a tabela enrollments.' AS status;
