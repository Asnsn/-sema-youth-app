import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"
import { authenticateUser } from "@/lib/auth-simple"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { full_name, email, password, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone } = await request.json()

    console.log('Signup request received:', { full_name, email, role, unit_id })

    // Validar dados obrigatórios
    if (!full_name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
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

    // Definir role padrão se não fornecido
    const userRole = role || 'student'

    // Validar role
    if (!['student', 'teacher', 'admin'].includes(userRole)) {
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

    // Se unit_id não fornecido, usar a primeira unidade disponível
    let finalUnitId = unit_id
    if (!finalUnitId) {
      const units = await sql`SELECT id FROM units LIMIT 1`
      if (units.length > 0) {
        finalUnitId = units[0].id
      }
    }

    // Criar novo usuário
    const newUser = await sql`
      INSERT INTO profiles (
        full_name, email, role, unit_id, phone, date_of_birth, 
        address, emergency_contact, emergency_phone, password_hash
      )
      VALUES (
        ${full_name}, ${email}, ${userRole}, ${finalUnitId}, ${phone || null}, 
        ${date_of_birth || null}, ${address || null}, ${emergency_contact || null}, ${emergency_phone || null}, ${password}
      )
      RETURNING id, full_name, email, role, unit_id, created_at
    `

    if (newUser.length === 0) {
      return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
    }

    console.log('User created successfully:', newUser[0])

    return NextResponse.json({ 
      message: "Usuário criado com sucesso",
      user: newUser[0]
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
