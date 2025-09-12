import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const users = await sql`
      SELECT id, name, email, role, status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, role } = await request.json()

    const result = await sql`
      INSERT INTO users (name, email, role)
      VALUES (${name}, ${email}, ${role})
      RETURNING id, name, email, role, status, created_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
