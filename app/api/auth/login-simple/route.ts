import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    console.log('=== SIMPLE LOGIN API CALLED ===')
    console.log('Login attempt for email:', email)
    
    // Criar cliente Supabase normal
    const supabase = createServerClient()
    console.log('Supabase client created')
    
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
    
    // Buscar perfil do usuário com query direta
    console.log('Searching for profile with user ID:', authData.user.id)
    
    try {
      // Tentar buscar perfil com query direta
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
      
      console.log('Profile search result:', { profiles, profileError })
      
      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return NextResponse.json({ error: 'Erro ao buscar perfil do usuário' }, { status: 500 })
      }
      
      if (!profiles || profiles.length === 0) {
        console.log('Profile not found, creating one for user:', authData.user.id)
        
        // Criar perfil
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || authData.user.email,
            email: authData.user.email,
            role: 'student'
          })
          .select()
          .single()
        
        console.log('Profile creation result:', { newProfile, createError })
        
        if (createError) {
          console.error('Error creating profile:', createError)
          return NextResponse.json({ error: 'Erro ao criar perfil do usuário' }, { status: 500 })
        }
        
        return NextResponse.json({ 
          user: {
            id: newProfile.id,
            email: newProfile.email,
            role: newProfile.role,
            full_name: newProfile.full_name,
            unit_id: newProfile.unit_id,
            phone: newProfile.phone,
            date_of_birth: newProfile.date_of_birth,
            address: newProfile.address,
            emergency_contact: newProfile.emergency_contact,
            emergency_phone: newProfile.emergency_phone
          }
        })
      }
      
      const profile = profiles[0]
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
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Erro de conexão com o banco de dados' }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
