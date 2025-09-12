import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const units = await sql`
      SELECT 
        u.id, u.name, u.description, u.location, u.status, u.created_at,
        m.name as manager_name
      FROM units u
      LEFT JOIN users m ON u.manager_id = m.id
      ORDER BY u.created_at DESC
    `
    return NextResponse.json(units)
  } catch (error) {
    console.error("Error fetching units:", error)
    return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { name, description, location, manager_id } = await request.json()

    const result = await sql`
      INSERT INTO units (name, description, location, manager_id)
      VALUES (${name}, ${description}, ${location}, ${manager_id})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating unit:", error)
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 })
  }
}
