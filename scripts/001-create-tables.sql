-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  manager_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  unit_id INTEGER REFERENCES units(id),
  assigned_to INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  content TEXT,
  generated_by INTEGER REFERENCES users(id),
  unit_id INTEGER REFERENCES units(id),
  period_start DATE,
  period_end DATE,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, role) VALUES 
('Admin User', 'admin@example.com', 'admin'),
('João Silva', 'joao@example.com', 'manager'),
('Maria Santos', 'maria@example.com', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO units (name, description, location, manager_id) VALUES 
('Unidade Central', 'Unidade principal da empresa', 'São Paulo - SP', 2),
('Filial Norte', 'Filial da região norte', 'Manaus - AM', 2)
ON CONFLICT DO NOTHING;

INSERT INTO activities (title, description, type, unit_id, assigned_to, status, priority) VALUES 
('Revisão de Processos', 'Revisar todos os processos da unidade', 'Auditoria', 1, 3, 'em_andamento', 'high'),
('Treinamento Equipe', 'Treinamento mensal da equipe', 'Treinamento', 1, 2, 'pending', 'medium'),
('Relatório Mensal', 'Gerar relatório mensal de atividades', 'Relatório', 2, 3, 'completed', 'low')
ON CONFLICT DO NOTHING;
