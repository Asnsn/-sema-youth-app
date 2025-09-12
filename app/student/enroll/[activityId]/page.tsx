import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ activityId: string }>
}

export default async function EnrollPage({ params }: PageProps) {
  const { activityId } = await params

  const mockActivity = {
    id: activityId,
    name: "Natação",
    description: "Aulas de natação para todos os níveis",
    category: "sports",
    schedule_days: ["Segunda", "Quarta"],
    schedule_time: "19:00 - 20:00",
    max_participants: 15,
    units: {
      name: "SEMA Brasil",
      location: "São Paulo",
    },
    profiles: {
      full_name: "Prof. Maria Santos",
    },
    age_min: 16,
    age_max: 65,
  }

  const currentEnrollments = 8
  const isFullyBooked = currentEnrollments >= mockActivity.max_participants
  const existingEnrollment = false

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
                  <CardTitle className="text-xl">{mockActivity.name}</CardTitle>
                  <CardDescription>
                    {mockActivity.units?.name} - {mockActivity.units?.location}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {mockActivity.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{mockActivity.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <strong>Vagas:</strong> {currentEnrollments}/{mockActivity.max_participants}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Professor:</strong> {mockActivity.profiles.full_name}
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Faixa etária:</strong> {mockActivity.age_min} - {mockActivity.age_max} anos
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
                    Esta atividade atingiu o número máximo de participantes.
                  </p>
                  <Button asChild>
                    <Link href="/student">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Confirmar Inscrição</h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">Você deseja se inscrever nesta atividade?</p>
                  <div className="space-y-4">
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/student">Confirmar Inscrição</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
