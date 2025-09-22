import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('=== SUPABASE LOGIN API CALLED ===')
    console.log('Login attempt for email:', email)
    
    // Criar cliente Supabase
    const supabase = createServerClient()
    
    // Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      console.error('Supabase Auth error:', authError)
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    if (!authData.user) {
      console.error('No user returned from Supabase Auth')
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    console.log('User authenticated successfully:', authData.user.id)
    
    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Erro ao buscar perfil do usuário' }, { status: 500 })
    }
    
    if (!profile) {
      console.error('No profile found for user:', authData.user.id)
      return NextResponse.json({ error: 'Perfil do usuário não encontrado' }, { status: 404 })
    }
    
    console.log('Profile found:', profile)
    
    return NextResponse.json({ 
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
        unit_id: profile.unit_id,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        address: profile.address,
        emergency_contact: profile.emergency_contact,
        emergency_phone: profile.emergency_phone
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
