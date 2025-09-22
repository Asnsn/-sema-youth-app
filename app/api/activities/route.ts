import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"
import { getUserRole } from "@/lib/auth-simple"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Simular autenticação - em produção, usar headers de auth
    const userId = '550e8400-e29b-41d4-a716-446655440001' // Admin por padrão
    const userRole = getUserRole(userId)

    const sql = getDbConnection()
    const activities = await sql`
      SELECT 
        a.*,
        u.name as unit_name,
        u.location as unit_location,
        p.full_name as teacher_name,
        p.email as teacher_email
      FROM activities a
      LEFT JOIN units u ON a.unit_id = u.id
      LEFT JOIN profiles p ON a.teacher_id = p.id
      ORDER BY a.created_at DESC
    `

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
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

    const sql = getDbConnection()
    const newActivity = await sql`
      INSERT INTO activities (
        name, description, category, unit_id, max_participants, 
        age_min, age_max, schedule_days, schedule_time, teacher_id, is_active
      )
      VALUES (
        ${name}, ${description}, ${category}, ${unit_id}, ${max_participants}, 
        ${age_min}, ${age_max}, ${schedule_days}, ${schedule_time}, ${teacher_id}, true
      )
      RETURNING *
    `

    return NextResponse.json(newActivity[0])
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}