import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params
    
    console.log('=== GET ACTIVITY ENROLLMENTS API CALLED ===')
    console.log('Activity ID:', activityId)
    
    // Criar cliente Supabase com service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({ error: 'Configuração do servidor inválida' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Buscar inscrições da atividade
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        student_id,
        status,
        enrolled_at
      `)
      .eq('activity_id', activityId)
      .eq('status', 'active')
    
    if (enrollmentsError) {
      console.error('Error fetching activity enrollments:', enrollmentsError)
      return NextResponse.json({ error: 'Erro ao buscar inscrições da atividade' }, { status: 500 })
    }
    
    console.log('Activity enrollments found:', enrollments?.length || 0)
    
    return NextResponse.json(enrollments || [])
  } catch (error) {
    console.error("Error fetching activity enrollments:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
