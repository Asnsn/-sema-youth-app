import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log('=== SIGNUP API CALLED ===')
  
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('Request body parsed successfully:', { 
        full_name: body.full_name, 
        email: body.email, 
        role: body.role, 
        unit_id: body.unit_id 
      })
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const { full_name, email, password, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone } = body

    // Validar dados obrigatórios
    if (!full_name || !email || !password) {
      console.log('Missing required fields:', { full_name: !!full_name, email: !!email, password: !!password })
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email)
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar senha
    if (password.length < 6) {
      console.log('Password too short:', password.length)
      return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Definir role padrão se não fornecido
    const userRole = role || 'student'
    console.log('User role:', userRole)

    // Validar role
    if (!['student', 'teacher', 'admin'].includes(userRole)) {
      console.log('Invalid role:', userRole)
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    // Testar conexão com banco
    let sql
    try {
      sql = getDbConnection()
      console.log('Database connection established')
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({ error: "Erro de conexão com banco de dados" }, { status: 500 })
    }

    // Verificar se email já existe
    let existingUser
    try {
      existingUser = await sql`
        SELECT id FROM profiles WHERE email = ${email}
      `
      console.log('Email check completed, existing users:', existingUser.length)
    } catch (queryError) {
      console.error('Error checking existing email:', queryError)
      return NextResponse.json({ error: "Erro ao verificar email existente" }, { status: 500 })
    }

    if (existingUser.length > 0) {
      console.log('Email already exists:', email)
      return NextResponse.json({ error: "Email já está em uso" }, { status: 409 })
    }

    // Se unit_id não fornecido, usar a primeira unidade disponível
    let finalUnitId = unit_id
    if (!finalUnitId) {
      try {
        const units = await sql`SELECT id FROM units LIMIT 1`
        console.log('Available units:', units.length)
        if (units.length > 0) {
          finalUnitId = units[0].id
          console.log('Using default unit:', finalUnitId)
        }
      } catch (unitsError) {
        console.error('Error fetching units:', unitsError)
        return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 })
      }
    }

    // Criar novo usuário
    let newUser
    try {
      console.log('Attempting to create user with data:', {
        full_name,
        email,
        role: userRole,
        unit_id: finalUnitId,
        phone: phone || null,
        date_of_birth: date_of_birth || null,
        address: address || null,
        emergency_contact: emergency_contact || null,
        emergency_phone: emergency_phone || null,
        password_hash: password
      })

      // Verificar se finalUnitId é válido
      if (!finalUnitId) {
        console.error('No valid unit_id found')
        return NextResponse.json({ 
          error: "Nenhuma unidade válida encontrada. Entre em contato com o administrador." 
        }, { status: 400 })
      }

      newUser = await sql`
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

      console.log('User creation query executed, result:', newUser.length)
    } catch (insertError) {
      console.error('=== DATABASE INSERT ERROR ===')
      console.error('Error type:', typeof insertError)
      console.error('Error message:', insertError instanceof Error ? insertError.message : 'Unknown error')
      console.error('Error code:', (insertError as any)?.code)
      console.error('Error detail:', (insertError as any)?.detail)
      console.error('Error constraint:', (insertError as any)?.constraint)
      console.error('Error table:', (insertError as any)?.table)
      console.error('Error column:', (insertError as any)?.column)
      
      // Verificar se é erro de constraint
      if ((insertError as any)?.code === '23505') {
        return NextResponse.json({ 
          error: "Email já está em uso. Tente outro email." 
        }, { status: 409 })
      }
      
      // Verificar se é erro de foreign key
      if ((insertError as any)?.code === '23503') {
        return NextResponse.json({ 
          error: "Unidade selecionada não é válida. Entre em contato com o administrador." 
        }, { status: 400 })
      }
      
      // Verificar se é erro de constraint de role
      if ((insertError as any)?.constraint?.includes('role')) {
        return NextResponse.json({ 
          error: "Tipo de usuário inválido." 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: "Erro ao criar usuário no banco de dados", 
        details: insertError instanceof Error ? insertError.message : 'Unknown database error',
        errorCode: (insertError as any)?.code,
        errorConstraint: (insertError as any)?.constraint
      }, { status: 500 })
    }

    if (newUser.length === 0) {
      console.log('No user returned from insert')
      return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
    }

    console.log('User created successfully:', newUser[0])

    return NextResponse.json({ 
      message: "Usuário criado com sucesso",
      user: newUser[0]
    })

  } catch (error) {
    console.error('=== SIGNUP ERROR ===', error)
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
