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
      
      // Verificar se é erro de email não confirmado
      if (authError.message.includes('Email not confirmed') || authError.message.includes('email_not_confirmed')) {
        return NextResponse.json({ 
          error: 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.' 
        }, { status: 401 })
      }
      
      // Verificar se é erro de credenciais inválidas
      if (authError.message.includes('Invalid login credentials') || authError.message.includes('invalid_credentials')) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
      }
      
      return NextResponse.json({ 
        error: 'Erro ao fazer login', 
        details: authError.message 
      }, { status: 401 })
    }
    
    if (!authData.user) {
      console.error('No user returned from Supabase Auth')
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    console.log('User authenticated successfully:', authData.user.id)
    
    // Buscar perfil do usuário
    console.log('Searching for profile with user ID:', authData.user.id)
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    console.log('Profile search result:', { profile, profileError })
    
    // Se o perfil não existir, criar um
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Profile not found, creating one for user:', authData.user.id)
      
      console.log('Creating profile with data:', {
        id: authData.user.id,
        full_name: authData.user.user_metadata?.full_name || authData.user.email,
        email: authData.user.email,
        role: 'student'
      })
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: authData.user.user_metadata?.full_name || authData.user.email,
          email: authData.user.email,
          role: 'student' // Sempre student para usuários criados pelo app
        })
        .select()
        .single()
      
      console.log('Profile creation result:', { newProfile, createError })
      
      if (createError) {
        console.error('Error creating profile:', createError)
        return NextResponse.json({ error: 'Erro ao criar perfil do usuário' }, { status: 500 })
      }
      
      profile = newProfile
    } else if (profileError) {
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
