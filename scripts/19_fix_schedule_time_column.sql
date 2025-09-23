-- scripts/19_fix_schedule_time_column.sql
-- Corrigir o tipo da coluna schedule_time

-- 1. Alterar o tipo da coluna schedule_time para TEXT
ALTER TABLE public.activities 
ALTER COLUMN schedule_time TYPE TEXT;

-- 2. Verificar se a alteração foi feita
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'activities' 
  AND column_name = 'schedule_time'
  AND table_schema = 'public';

-- 3. Mensagem de confirmação
SELECT 'Coluna schedule_time alterada para TEXT com sucesso!' as status;
