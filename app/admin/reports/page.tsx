"use client"

import { useState } from "react"
import Link from "next/link"

export default function AdminReports() {
  const [reportType, setReportType] = useState("")

  const generateReport = (type: string) => {
    alert(`Gerando relatório de ${type}...`)
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
              Relatórios Administrativos
            </h1>
            <p style={{ color: "#2e7d32", margin: 0 }}>Análises detalhadas do sistema SEMA</p>
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

        {/* Report Categories */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a1a1a", marginBottom: "1rem" }}>
              📊 Relatório de Frequência
            </h3>
            <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
              Análise detalhada de presença por atividade e período
            </p>
            <ul style={{ marginBottom: "1.5rem", paddingLeft: "1rem" }}>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                Taxa de presença por atividade
              </li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Comparativo entre unidades</li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Tendências mensais</li>
            </ul>
            <button
              onClick={() => generateReport("Frequência")}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#1565c0",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              📥 Gerar Relatório
            </button>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a1a1a", marginBottom: "1rem" }}>
              👥 Relatório de Alunos
            </h3>
            <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
              Estatísticas de inscrições e participação
            </p>
            <ul style={{ marginBottom: "1.5rem", paddingLeft: "1rem" }}>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                Total de alunos por unidade
              </li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Inscrições por modalidade</li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                Faixa etária e distribuição
              </li>
            </ul>
            <button
              onClick={() => generateReport("Alunos")}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              📥 Gerar Relatório
            </button>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a1a1a", marginBottom: "1rem" }}>
              🏃 Relatório de Atividades
            </h3>
            <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
              Performance e ocupação das modalidades
            </p>
            <ul style={{ marginBottom: "1.5rem", paddingLeft: "1rem" }}>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Taxa de ocupação</li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Atividades mais populares</li>
              <li style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.25rem" }}>Performance por professor</li>
            </ul>
            <button
              onClick={() => generateReport("Atividades")}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#ea580c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              📥 Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
