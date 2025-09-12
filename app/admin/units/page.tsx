"use client"

import { useState } from "react"
import Link from "next/link"

export default function AdminUnits() {
  const [units, setUnits] = useState([
    {
      id: 1,
      name: "SEMA Brasil",
      location: "São Paulo",
      country: "Brasil",
      students: 89,
      teachers: 8,
      activities: 6,
      attendance: 92,
    },
    {
      id: 2,
      name: "SEMA Angola",
      location: "Luanda",
      country: "Angola",
      students: 67,
      teachers: 16,
      activities: 8,
      attendance: 85,
    },
  ])

  const handleNewUnit = () => {
    const name = prompt("Nome da unidade:")
    const location = prompt("Localização:")
    const country = prompt("País:")
    const students = prompt("Número de alunos:")
    const teachers = prompt("Número de professores:")
    const activities = prompt("Número de atividades:")
    const attendance = prompt("Percentual de presença:")

    if (name && location && country && students && teachers && activities && attendance) {
      const newUnit = {
        id: units.length + 1,
        name,
        location,
        country,
        students: Number.parseInt(students),
        teachers: Number.parseInt(teachers),
        activities: Number.parseInt(activities),
        attendance: Number.parseInt(attendance),
      }
      setUnits([...units, newUnit])
      alert("Unidade criada com sucesso!")
    }
  }

  const handleViewDetails = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    if (unit) {
      alert(
        `Detalhes da Unidade:\n\nNome: ${unit.name}\nLocalização: ${unit.location}, ${unit.country}\nAlunos: ${unit.students}\nProfessores: ${unit.teachers}\nAtividades: ${unit.activities}\nPresença: ${unit.attendance}%`,
      )
    }
  }

  const handleEditUnit = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    if (unit) {
      const newName = prompt("Novo nome:", unit.name)
      const newLocation = prompt("Nova localização:", unit.location)
      const newCountry = prompt("Novo país:", unit.country)
      const newStudents = prompt("Novo número de alunos:", unit.students.toString())
      const newTeachers = prompt("Novo número de professores:", unit.teachers.toString())
      const newActivities = prompt("Novo número de atividades:", unit.activities.toString())
      const newAttendance = prompt("Novo percentual de presença:", unit.attendance.toString())

      if (newName && newLocation && newCountry && newStudents && newTeachers && newActivities && newAttendance) {
        setUnits(
          units.map((u) =>
            u.id === unitId
              ? {
                  ...u,
                  name: newName,
                  location: newLocation,
                  country: newCountry,
                  students: Number.parseInt(newStudents),
                  teachers: Number.parseInt(newTeachers),
                  activities: Number.parseInt(newActivities),
                  attendance: Number.parseInt(newAttendance),
                }
              : u,
          ),
        )
        alert("Unidade atualizada com sucesso!")
      }
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
              Gerenciar Unidades
            </h1>
            <p style={{ color: "#2e7d32", margin: 0 }}>Administre todas as unidades SEMA</p>
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
            onClick={handleNewUnit}
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
            + Nova Unidade
          </button>
        </div>

        {/* Units Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
          {units.map((unit) => (
            <div
              key={unit.id}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1a1a1a", margin: "0 0 0.5rem 0" }}>
                  🏢 {unit.name}
                </h3>
                <p style={{ color: "#666", margin: 0 }}>
                  📍 {unit.location}, {unit.country}
                </p>
              </div>

              {/* Statistics */}
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}
              >
                <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "4px" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1565c0", margin: 0 }}>{unit.students}</p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>Alunos</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "4px" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2e7d32", margin: 0 }}>{unit.teachers}</p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>Professores</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#fff7ed", borderRadius: "4px" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ea580c", margin: 0 }}>
                    {unit.activities}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>Atividades</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#faf5ff", borderRadius: "4px" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7c3aed", margin: 0 }}>
                    {unit.attendance}%
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>Presença</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleViewDetails(unit.id)}
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
                  Ver Detalhes
                </button>
                <button
                  onClick={() => handleEditUnit(unit.id)}
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
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
