-- scripts/20_final_activities.sql
-- Script final para criar atividades após corrigir a coluna

-- 1. Verificar se existem unidades
SELECT 
  id,
  name,
  location
FROM public.units
LIMIT 5;

-- 2. Criar atividades com formato correto
INSERT INTO public.activities (
  name,
  description,
  category,
  unit_id,
  max_participants,
  age_min,
  age_max,
  schedule_days,
  schedule_time,
  is_active
) VALUES 
-- Atividade 1: Futebol
(
  'Futebol',
  'Treinos e jogos de futebol para jovens',
  'sports',
  (SELECT id FROM public.units LIMIT 1),
  20,
  12,
  18,
  ARRAY['Terça', 'Quinta'],
  '18:00 às 19:30',
  true
),
-- Atividade 2: Yoga
(
  'Yoga Matinal',
  'Aulas de yoga para relaxamento e bem-estar',
  'wellness',
  (SELECT id FROM public.units LIMIT 1),
  15,
  14,
  25,
  ARRAY['Segunda', 'Quarta', 'Sexta'],
  '07:00 às 08:00',
  true
),
-- Atividade 3: Dança
(
  'Dança Contemporânea',
  'Aulas de dança contemporânea para expressão artística',
  'arts',
  (SELECT id FROM public.units LIMIT 1),
  25,
  13,
  20,
  ARRAY['Sábado'],
  '14:00 às 16:00',
  true
),
-- Atividade 4: Natação
(
  'Natação',
  'Aulas de natação para todos os níveis',
  'sports',
  (SELECT id FROM public.units LIMIT 1),
  15,
  10,
  18,
  ARRAY['Segunda', 'Quarta'],
  '19:00 às 20:00',
  true
),
-- Atividade 5: Teatro
(
  'Teatro',
  'Oficinas de teatro para desenvolvimento pessoal',
  'arts',
  (SELECT id FROM public.units LIMIT 1),
  20,
  12,
  18,
  ARRAY['Terça', 'Quinta'],
  '16:00 às 18:00',
  true
);

-- 3. Verificar atividades criadas
SELECT 
  id,
  name,
  description,
  category,
  max_participants,
  schedule_days,
  schedule_time,
  is_active
FROM public.activities
ORDER BY created_at DESC;

-- 4. Contar atividades por categoria
SELECT 
  category,
  COUNT(*) as total_activities
FROM public.activities
WHERE is_active = true
GROUP BY category
ORDER BY total_activities DESC;

-- 5. Mensagem de confirmação
SELECT 'Atividades criadas com sucesso!' as status;
