import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"
import { AttendanceForm } from "@/components/attendance-form"

interface PageProps {
  params: Promise<{ activityId: string }>
}

export default async function AttendancePage({ params }: PageProps) {
  const { activityId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get teacher profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "teacher") {
    redirect("/auth/login")
  }

  // Get activity details
  const { data: activity } = await supabase
    .from("activities")
    .select(`
      *,
      units (name, location)
    `)
    .eq("id", activityId)
    .eq("teacher_id", user.id)
    .single()

  if (!activity) {
    redirect("/teacher")
  }

  // Get enrolled students
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      *,
      profiles (
        id,
        full_name,
        phone,
        date_of_birth
      )
    `)
    .eq("activity_id", activityId)
    .eq("status", "active")
    .order("profiles(full_name)")

  // Get today's attendance records
  const today = new Date().toISOString().split("T")[0]
  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("activity_id", activityId)
    .eq("date", today)

  const attendanceMap = new Map(existingAttendance?.map((record) => [record.student_id, record]) || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/teacher">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Lista de Presença</h1>
              <p className="text-green-700 dark:text-green-300">{activity.name}</p>
            </div>
          </div>

          {/* Activity Info */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activity.name}</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString("pt-BR")}
                </span>
              </CardTitle>
              <CardDescription>
                {activity.units?.name} - {activity.units?.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Dias:</strong> {activity.schedule_days?.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    <strong>Horário:</strong> {activity.schedule_time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">
                    <strong>Alunos:</strong> {enrollments?.length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance List */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Chamada - {new Date().toLocaleDateString("pt-BR")}</CardTitle>
              <CardDescription>Marque a presença dos alunos para a aula de hoje</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments && enrollments.length > 0 ? (
                <AttendanceForm
                  activityId={activityId}
                  teacherId={user.id}
                  students={enrollments.map((e) => ({
                    id: e.profiles?.id || "",
                    name: e.profiles?.full_name || "",
                    phone: e.profiles?.phone || "",
                    dateOfBirth: e.profiles?.date_of_birth || "",
                    currentStatus: attendanceMap.get(e.profiles?.id || "")?.status || null,
                  }))}
                  date={today}
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum aluno inscrito nesta atividade.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
