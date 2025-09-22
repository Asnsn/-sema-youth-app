import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log('=== SUPABASE SIGNUP API CALLED ===')
  
  try {
    // Parse request body
    const body = await request.json()
    console.log('Request body parsed successfully:', { 
      full_name: body.full_name, 
      email: body.email, 
      role: body.role, 
      unit_id: body.unit_id 
    })

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

    // Criar cliente Supabase
    const supabase = createServerClient()
    console.log('Supabase client created')

    // Verificar se unit_id é válido
    let finalUnitId = unit_id
    if (!finalUnitId) {
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('id')
        .limit(1)
      
      if (unitsError) {
        console.error('Error fetching units:', unitsError)
        return NextResponse.json({ error: "Erro ao buscar unidades" }, { status: 500 })
      }
      
      if (units && units.length > 0) {
        finalUnitId = units[0].id
        console.log('Using default unit:', finalUnitId)
      }
    }

    if (!finalUnitId) {
      console.error('No valid unit_id found')
      return NextResponse.json({ 
        error: "Nenhuma unidade válida encontrada. Entre em contato com o administrador." 
      }, { status: 400 })
    }

    // Criar usuário no Supabase Auth
    console.log('Creating user in Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: userRole,
          unit_id: finalUnitId,
          phone: phone || null,
          date_of_birth: date_of_birth || null,
          address: address || null,
          emergency_contact: emergency_contact || null,
          emergency_phone: emergency_phone || null,
        }
      }
    })

    if (authError) {
      console.error('Supabase Auth error:', authError)
      
      // Tratar erros específicos do Supabase
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: "Email já está em uso. Tente outro email." }, { status: 409 })
      }
      
      if (authError.message.includes('Password should be at least')) {
        return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: "Erro ao criar conta", 
        details: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      console.error('No user returned from Supabase Auth')
      return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
    }

    console.log('User created successfully in Supabase Auth:', authData.user.id)

    // O perfil será criado automaticamente pelo trigger
    // Aguardar um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Buscar o perfil criado
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      // Mesmo com erro ao buscar perfil, o usuário foi criado
      return NextResponse.json({ 
        message: "Usuário criado com sucesso! Verifique seu email para confirmar a conta.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: userRole
        }
      })
    }

    console.log('Profile found:', profile)

    return NextResponse.json({ 
      message: "Usuário criado com sucesso! Verifique seu email para confirmar a conta.",
      user: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        unit_id: profile.unit_id
      }
    })

  } catch (error) {
    console.error('=== SUPABASE SIGNUP ERROR ===', error)
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
