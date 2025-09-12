import { NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const reports = await sql`
      SELECT 
        r.id, r.title, r.type, r.status, r.period_start, r.period_end, r.created_at,
        u.name as generated_by_name,
        un.name as unit_name
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      LEFT JOIN units un ON r.unit_id = un.id
      ORDER BY r.created_at DESC
    `
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const { title, type, content, generated_by, unit_id, period_start, period_end } = await request.json()

    const result = await sql`
      INSERT INTO reports (title, type, content, generated_by, unit_id, period_start, period_end)
      VALUES (${title}, ${type}, ${content}, ${generated_by}, ${unit_id}, ${period_start}, ${period_end})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
