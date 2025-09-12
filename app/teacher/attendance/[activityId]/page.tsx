import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Clock, Users, Save, UserCheck, UserX } from "lucide-react"
import Link from "next/link"
import { TeacherSidebar } from "@/components/teacher-sidebar"
import { TeacherMobileNav } from "@/components/teacher-mobile-nav"

interface PageProps {
  params: Promise<{ activityId: string }>
}

export default async function AttendancePage({ params }: PageProps) {
  const { activityId } = await params

  const mockActivity = {
    id: activityId,
    name: "Yoga Matinal",
    schedule_days: ["Segunda", "Quarta", "Sexta"],
    schedule_time: "07:00 - 08:00",
    units: {
      name: "SEMA Brasil",
      location: "São Paulo, Brasil",
    },
  }

  const mockEnrollments = [
    {
      id: "enrollment-1",
      profiles: {
        id: "student-1",
        full_name: "João Silva",
        phone: "(11) 99999-9999",
        date_of_birth: "1995-05-15",
      },
    },
    {
      id: "enrollment-2",
      profiles: {
        id: "student-2",
        full_name: "Maria Santos",
        phone: "(11) 88888-8888",
        date_of_birth: "1992-08-20",
      },
    },
    {
      id: "enrollment-3",
      profiles: {
        id: "student-3",
        full_name: "Pedro Costa",
        phone: "(11) 77777-7777",
        date_of_birth: "1988-12-03",
      },
    },
    {
      id: "enrollment-4",
      profiles: {
        id: "student-4",
        full_name: "Ana Oliveira",
        phone: "(11) 66666-6666",
        date_of_birth: "1993-07-22",
      },
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherMobileNav />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="outline" size="sm">
                <Link href="/teacher/attendance">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lista de Presença</h1>
                <p className="text-gray-600">{mockActivity.name}</p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{mockActivity.name}</span>
                  <span className="text-sm font-normal text-gray-500">{new Date().toLocaleDateString("pt-BR")}</span>
                </CardTitle>
                <CardDescription>
                  {mockActivity.units?.name} - {mockActivity.units?.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Dias:</strong> {mockActivity.schedule_days?.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <strong>Horário:</strong> {mockActivity.schedule_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">
                      <strong>Alunos:</strong> {mockEnrollments?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chamada - {new Date().toLocaleDateString("pt-BR")}</CardTitle>
                    <CardDescription>Marque os alunos presentes na aula de hoje</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Chamada
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {mockEnrollments && mockEnrollments.length > 0 ? (
                  <div className="space-y-3">
                    {mockEnrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox id={`attendance-${enrollment.id}`} className="h-5 w-5" />
                          <div>
                            <h3 className="font-medium text-gray-900">{enrollment.profiles?.full_name}</h3>
                            <p className="text-sm text-gray-500">
                              {enrollment.profiles?.phone && `Tel: ${enrollment.profiles.phone}`}
                              {enrollment.profiles?.date_of_birth &&
                                ` • Nascimento: ${new Date(enrollment.profiles.date_of_birth).toLocaleDateString("pt-BR")}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-500">Presente</span>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Resumo da Chamada</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          <span className="font-medium">0</span> de{" "}
                          <span className="font-medium">{mockEnrollments.length}</span> presentes
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum aluno inscrito nesta atividade.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
