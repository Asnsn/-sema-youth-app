import { NextResponse } from "next/server"
import { getSupabaseDb } from "@/lib/db"
import { getCurrentUser } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseDb()
    
    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        id,
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
        is_active,
        created_at,
        updated_at,
        units (
          id,
          name,
          location,
          country
        ),
        profiles!activities_teacher_id_fkey (
          id,
          full_name,
          email
        ),
        enrollments (
          id,
          student_id,
          status,
          enrolled_at,
          profiles!enrollments_student_id_fkey (
            id,
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching activities:", error)
      return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
    }

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseDb()
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

    const { data: activity, error } = await supabase
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
      .select(`
        id,
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
        is_active,
        created_at,
        units (
          id,
          name,
          location,
          country
        ),
        profiles!activities_teacher_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error("Error creating activity:", error)
      return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}