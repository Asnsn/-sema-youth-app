import { NextResponse } from "next/server"
import { getSupabaseDb } from "@/lib/db"
import { getCurrentUser } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activity_id')
    const date = searchParams.get('date')
    const studentId = searchParams.get('student_id')

    let query = supabase
      .from('attendance')
      .select(`
        id,
        student_id,
        activity_id,
        date,
        status,
        notes,
        recorded_by,
        recorded_at,
        profiles!attendance_student_id_fkey (
          id,
          full_name,
          email
        ),
        activities!attendance_activity_id_fkey (
          id,
          name,
          description,
          schedule_time
        )
      `)

    if (activityId) {
      query = query.eq('activity_id', activityId)
    }
    if (date) {
      query = query.eq('date', date)
    }
    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data: attendance, error } = await query.order('recorded_at', { ascending: false })

    if (error) {
      console.error("Error fetching attendance:", error)
      return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
    }

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { student_id, activity_id, date, status, notes, recorded_by } = await request.json()

    // Check if attendance record already exists for this student, activity, and date
    const { data: existingRecord } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', student_id)
      .eq('activity_id', activity_id)
      .eq('date', date)
      .single()

    if (existingRecord) {
      // Update existing record
      const { data: attendance, error } = await supabase
        .from('attendance')
        .update({
          status,
          notes,
          recorded_by,
          recorded_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id)
        .select(`
          id,
          student_id,
          activity_id,
          date,
          status,
          notes,
          recorded_by,
          recorded_at,
          profiles!attendance_student_id_fkey (
            id,
            full_name,
            email
          ),
          activities!attendance_activity_id_fkey (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) {
        console.error("Error updating attendance:", error)
        return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 })
      }

      return NextResponse.json(attendance)
    } else {
      // Create new record
      const { data: attendance, error } = await supabase
        .from('attendance')
        .insert({
          student_id,
          activity_id,
          date,
          status,
          notes,
          recorded_by
        })
        .select(`
          id,
          student_id,
          activity_id,
          date,
          status,
          notes,
          recorded_by,
          recorded_at,
          profiles!attendance_student_id_fkey (
            id,
            full_name,
            email
          ),
          activities!attendance_activity_id_fkey (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) {
        console.error("Error creating attendance:", error)
        return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 })
      }

      return NextResponse.json(attendance)
    }
  } catch (error) {
    console.error("Error handling attendance:", error)
    return NextResponse.json({ error: "Failed to handle attendance" }, { status: 500 })
  }
}
