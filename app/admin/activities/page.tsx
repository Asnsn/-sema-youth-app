"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, ArrowLeft, Plus, FileText, Edit, Eye } from "lucide-react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default function AdminActivities() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: "Futebol Masculino",
      category: "Esporte",
      instructor: "Carlos Silva",
      participants: 25,
      unit: "SEMA Brasil",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Dança Contemporânea",
      category: "Arte",
      instructor: "Maria Santos",
      participants: 18,
      unit: "SEMA Brasil",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Capoeira",
      category: "Cultura",
      instructor: "João Oliveira",
      participants: 22,
      unit: "SEMA Angola",
      status: "Ativo",
    },
    {
      id: 4,
      name: "Teatro Juvenil",
      category: "Arte",
      instructor: "Ana Costa",
      participants: 15,
      unit: "SEMA Angola",
      status: "Pausado",
    },
  ])

  const handleNewActivity = () => {
    const name = prompt("Nome da atividade:")
    const category = prompt("Categoria (Esporte/Arte/Cultura):")
    const instructor = prompt("Instrutor:")
    const participants = prompt("Número de participantes:")
    const unit = prompt("Unidade (SEMA Brasil/SEMA Angola):")

    if (name && category && instructor && participants && unit) {
      const newActivity = {
        id: activities.length + 1,
        name,
        category,
        instructor,
        participants: Number.parseInt(participants),
        unit,
        status: "Ativo",
      }
      setActivities([...activities, newActivity])
      alert("Atividade criada com sucesso!")
    }
  }

  const handleParticipationReport = () => {
    const reportData = activities
      .map((activity) => `${activity.name}: ${activity.participants} participantes (${activity.status})`)
      .join("\n")

    alert(`Relatório de Participação:\n\n${reportData}`)
  }

  const handleEditActivity = (activityId: number) => {
    const activity = activities.find((a) => a.id === activityId)
    if (activity) {
      const newName = prompt("Novo nome:", activity.name)
      const newCategory = prompt("Nova categoria:", activity.category)
      const newInstructor = prompt("Novo instrutor:", activity.instructor)
      const newParticipants = prompt("Novo número de participantes:", activity.participants.toString())
      const newUnit = prompt("Nova unidade:", activity.unit)
      const newStatus = prompt("Novo status:", activity.status)

      if (newName && newCategory && newInstructor && newParticipants && newUnit && newStatus) {
        setActivities(
          activities.map((a) =>
            a.id === activityId
              ? {
                  ...a,
                  name: newName,
                  category: newCategory,
                  instructor: newInstructor,
                  participants: Number.parseInt(newParticipants),
                  unit: newUnit,
                  status: newStatus,
                }
              : a,
          ),
        )
        alert("Atividade atualizada com sucesso!")
      }
    }
  }

  const handleViewDetails = (activityId: number) => {
    const activity = activities.find((a) => a.id === activityId)
    if (activity) {
      alert(
        `Detalhes da Atividade:\n\nNome: ${activity.name}\nCategoria: ${activity.category}\nInstrutor: ${activity.instructor}\nParticipantes: ${activity.participants}\nUnidade: ${activity.unit}\nStatus: ${activity.status}`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Atividades</h1>
                <p className="text-sm text-gray-500">Modalidades e programas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Atividades</h1>
                <p className="text-gray-600">Modalidades e programas oferecidos</p>
              </div>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleNewActivity}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Plus size={16} />
              Nova Atividade
            </button>
            <button
              onClick={handleParticipationReport}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <FileText size={16} />
              Relatório de Participação
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{activity.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-500">{activity.category}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{activity.participants} participantes</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Unidade:</strong> {activity.unit}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditActivity(activity.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleViewDetails(activity.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    <Eye size={14} />
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}
