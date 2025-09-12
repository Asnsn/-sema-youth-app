import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EnrollmentForm } from "@/components/enrollment-form"

interface PageProps {
  params: Promise<{ activityId: string }>
}

export default async function EnrollPage({ params }: PageProps) {
  const { activityId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get student profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "student") {
    redirect("/auth/login")
  }

  // Get activity details
  const { data: activity } = await supabase
    .from("activities")
    .select(`
      *,
      units (name, location),
      profiles!activities_teacher_id_fkey (full_name)
    `)
    .eq("id", activityId)
    .single()

  if (!activity) {
    redirect("/student")
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", user.id)
    .eq("activity_id", activityId)
    .single()

  // Get current enrollment count
  const { count: currentEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact" })
    .eq("activity_id", activityId)
    .eq("status", "active")

  const isFullyBooked = currentEnrollments >= activity.max_participants
  const canEnroll = !existingEnrollment && !isFullyBooked

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/student">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Inscrição em Atividade</h1>
          </div>

          {/* Activity Details */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{activity.name}</CardTitle>
                  <CardDescription>
                    {activity.units?.name} - {activity.units?.location}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {activity.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <strong>Vagas:</strong> {currentEnrollments}/{activity.max_participants}
                  </span>
                </div>
                {activity.profiles && (
                  <div className="text-sm">
                    <strong>Professor:</strong> {activity.profiles.full_name}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Faixa etária:</strong> {activity.age_min} - {activity.age_max} anos
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Status */}
          {existingEnrollment ? (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Você já está inscrito nesta atividade
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    Status: <Badge variant="outline">{existingEnrollment.status}</Badge>
                  </p>
                  <Button asChild>
                    <Link href="/student">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : isFullyBooked ? (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Atividade Lotada</h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    Esta atividade atingiu o número máximo de participantes. Você pode entrar na lista de espera.
                  </p>
                  <EnrollmentForm activityId={activityId} studentId={user.id} isWaitingList={true} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Confirmar Inscrição</h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">Você deseja se inscrever nesta atividade?</p>
                  <EnrollmentForm activityId={activityId} studentId={user.id} isWaitingList={false} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
