"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface EnrollmentFormProps {
  activityId: string
  studentId: string
  isWaitingList: boolean
}

export function EnrollmentForm({ activityId, studentId, isWaitingList }: EnrollmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnrollment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("enrollments").insert({
        student_id: studentId,
        activity_id: activityId,
        status: isWaitingList ? "waiting" : "active",
      })

      if (error) throw error

      router.push("/student")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer inscrição")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <Button
        onClick={handleEnrollment}
        disabled={isLoading}
        className={isWaitingList ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
      >
        {isLoading ? "Processando..." : isWaitingList ? "Entrar na Lista de Espera" : "Confirmar Inscrição"}
      </Button>
    </div>
  )
}
