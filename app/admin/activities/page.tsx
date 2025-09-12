"use client"

import { useState } from "react"
import Link from "next/link"

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
    <div
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 100%)", padding: "2rem" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1565c0", margin: "0 0 0.5rem 0" }}>
              Gerenciar Atividades
            </h1>
            <p style={{ color: "#2e7d32", margin: 0 }}>Modalidades e programas oferecidos</p>
          </div>
          <Link
            href="/admin"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#1565c0",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500",
            }}
          >
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Actions */}
        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={handleNewActivity}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            + Nova Atividade
          </button>
          <button
            onClick={handleParticipationReport}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#ea580c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Relatório de Participação
          </button>
        </div>

        {/* Activities Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>{activity.name}</h3>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    backgroundColor: activity.status === "Ativo" ? "#dcfce7" : "#fef3c7",
                    color: activity.status === "Ativo" ? "#166534" : "#92400e",
                  }}
                >
                  {activity.status}
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p style={{ margin: "0.25rem 0", color: "#666", fontSize: "0.9rem" }}>
                  <strong>Categoria:</strong> {activity.category}
                </p>
                <p style={{ margin: "0.25rem 0", color: "#666", fontSize: "0.9rem" }}>
                  <strong>Instrutor:</strong> {activity.instructor}
                </p>
                <p style={{ margin: "0.25rem 0", color: "#666", fontSize: "0.9rem" }}>
                  <strong>Participantes:</strong> {activity.participants}
                </p>
                <p style={{ margin: "0.25rem 0", color: "#666", fontSize: "0.9rem" }}>
                  <strong>Unidade:</strong> {activity.unit}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEditActivity(activity.id)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#1565c0",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleViewDetails(activity.id)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#ea580c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
