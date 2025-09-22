import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"
import { authenticateUser } from "@/lib/auth-simple"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { full_name, email, password, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone } = await request.json()

    // Validar dados obrigatórios
    if (!full_name || !email || !password || !role) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar senha
    if (password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Validar role
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    const sql = getDbConnection()

    // Verificar se email já existe
    const existingUser = await sql`
      SELECT id FROM profiles WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 409 })
    }

    // Criar novo usuário
    const newUser = await sql`
      INSERT INTO profiles (
        full_name, email, role, unit_id, phone, date_of_birth, 
        address, emergency_contact, emergency_phone, password_hash
      )
      VALUES (
        ${full_name}, ${email}, ${role}, ${unit_id}, ${phone}, 
        ${date_of_birth}, ${address}, ${emergency_contact}, ${emergency_phone}, ${password}
      )
      RETURNING id, full_name, email, role, unit_id, created_at
    `

    if (newUser.length === 0) {
      return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Usuário criado com sucesso",
      user: newUser[0]
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
