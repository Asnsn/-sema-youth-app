import { NextResponse } from "next/server"
import { getSupabaseDb } from "@/lib/db"
import { getCurrentUser } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const type = searchParams.get('type')
    const isRead = searchParams.get('is_read')

    let query = supabase
      .from('notifications')
      .select(`
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at,
        read_at,
        metadata,
        profiles!notifications_user_id_fkey (
          id,
          full_name,
          email
        )
      `)

    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (isRead !== null) {
      query = query.eq('is_read', isRead === 'true')
    }

    const { data: notifications, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching notifications:", error)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { user_id, title, message, type, metadata } = await request.json()

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
        metadata,
        is_read: false
      })
      .select(`
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at,
        metadata,
        profiles!notifications_user_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseDb()
    const { id, is_read } = await request.json()

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({
        is_read,
        read_at: is_read ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select(`
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at,
        read_at,
        metadata
      `)
      .single()

    if (error) {
      console.error("Error updating notification:", error)
      return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
