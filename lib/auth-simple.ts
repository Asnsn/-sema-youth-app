// Sistema de autenticação com banco de dados
import { getDbConnection } from './db'

export interface SimpleUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  unit_id?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

// Usuários de teste hardcoded (fallback)
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

export async function authenticateUser(email: string, password: string): Promise<SimpleUser | null> {
  try {
    // Primeiro, tentar autenticar com usuários do banco
    const sql = getDbConnection()
    const users = await sql`
      SELECT id, full_name, email, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone, password_hash
      FROM profiles 
      WHERE email = ${email}
    `

    if (users.length > 0) {
      const user = users[0]
      // Verificar senha (em produção, usar bcrypt)
      if (user.password_hash === password) {
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          unit_id: user.unit_id,
          phone: user.phone,
          date_of_birth: user.date_of_birth,
          address: user.address,
          emergency_contact: user.emergency_contact,
          emergency_phone: user.emergency_phone
        }
      }
    }

    // Fallback para usuários de teste
    const validPasswords = {
      'admin@sema.org.br': 'sema2024admin',
      'professor@sema.org.br': 'sema2024prof',
      'joao@email.com': 'sema2024aluno'
    };

    if (validPasswords[email as keyof typeof validPasswords] === password) {
      return TEST_USERS.find(user => user.email === email) || null;
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error)
    return null;
  }
}

export async function getUserById(id: string): Promise<SimpleUser | null> {
  try {
    const sql = getDbConnection()
    const users = await sql`
      SELECT id, full_name, email, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone
      FROM profiles 
      WHERE id = ${id}
    `

    if (users.length > 0) {
      const user = users[0]
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        unit_id: user.unit_id,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        address: user.address,
        emergency_contact: user.emergency_contact,
        emergency_phone: user.emergency_phone
      }
    }

    // Fallback para usuários de teste
    return TEST_USERS.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Get user error:', error)
    return null;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  const user = await getUserById(userId);
  return user?.role || null;
}
