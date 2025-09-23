import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { activity_id } = await request.json()
    
    console.log('=== ENROLLMENT API CALLED ===')
    console.log('Activity ID:', activity_id)
    
    // Criar cliente Supabase simples
    const supabase = createServerClient()
    
    // Por enquanto, vamos usar um ID fixo para teste
    // TODO: Implementar autenticação real com Supabase Auth
    const userId = '550e8400-e29b-41d4-a716-446655440003' // ID do usuário de teste
    
    console.log('Using test user ID:', userId)
    
    // Verificar se já está inscrito
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', userId)
      .eq('activity_id', activity_id)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing enrollment:', checkError)
      return NextResponse.json({ error: 'Erro ao verificar inscrição' }, { status: 500 })
    }
    
    if (existingEnrollment) {
      return NextResponse.json({ error: 'Você já está inscrito nesta atividade' }, { status: 409 })
    }
    
    // Verificar se a atividade existe e está ativa
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, name, max_participants, is_active')
      .eq('id', activity_id)
      .eq('is_active', true)
      .single()
    
    if (activityError) {
      console.error('Error fetching activity:', activityError)
      return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 })
    }
    
    // Verificar se há vagas disponíveis
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('activity_id', activity_id)
      .eq('status', 'active')
    
    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
      return NextResponse.json({ error: 'Erro ao verificar vagas' }, { status: 500 })
    }
    
    const currentEnrollments = enrollments?.length || 0
    
    if (currentEnrollments >= activity.max_participants) {
      return NextResponse.json({ error: 'Atividade lotada' }, { status: 400 })
    }
    
    // Criar inscrição
    const { data: newEnrollment, error: createError } = await supabase
      .from('enrollments')
      .insert({
        student_id: userId,
        activity_id: activity_id,
        status: 'active'
      })
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating enrollment:', createError)
      return NextResponse.json({ error: 'Erro ao fazer inscrição' }, { status: 500 })
    }
    
    console.log('Enrollment created:', newEnrollment.id)
    
    return NextResponse.json({ 
      message: 'Inscrição realizada com sucesso!',
      enrollment: newEnrollment
    })
    
  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    console.log('=== GET ENROLLMENTS API CALLED ===')
    
    // Criar cliente Supabase simples
    const supabase = createServerClient()
    
    // Por enquanto, vamos usar um ID fixo para teste
    const userId = '550e8400-e29b-41d4-a716-446655440003' // ID do usuário de teste
    
    console.log('Using test user ID:', userId)
    
    // Buscar inscrições do usuário
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        activities:activity_id(
          id,
          name,
          description,
          category,
          schedule_days,
          schedule_time,
          units:unit_id(name, location),
          profiles:teacher_id(full_name)
        )
      `)
      .eq('student_id', userId)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })
    
    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
      return NextResponse.json({ error: 'Erro ao buscar inscrições' }, { status: 500 })
    }
    
    console.log('Enrollments found:', enrollments?.length || 0)
    
    // Transformar dados para o formato esperado
    const formattedEnrollments = enrollments?.map(enrollment => ({
      id: enrollment.id,
      student_id: enrollment.student_id,
      activity_id: enrollment.activity_id,
      status: enrollment.status,
      enrolled_at: enrollment.enrolled_at,
      activity: {
        id: enrollment.activities?.id,
        name: enrollment.activities?.name,
        description: enrollment.activities?.description,
        category: enrollment.activities?.category,
        schedule_days: enrollment.activities?.schedule_days,
        schedule_time: enrollment.activities?.schedule_time,
        unit_name: enrollment.activities?.units?.name,
        unit_location: enrollment.activities?.units?.location,
        teacher_name: enrollment.activities?.profiles?.full_name
      }
    })) || []
    
    return NextResponse.json(formattedEnrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
