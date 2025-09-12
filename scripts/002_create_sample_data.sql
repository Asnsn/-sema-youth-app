-- Sample data for SEMA app testing

-- Sample activities for each unit
INSERT INTO activities (name, description, category, unit_id, max_participants, age_min, age_max, schedule_days, schedule_time) 
SELECT 
  activity_name,
  activity_desc,
  activity_cat,
  u.id,
  30,
  6,
  18,
  ARRAY['monday', 'wednesday', 'friday'],
  '14:00:00'::TIME
FROM units u
CROSS JOIN (
  VALUES 
    ('Futebol', 'Treinamento de futebol para jovens', 'sports'),
    ('Basquete', 'Aulas de basquete e desenvolvimento motor', 'sports'),
    ('Dança', 'Aulas de dança e expressão corporal', 'cultural'),
    ('Teatro', 'Oficinas de teatro e dramatização', 'cultural'),
    ('Reforço Escolar', 'Apoio pedagógico e reforço escolar', 'educational'),
    ('Informática', 'Curso básico de informática', 'educational'),
    ('Artesanato', 'Oficinas de artesanato e trabalhos manuais', 'cultural'),
    ('Capoeira', 'Aulas de capoeira e cultura brasileira', 'cultural')
) AS activities_data(activity_name, activity_desc, activity_cat);

-- Sample events
INSERT INTO events (title, description, event_date, event_time, location, unit_id, is_public, max_participants)
SELECT 
  event_title,
  event_desc,
  CURRENT_DATE + INTERVAL '30 days',
  '15:00:00'::TIME,
  u.location,
  u.id,
  true,
  100
FROM units u
CROSS JOIN (
  VALUES 
    ('Festival de Talentos SEMA', 'Apresentação dos talentos dos jovens da unidade'),
    ('Torneio Esportivo', 'Competição esportiva entre as modalidades'),
    ('Feira de Ciências', 'Exposição dos projetos educacionais'),
    ('Festa Junina', 'Celebração tradicional com toda a comunidade')
) AS events_data(event_title, event_desc);
