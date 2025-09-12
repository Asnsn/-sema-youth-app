"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface Student {
  id: string
  name: string
  phone: string
  dateOfBirth: string
  currentStatus: string | null
}

interface AttendanceFormProps {
  activityId: string
  teacherId: string
  students: Student[]
  date: string
}

export function AttendanceForm({ activityId, teacherId, students, date }: AttendanceFormProps) {
  const [attendance, setAttendance] = useState<Record<string, { status: string; notes: string }>>(
    students.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: {
          status: student.currentStatus || "",
          notes: "",
        },
      }),
      {},
    ),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const attendanceRecords = Object.entries(attendance)
        .filter(([_, data]) => data.status)
        .map(([studentId, data]) => ({
          student_id: studentId,
          activity_id: activityId,
          date,
          status: data.status,
          notes: data.notes || null,
          recorded_by: teacherId,
        }))

      if (attendanceRecords.length === 0) {
        setError("Por favor, marque a presença de pelo menos um aluno")
        setIsLoading(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Attendance saved:", attendanceRecords)

      setSuccess(true)
      setTimeout(() => {
        router.push("/teacher")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar presença")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "excused":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Presença registrada com sucesso!
        </h3>
        <p className="text-green-700 dark:text-green-300">Redirecionando para o dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.phone && `Tel: ${student.phone}`}
                  {student.dateOfBirth && ` • Nascimento: ${new Date(student.dateOfBirth).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              {attendance[student.id]?.status && (
                <Badge className={getStatusColor(attendance[student.id].status)}>
                  {getStatusIcon(attendance[student.id].status)}
                  <span className="ml-1 capitalize">{attendance[student.id].status}</span>
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {[
                { value: "present", label: "Presente", color: "green" },
                { value: "absent", label: "Ausente", color: "red" },
                { value: "late", label: "Atrasado", color: "yellow" },
                { value: "excused", label: "Justificado", color: "blue" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={attendance[student.id]?.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(student.id, option.value)}
                  className={
                    attendance[student.id]?.status === option.value
                      ? `bg-${option.color}-600 hover:bg-${option.color}-700`
                      : ""
                  }
                >
                  {getStatusIcon(option.value)}
                  <span className="ml-1">{option.label}</span>
                </Button>
              ))}
            </div>

            <div>
              <Label htmlFor={`notes-${student.id}`} className="text-sm">
                Observações (opcional)
              </Label>
              <Textarea
                id={`notes-${student.id}`}
                placeholder="Adicione observações sobre o aluno..."
                value={attendance[student.id]?.notes || ""}
                onChange={(e) => handleNotesChange(student.id, e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
          {isLoading ? "Salvando..." : "Salvar Presença"}
        </Button>
      </div>
    </div>
  )
}
