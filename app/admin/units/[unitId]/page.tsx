import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Users, BookOpen, Calendar, Settings, Edit } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ unitId: string }>
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { unitId } = await params

  const unit = {
    id: unitId,
    name: "SEMA Brasil",
    location: "São Paulo",
    country: "Brasil",
    created_at: "2024-01-01",
  }

  const students = [
    { id: "1", full_name: "João Silva", email: "joao@email.com", created_at: "2024-01-15" },
    { id: "2", full_name: "Maria Santos", email: "maria@email.com", created_at: "2024-01-20" },
  ]

  const teachers = [{ id: "1", full_name: "Prof. Carlos", email: "carlos@email.com" }]

  const activeActivities = [
    {
      id: "1",
      name: "Yoga Matinal",
      description: "Aulas de yoga para iniciantes",
      category: "wellness",
      max_participants: 20,
      schedule_days: ["Segunda", "Quarta"],
      schedule_time: "07:00",
      enrollments: [{ id: "1" }, { id: "2" }],
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "Workshop de Meditação",
      event_date: "2024-12-20",
      event_time: "14:00",
      max_participants: 15,
    },
  ]

  // Process data
  const totalEnrollments = activeActivities.reduce((sum, activity) => sum + (activity.enrollments?.length || 0), 0)
  const activeEnrollments = activeActivities.reduce(
    (sum, activity) => sum + (activity.enrollments?.filter((e: any) => e.status === "active").length || 0),
    0,
  )

  // Attendance statistics
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const recentAttendance = activeActivities.reduce(
    (sum, activity) => sum + ((activity as any).attendance?.filter((a: any) => a.date >= thirtyDaysAgo).length || 0),
    0,
  )
  const presentAttendance = activeActivities.reduce(
    (sum, activity) =>
      sum + ((activity as any).attendance?.filter((a: any) => a.date >= thirtyDaysAgo && a.status === "present").length || 0),
    0,
  )
  const attendanceRate = recentAttendance > 0 ? Math.round((presentAttendance / recentAttendance) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/units">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                {unit.name}
              </h1>
              <p className="text-green-700 dark:text-green-300">
                {unit.location}, {unit.country}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/admin/units/${unit.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/admin/units/${unit.id}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alunos</p>
                  <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Professores</p>
                  <p className="text-3xl font-bold text-green-600">{teachers.length}</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atividades</p>
                  <p className="text-3xl font-bold text-orange-600">{activeActivities.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Presença</p>
                  <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
                </div>
                <div className="h-10 w-10 text-purple-600 flex items-center justify-center text-2xl font-bold">%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activities */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Atividades da Unidade
                </CardTitle>
                <CardDescription>Modalidades oferecidas nesta unidade</CardDescription>
              </CardHeader>
              <CardContent>
                {activeActivities.length > 0 ? (
                  <div className="space-y-4">
                    {activeActivities.map((activity) => {
                      const enrollments = activity.enrollments?.length || 0
                      const occupancyRate = Math.round((enrollments / activity.max_participants) * 100)

                      return (
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Inscritos</p>
                              <p className="font-semibold">
                                {enrollments}/{activity.max_participants}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Ocupação</p>
                              <p className="font-semibold">{occupancyRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Dias</p>
                              <p className="font-semibold">{activity.schedule_days?.join(", ")}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Horário</p>
                              <p className="font-semibold">{activity.schedule_time}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Nenhuma atividade ativa nesta unidade.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Students and Teachers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Alunos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length > 0 ? (
                    <div className="space-y-3">
                      {students.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{student.full_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(student.created_at).toLocaleDateString("pt-BR")}
                          </Badge>
                        </div>
                      ))}
                      {students.length > 5 && (
                        <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                          <Link href={`/admin/units/${unit.id}/students`}>Ver todos ({students.length})</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum aluno cadastrado.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Professores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teachers.length > 0 ? (
                    <div className="space-y-3">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{teacher.full_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Ativo
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum professor cadastrado.</p>
                  )}
                </CardContent>
              </Card>
            </div>
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
                  <Link href={`/admin/units/${unit.id}/students`}>
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Alunos
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href={`/admin/units/${unit.id}/activities`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Gerenciar Atividades
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href={`/admin/units/${unit.id}/events`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Gerenciar Eventos
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href={`/admin/units/${unit.id}/reports`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Relatórios da Unidade
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(event.event_date).toLocaleDateString("pt-BR")}
                          {event.event_time && ` às ${event.event_time}`}
                        </p>
                        {event.max_participants && (
                          <Badge variant="outline" className="text-xs mt-2">
                            Máx: {event.max_participants}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum evento próximo.</p>
                )}
              </CardContent>
            </Card>

            {/* Unit Info */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Informações da Unidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Localização</p>
                  <p className="text-sm">{unit.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">País</p>
                  <p className="text-sm">{unit.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Criada em</p>
                  <p className="text-sm">{new Date(unit.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inscrições</p>
                  <p className="text-sm">
                    {activeEnrollments} ativas de {totalEnrollments} totais
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
