import { NextResponse } from "next/server"
import { authenticateUser } from '@/lib/auth-simple'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Autenticação com banco de dados
    const user = await authenticateUser(email, password)
    
    if (user) {
      return NextResponse.json({ 
        user: {
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
      })
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
