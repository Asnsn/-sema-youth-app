import { NextResponse } from "next/server"
import { getSupabaseDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const supabase = getSupabaseDb()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
    }

    return NextResponse.json({ message: "Logout realizado com sucesso" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
