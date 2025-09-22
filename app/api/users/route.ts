import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"
import { getUserRole } from "@/lib/auth-simple"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Simular autenticação - em produção, usar headers de auth
    const userId = '550e8400-e29b-41d4-a716-446655440001' // Admin por padrão
    const userRole = await getUserRole(userId)

    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sql = getDbConnection()
    const profiles = await sql`
      SELECT p.id, p.full_name, p.email, p.role, p.unit_id, p.phone, p.date_of_birth, 
             p.address, p.emergency_contact, p.emergency_phone, p.created_at, p.updated_at,
             u.name as unit_name, u.location as unit_location
      FROM profiles p
      LEFT JOIN units u ON p.unit_id = u.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(profiles)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { full_name, email, role, unit_id, phone, date_of_birth, address, emergency_contact, emergency_phone, password } = await request.json()

    const sql = getDbConnection()
    const newProfile = await sql`
      INSERT INTO profiles (
        full_name, email, role, unit_id, phone, date_of_birth, 
        address, emergency_contact, emergency_phone, password_hash
      )
      VALUES (
        ${full_name}, ${email}, ${role}, ${unit_id}, ${phone}, 
        ${date_of_birth}, ${address}, ${emergency_contact}, ${emergency_phone}, ${password || 'default_password'}
      )
      RETURNING id, full_name, email, role, unit_id, phone, date_of_birth, 
                address, emergency_contact, emergency_phone, created_at, updated_at
    `

    return NextResponse.json(newProfile[0])
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}