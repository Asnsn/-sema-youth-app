import { createClientComponentClient } from '@supabase/ssr'
import { createServerComponentClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Client-side auth functions
export const createClientSupabase = () => {
  return createClientComponentClient()
}

// Server-side auth functions
export const createServerSupabase = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Login function
export async function signIn(email: string, password: string) {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Sign up function
export async function signUp(email: string, password: string, metadata: any) {
  const supabase = createClientSupabase()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Sign out function
export async function signOut() {
  const supabase = createClientSupabase()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// Get current user
export async function getCurrentUser() {
  const supabase = createServerSupabase()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return user
}

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = createServerSupabase()
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      role,
      unit_id,
      date_of_birth,
      phone,
      address,
      emergency_contact,
      emergency_phone,
      created_at,
      units (
        id,
        name,
        location,
        country
      )
    `)
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }
  
  return data
}

// Protected route helper
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

// Role-based access control
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/unauthorized')
  }
  
  return { user, profile }
}

// Check if user is admin
export async function requireAdmin() {
  return await requireRole(['admin'])
}

// Check if user is teacher or admin
export async function requireTeacherOrAdmin() {
  return await requireRole(['teacher', 'admin'])
}
