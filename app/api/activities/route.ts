import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log('=== ACTIVITIES API CALLED ===')
    
    // Criar cliente Supabase
    const supabase = createServerClient()
    
    // Buscar atividades do Supabase
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(`
        *,
        units:unit_id(name, location),
        profiles:teacher_id(full_name, email)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
      return NextResponse.json({ error: "Erro ao buscar atividades" }, { status: 500 })
    }
    
    console.log('Activities found:', activities?.length || 0)
    
    // Transformar dados para o formato esperado
    const formattedActivities = activities?.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      category: activity.category,
      unit_id: activity.unit_id,
      max_participants: activity.max_participants,
      age_min: activity.age_min,
      age_max: activity.age_max,
      schedule_days: activity.schedule_days,
      schedule_time: activity.schedule_time,
      teacher_id: activity.teacher_id,
      is_active: activity.is_active,
      unit_name: activity.units?.name,
      unit_location: activity.units?.location,
      teacher_name: activity.profiles?.full_name,
      teacher_email: activity.profiles?.email,
      created_at: activity.created_at
    })) || []
    
    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { 
      name, 
      description, 
      category, 
      unit_id, 
      max_participants, 
      age_min, 
      age_max, 
      schedule_days, 
      schedule_time, 
      teacher_id 
    } = await request.json()

    console.log('=== CREATE ACTIVITY API CALLED ===')
    console.log('Activity data:', { name, description, category, unit_id })

    // Criar cliente Supabase
    const supabase = createServerClient()
    
    // Criar atividade no Supabase
    const { data: newActivity, error: createError } = await supabase
      .from('activities')
      .insert({
        name,
        description,
        category,
        unit_id,
        max_participants,
        age_min,
        age_max,
        schedule_days,
        schedule_time,
        teacher_id,
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating activity:', createError)
      return NextResponse.json({ error: "Erro ao criar atividade" }, { status: 500 })
    }

    console.log('Activity created:', newActivity)
    return NextResponse.json(newActivity)
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}