import { NextResponse } from "next/server"
import { authenticateUser } from '@/lib/auth-simple'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Autenticação simples para desenvolvimento
    const user = authenticateUser(email, password)
    
    if (user) {
      return NextResponse.json({ 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        }
      })
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
