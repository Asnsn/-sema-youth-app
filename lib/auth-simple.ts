// Autenticação simples para desenvolvimento (sem Supabase)
// Este arquivo será substituído quando o Supabase estiver configurado

export interface SimpleUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

// Usuários de teste hardcoded
const TEST_USERS: SimpleUser[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@sema.org.br',
    role: 'admin',
    full_name: 'Admin SEMA'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'professor@sema.org.br',
    role: 'teacher',
    full_name: 'Professor Silva'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'joao@email.com',
    role: 'student',
    full_name: 'João Silva'
  }
];

export function authenticateUser(email: string, password: string): SimpleUser | null {
  // Senhas de teste (em produção, usar hash)
  const validPasswords = {
    'admin@sema.org.br': 'sema2024admin',
    'professor@sema.org.br': 'sema2024prof',
    'joao@email.com': 'sema2024aluno'
  };

  if (validPasswords[email as keyof typeof validPasswords] === password) {
    return TEST_USERS.find(user => user.email === email) || null;
  }

  return null;
}

export function getUserById(id: string): SimpleUser | null {
  return TEST_USERS.find(user => user.id === id) || null;
}

export function getUserRole(userId: string): string | null {
  const user = getUserById(userId);
  return user?.role || null;
}
