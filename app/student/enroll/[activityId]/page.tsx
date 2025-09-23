"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Activity {
  id: string
  name: string
  description: string
  category: string
  schedule_days: string[]
  schedule_time: string
  max_participants: number
  age_min: number
  age_max: number
  unit_name: string
  unit_location: string
  teacher_name: string
}

interface PageProps {
  params: Promise<{ activityId: string }>
}

export default function EnrollPage({ params }: PageProps) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentEnrollments, setCurrentEnrollments] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/activities/${resolvedParams.activityId}`)
        
        if (!response.ok) {
          throw new Error('Atividade não encontrada')
        }
        
        const data = await response.json()
        setActivity(data)
        
        // Buscar número de inscrições atuais
        const enrollmentsResponse = await fetch(`/api/enrollments/activity/${resolvedParams.activityId}`)
        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json()
          setCurrentEnrollments(enrollmentsData.length)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar atividade')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [params])

  const handleEnrollment = async () => {
    if (!activity) return
    
    setEnrolling(true)
    setError(null)

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_id: activity.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer inscrição')
      }

      // Redirecionar para o dashboard com mensagem de sucesso
      router.push('/student?enrolled=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer inscrição')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="outline" size="sm">
                <Link href="/student">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-blue-900">Carregando...</h1>
            </div>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando atividade...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="outline" size="sm">
                <Link href="/student">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-blue-900">Erro</h1>
            </div>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {error || 'Atividade não encontrada'}
                  </h3>
                  <Button asChild>
                    <Link href="/student">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const isFullyBooked = currentEnrollments >= activity.max_participants

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
            <h1 className="text-2xl font-bold text-blue-900">Inscrição em Atividade</h1>
          </div>

          {/* Activity Details */}
          <Card className="bg-white/90 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{activity.name}</CardTitle>
                  <CardDescription>
                    {activity.unit_name} - {activity.unit_location}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {activity.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{activity.description}</p>

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
                <div className="text-sm">
                  <strong>Professor:</strong> {activity.teacher_name}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Faixa etária:</strong> {activity.age_min} - {activity.age_max} anos
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Status */}
          {isFullyBooked ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Atividade Lotada</h3>
                  <p className="text-red-700 mb-4">
                    Esta atividade atingiu o número máximo de participantes.
                  </p>
                  <Button asChild>
                    <Link href="/student">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Confirmar Inscrição</h3>
                  <p className="text-green-700 mb-4">Você deseja se inscrever nesta atividade?</p>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={handleEnrollment}
                      disabled={enrolling}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {enrolling ? "Processando..." : "Confirmar Inscrição"}
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
