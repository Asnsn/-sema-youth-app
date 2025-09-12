"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, CheckCircle, Clock, BookOpen, UserCheck } from "lucide-react"
import Link from "next/link"

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get teacher profile
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      units (name, location, country)
    `)
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "teacher") {
    redirect("/auth/login")
  }

  // Get teacher's activities
  const { data: activities } = await supabase
    .from("activities")
    .select(`
      *,
      enrollments!inner (
        id,
        status,
        profiles (full_name, id)
      )
    `)
    .eq("teacher_id", user.id)
    .eq("is_active", true)

  // Get today's activities for quick attendance
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const todaysActivities = activities?.filter((activity) => activity.schedule_days?.includes(today)) || []

  // Get recent attendance records
  const { data: recentAttendance } = await supabase
    .from("attendance")
    .select(`
      *,
      profiles (full_name),
      activities (name)
    `)
    .eq("recorded_by", user.id)
    .order("recorded_at", { ascending: false })
    .limit(10)

  // Calculate statistics
  const totalStudents = activities?.reduce((sum, activity) => sum + (activity.enrollments?.length || 0), 0) || 0
  const totalActivities = activities?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              Professor {profile.full_name.split(" ")[0]}
            </h1>
            <p className="text-green-700 dark:text-green-300">
              {profile.units?.name} - {profile.units?.location}, {profile.units?.country}
            </p>
          </div>
          <Button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = "/"
            }}
            variant="outline"
          >
            Sair
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Atividades</p>
                  <p className="text-2xl font-bold text-blue-600">{totalActivities}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Alunos</p>
                  <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atividades Hoje</p>
                  <p className="text-2xl font-bold text-orange-600">{todaysActivities.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Registros Hoje</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {recentAttendance?.filter((r) => r.date === new Date().toISOString().split("T")[0]).length || 0}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Activities */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Atividades de Hoje
                </CardTitle>
                <CardDescription>Faça a chamada das suas atividades de hoje</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysActivities.length > 0 ? (
                  <div className="space-y-4">
                    {todaysActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{activity.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.enrollments?.length || 0} alunos inscritos
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            {activity.schedule_time}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                            <Link href={`/teacher/attendance/${activity.id}`}>Fazer Chamada</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/teacher/activities/${activity.id}`}>Ver Detalhes</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhuma atividade agendada para hoje.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* All Activities */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Todas as Minhas Atividades
                </CardTitle>
                <CardDescription>Gerencie suas atividades e alunos</CardDescription>
              </CardHeader>
              <CardContent>
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{activity.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {activity.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {activity.enrollments?.length || 0}/{activity.max_participants} alunos
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {activity.schedule_days?.join(", ")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {activity.schedule_time}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/teacher/activities/${activity.id}`}>Gerenciar</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Você ainda não tem atividades atribuídas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/teacher/activities">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ver Todas Atividades
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/teacher/students">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Alunos
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/teacher/reports">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Relatórios
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Registros Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAttendance && recentAttendance.length > 0 ? (
                  <div className="space-y-3">
                    {recentAttendance.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{record.profiles?.full_name}</p>
                          <p className="text-gray-500 dark:text-gray-400">{record.activities?.name}</p>
                        </div>
                        <Badge variant={record.status === "present" ? "default" : "secondary"} className="text-xs">
                          {record.status === "present" ? "Presente" : "Ausente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum registro ainda hoje.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
