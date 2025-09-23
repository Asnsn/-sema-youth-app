import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params
    
    console.log('=== GET ACTIVITY API CALLED ===')
    console.log('Activity ID:', activityId)
    
    // Criar cliente Supabase
    const supabase = createServerClient()
    
    // Buscar atividade específica
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select(`
        *,
        units:unit_id(name, location),
        profiles:teacher_id(full_name, email)
      `)
      .eq('id', activityId)
      .eq('is_active', true)
      .single()
    
    if (activityError) {
      console.error('Error fetching activity:', activityError)
      return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 })
    }
    
    if (!activity) {
      return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 })
    }
    
    console.log('Activity found:', activity.name)
    
    // Transformar dados para o formato esperado
    const formattedActivity = {
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
    }
    
    return NextResponse.json(formattedActivity)
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
