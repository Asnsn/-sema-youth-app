import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    console.log('=== GET USER PROFILE API CALLED ===')
    
    // Criar cliente Supabase
    const supabase = createServerClient()
    
    // Buscar todos os perfis (temporário - em produção usar RLS adequado)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Erro ao buscar perfis' }, { status: 500 })
    }
    
    console.log('Profiles found:', profiles?.length || 0)
    
    return NextResponse.json(profiles || [])
    
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
