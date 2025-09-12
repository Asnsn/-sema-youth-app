"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, CheckCircle, Clock, BookOpen, UserCheck, Bell, LogOut } from "lucide-react"
import TeacherMobileNav from "@/components/teacher-mobile-nav"
import TeacherSidebar from "@/components/teacher-sidebar"
import { useSidebar } from "@/contexts/sidebar-context"

const mockProfile = {
  full_name: "Professor Silva",
  role: "teacher",
  units: {
    name: "Unidade Central",
    location: "São Paulo",
    country: "Brasil",
  },
}

const mockActivities = [
  {
    id: 1,
    name: "Yoga Matinal",
    description: "Aula de yoga para iniciantes",
    category: "fitness",
    max_participants: 20,
    schedule_days: ["monday", "wednesday", "friday"],
    schedule_time: "07:00",
    is_active: true,
    enrollments: [
      { id: 1, status: "active", profiles: { full_name: "Ana Silva", id: 1 } },
      { id: 2, status: "active", profiles: { full_name: "João Santos", id: 2 } },
    ],
  },
  {
    id: 2,
    name: "Pilates Avançado",
    description: "Aula de pilates para praticantes experientes",
    category: "fitness",
    max_participants: 15,
    schedule_days: ["tuesday", "thursday"],
    schedule_time: "18:00",
    is_active: true,
    enrollments: [{ id: 3, status: "active", profiles: { full_name: "Maria Costa", id: 3 } }],
  },
]

const mockRecentAttendance = [
  {
    id: 1,
    status: "present",
    date: new Date().toISOString().split("T")[0],
    recorded_at: new Date().toISOString(),
    profiles: { full_name: "Ana Silva" },
    activities: { name: "Yoga Matinal" },
  },
  {
    id: 2,
    status: "absent",
    date: new Date().toISOString().split("T")[0],
    recorded_at: new Date().toISOString(),
    profiles: { full_name: "João Santos" },
    activities: { name: "Yoga Matinal" },
  },
]

export default function TeacherDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { isCollapsed } = useSidebar()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    router.push("/auth/login")
  }

  const profile = mockProfile
  const activities = mockActivities
  const recentAttendance = mockRecentAttendance

  // Get today's activities for quick attendance
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const todaysActivities = activities?.filter((activity) => activity.schedule_days?.includes(today)) || []

  // Calculate statistics
  const totalStudents = activities?.reduce((sum, activity) => sum + (activity.enrollments?.length || 0), 0) || 0
  const totalActivities = activities?.length || 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />

      {/* Main Content */}
      <div className={`lg:pl-64 transition-all duration-300 ${isCollapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Professor {profile.full_name.split(" ")[0]}</h1>
              <p className="text-sm text-gray-500">
                {profile.units?.name} - {profile.units?.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Bell size={20} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-red-50 text-red-600">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Professor</h1>
            <p className="text-gray-600">
              Professor {profile.full_name} - {profile.units?.name}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{totalActivities}</p>
                  <p className="text-sm text-gray-500">Atividades</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-sm text-gray-500">Alunos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{todaysActivities.length}</p>
                  <p className="text-sm text-gray-500">Hoje</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {recentAttendance?.filter((r) => r.date === new Date().toISOString().split("T")[0]).length || 0}
                  </p>
                  <p className="text-sm text-gray-500">Registros</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Activities */}
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Atividades de Hoje</h2>
              {todaysActivities.length > 0 ? (
                <div className="space-y-4">
                  {todaysActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{activity.name}</h3>
                          <p className="text-sm text-gray-500">{activity.enrollments?.length || 0} alunos inscritos</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {activity.schedule_time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/teacher/attendance/${activity.id}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Fazer Chamada
                        </Link>
                        <Link
                          href={`/teacher/activities/${activity.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-center">Nenhuma atividade agendada para hoje.</p>
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Attendance */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="space-y-3">
                  <Link
                    href="/teacher/activities"
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95 block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Ver Todas Atividades</h3>
                        <p className="text-xs lg:text-sm text-gray-500">Gerencie suas atividades</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/teacher/students"
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95 block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Gerenciar Alunos</h3>
                        <p className="text-xs lg:text-sm text-gray-500">Lista de alunos</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/teacher/reports"
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95 block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={20} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Relatórios</h3>
                        <p className="text-xs lg:text-sm text-gray-500">Análises e estatísticas</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Attendance */}
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Registros Recentes</h2>
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                  {recentAttendance && recentAttendance.length > 0 ? (
                    <div className="space-y-3">
                      {recentAttendance.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{record.profiles?.full_name}</p>
                            <p className="text-xs text-gray-500">{record.activities?.name}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "present" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {record.status === "present" ? "Presente" : "Ausente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center">Nenhum registro ainda hoje.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <TeacherMobileNav />
      </div>
    </div>
  )
}
