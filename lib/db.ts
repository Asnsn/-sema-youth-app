import { neon } from "@neondatabase/serverless"

export function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(process.env.DATABASE_URL)
}

export function getSql() {
  try {
    return getDbConnection()
  } catch (error) {
    console.error("Database connection error:", error)
    return null
  }
}

// Helper function to handle database operations
export async function executeQuery<T>(query: () => Promise<T>): Promise<T | null> {
  try {
    return await query()
  } catch (error) {
    console.error("Database query error:", error)
    return null
  }
}