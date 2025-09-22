import { NextResponse } from "next/server"
import { getSupabaseDb } from "@/lib/db"
import { getCurrentUser } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseDb()
    
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        student_id,
        activity_id,
        status,
        enrolled_at,
        completed_at,
        profiles!enrollments_student_id_fkey (
          id,
          full_name,
          email,
          role
        ),
        activities!enrollments_activity_id_fkey (
          id,
          name,
          description,
          category,
          max_participants,
          schedule_days,
          schedule_time,
          is_active,
          units (
            id,
            name,
            location
          )
        )
      `)
      .order('enrolled_at', { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { student_id, activity_id, status = 'active' } = await request.json()

    // Check if enrollment already exists
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', student_id)
      .eq('activity_id', activity_id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: "Student is already enrolled in this activity" }, { status: 400 })
    }

    // Check activity capacity
    const { data: activity } = await supabase
      .from('activities')
      .select('max_participants')
      .eq('id', activity_id)
      .single()

    const { data: currentEnrollments } = await supabase
      .from('enrollments')
      .select('id')
      .eq('activity_id', activity_id)
      .eq('status', 'active')

    if (currentEnrollments && currentEnrollments.length >= activity.max_participants) {
      return NextResponse.json({ error: "Activity is at full capacity" }, { status: 400 })
    }

    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert({
        student_id,
        activity_id,
        status
      })
      .select(`
        id,
        student_id,
        activity_id,
        status,
        enrolled_at,
        profiles!enrollments_student_id_fkey (
          id,
          full_name,
          email
        ),
        activities!enrollments_activity_id_fkey (
          id,
          name,
          description,
          category
        )
      `)
      .single()

    if (error) {
      console.error("Error creating enrollment:", error)
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
    }

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}
