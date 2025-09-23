-- scripts/16_create_sample_activities.sql
-- Este script cria atividades de exemplo para testar o sistema

-- 1. Verificar se existem unidades
SELECT 
  id,
  name,
  location,
  country
FROM public.units
ORDER BY created_at DESC;

-- 2. Verificar se existem professores
SELECT 
  id,
  full_name,
  email,
  role
FROM public.profiles
WHERE role = 'teacher'
ORDER BY created_at DESC;

-- 3. Criar atividades de exemplo
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
  teacher_id,
  is_active
) VALUES 
-- Atividade 1: Futebol
(
  'Futebol',
  'Treinos e jogos de futebol para jovens',
  'sports',
  (SELECT id FROM public.units LIMIT 1), -- Usar primeira unidade disponível
  20,
  12,
  18,
  ARRAY['Terça', 'Quinta'],
  '18:00 - 19:30',
  (SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1), -- Usar primeiro professor
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
  '07:00 - 08:00',
  (SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1),
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
  '14:00 - 16:00',
  (SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1),
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
  '19:00 - 20:00',
  (SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1),
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
  '16:00 - 18:00',
  (SELECT id FROM public.profiles WHERE role = 'teacher' LIMIT 1),
  true
);

-- 4. Verificar atividades criadas
SELECT 
  id,
  name,
  description,
  category,
  max_participants,
  schedule_days,
  schedule_time,
  is_active,
  created_at
FROM public.activities
ORDER BY created_at DESC;

-- 5. Contar atividades por categoria
SELECT 
  category,
  COUNT(*) as total_activities
FROM public.activities
WHERE is_active = true
GROUP BY category
ORDER BY total_activities DESC;

-- 6. Mensagem de confirmação
SELECT 'Atividades de exemplo criadas com sucesso!' as status;
