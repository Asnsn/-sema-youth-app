import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const activities = await sql`
      SELECT 
        a.id, a.title, a.description, a.type, a.status, a.priority, a.due_date, a.created_at,
        u.name as assigned_name,
        un.name as unit_name
      FROM activities a
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN units un ON a.unit_id = un.id
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
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { title, description, type, unit_id, assigned_to, priority, due_date } = await request.json()

    const result = await sql`
      INSERT INTO activities (title, description, type, unit_id, assigned_to, priority, due_date)
      VALUES (${title}, ${description}, ${type}, ${unit_id}, ${assigned_to}, ${priority}, ${due_date})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
