import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'temp_key'

// Cliente para uso no servidor
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes do servidor
export const createServerClient = () => {
  const cookieStore = cookies()
  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Cliente para componentes do cliente
export const createClientClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: 'student' | 'teacher' | 'admin'
          unit_id: string | null
          date_of_birth: string | null
          address: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          role: 'student' | 'teacher' | 'admin'
          unit_id?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'student' | 'teacher' | 'admin'
          unit_id?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          name: string
          location: string
          country: string
          address: string | null
          phone: string | null
          email: string | null
          capacity: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          country?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          capacity?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          location?: string
          country?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          capacity?: number | null
          is_active?: boolean
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          unit_id: string | null
          teacher_id: string | null
          max_participants: number
          age_min: number
          age_max: number
          schedule_days: string[] | null
          schedule_time: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          unit_id?: string | null
          teacher_id?: string | null
          max_participants?: number
          age_min?: number
          age_max?: number
          schedule_days?: string[] | null
          schedule_time?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          unit_id?: string | null
          teacher_id?: string | null
          max_participants?: number
          age_min?: number
          age_max?: number
          schedule_days?: string[] | null
          schedule_time?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          activity_id: string
          status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled'
          enrolled_at: string
          approved_at: string | null
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          student_id: string
          activity_id: string
          status?: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled'
          notes?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          activity_id?: string
          status?: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled'
          approved_at?: string | null
          completed_at?: string | null
          notes?: string | null
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          activity_id: string
          date: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes: string | null
          marked_by: string | null
          marked_at: string
        }
        Insert: {
          id?: string
          student_id: string
          activity_id: string
          date: string
          status: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          marked_by?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          activity_id?: string
          date?: string
          status?: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          marked_by?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          event_time: string | null
          location: string | null
          unit_id: string | null
          max_participants: number | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          event_time?: string | null
          location?: string | null
          unit_id?: string | null
          max_participants?: number | null
          is_active?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          location?: string | null
          unit_id?: string | null
          max_participants?: number | null
          is_active?: boolean
          created_by?: string | null
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          student_id: string
          registered_at: string
          status: 'registered' | 'attended' | 'cancelled'
        }
        Insert: {
          id?: string
          event_id: string
          student_id: string
          status?: 'registered' | 'attended' | 'cancelled'
        }
        Update: {
          id?: string
          event_id?: string
          student_id?: string
          status?: 'registered' | 'attended' | 'cancelled'
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          is_read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          is_read?: boolean
          read_at?: string | null
        }
      }
    }
  }
}
