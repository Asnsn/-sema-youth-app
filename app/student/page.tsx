"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  full_name: string
  role: string
  unit_id: string
  units?: {
    name: string
    location: string
    country: string
  }
}

interface Activity {
  id: string
  name: string
  description: string
  category: string
  schedule_days: string[]
  schedule_time: string
  max_participants: number
}

interface Enrollment {
  id: string
  student_id: string
  activity_id: string
  status: string
  enrolled_at: string
  activity: {
    id: string
    name: string
    description: string
    category: string
    schedule_days: string[]
    schedule_time: string
    unit_name: string
    unit_location: string
    teacher_name: string
  }
}

interface Event {
  id: string
  title: string
  event_date: string
  location?: string
}

interface AttendanceRecord {
  id: string
  status: string
  activities?: {
    name: string
  }
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do usuário do localStorage
        const userDataStr = localStorage.getItem('userData')
        if (userDataStr) {
          const userData = JSON.parse(userDataStr)
          console.log('User data from localStorage:', userData)
          
          setProfile({
            id: userData.id,
            full_name: userData.full_name,
            role: userData.role,
            unit_id: userData.unit_id,
            units: {
              name: "SEMA Brasil", // TODO: Buscar dados reais da unidade
              location: "São Paulo",
              country: "Brasil",
            },
          })
        }

        // Buscar dados reais das atividades
        try {
          const activitiesResponse = await fetch('/api/activities')
          if (activitiesResponse.ok) {
            const activities = await activitiesResponse.json()
            setAvailableActivities(activities)
          }
        } catch (error) {
          console.error('Error fetching activities:', error)
        }

        // Buscar inscrições do usuário
        try {
          const enrollmentsResponse = await fetch('/api/enrollments')
          if (enrollmentsResponse.ok) {
            const enrollments = await enrollmentsResponse.json()
            setEnrollments(enrollments)
          }
        } catch (error) {
          console.error('Error fetching enrollments:', error)
        }

        // Por enquanto, usar dados vazios para eventos e presença
        // TODO: Implementar APIs para buscar eventos e presença reais
        setUpcomingEvents([])
        setRecentAttendance([])
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSignOut = async () => {
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Olá, {profile.full_name.split(" ")[0]}!</h1>
            <p className="text-green-700">
              {profile.units?.name} - {profile.units?.location}, {profile.units?.country}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Activities */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Minhas Atividades
                </CardTitle>
                <CardDescription>Atividades em que você está inscrito</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="grid gap-4">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{enrollment.activity.name}</h3>
                          <Badge
                            variant={enrollment.activity.category === "sports" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {enrollment.activity.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{enrollment.activity.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {enrollment.activity.schedule_days?.join(", ")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {enrollment.activity.schedule_time}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Professor:</strong> {enrollment.activity.teacher_name} | 
                          <strong> Local:</strong> {enrollment.activity.unit_name} - {enrollment.activity.unit_location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Você ainda não está inscrito em nenhuma atividade.</p>
                )}
              </CardContent>
            </Card>

            {/* Available Activities */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Atividades Disponíveis
                </CardTitle>
                <CardDescription>Inscreva-se em novas atividades</CardDescription>
              </CardHeader>
              <CardContent>
                {availableActivities.length > 0 ? (
                  <div className="grid gap-4">
                    {availableActivities.map((activity) => (
                      <div key={activity.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{activity.name}</h3>
                          <Badge variant="outline" className="capitalize">
                            {activity.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {activity.schedule_days?.join(", ")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {activity.schedule_time}
                            </div>
                          </div>
                          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                            <Link href={`/student/enroll/${activity.id}`}>Inscrever-se</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Não há atividades disponíveis para inscrição no momento.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-white/90 backdrop-blur-sm">
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
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.event_date).toLocaleDateString("pt-BR")}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum evento próximo.</p>
                )}
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Frequência Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAttendance.length > 0 ? (
                  <div className="space-y-2">
                    {recentAttendance.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex justify-between items-center text-sm">
                        <span className="truncate">{record.activities?.name}</span>
                        <Badge variant={record.status === "present" ? "default" : "secondary"} className="text-xs">
                          {record.status === "present" ? "Presente" : "Ausente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum registro de presença ainda.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
