"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    unitId: "",
    dateOfBirth: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [units, setUnits] = useState<any[]>([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const router = useRouter()

  // Buscar unidades do banco de dados
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch('/api/units')
        if (response.ok) {
          const data = await response.json()
          setUnits(data)
        } else {
          // Fallback para unidades hardcoded se a API falhar
          setUnits([
            { id: "1", name: "SEMA São Paulo", location: "São Paulo", country: "Brasil" },
            { id: "2", name: "SEMA Rio de Janeiro", location: "Rio de Janeiro", country: "Brasil" },
            { id: "3", name: "SEMA Belo Horizonte", location: "Belo Horizonte", country: "Brasil" },
            { id: "4", name: "SEMA Salvador", location: "Salvador", country: "Brasil" },
            { id: "5", name: "SEMA Kampala", location: "Kampala", country: "Uganda" },
          ])
        }
      } catch (error) {
        console.error('Error fetching units:', error)
        // Fallback para unidades hardcoded
        setUnits([
          { id: "1", name: "SEMA São Paulo", location: "São Paulo", country: "Brasil" },
          { id: "2", name: "SEMA Rio de Janeiro", location: "Rio de Janeiro", country: "Brasil" },
          { id: "3", name: "SEMA Belo Horizonte", location: "Belo Horizonte", country: "Brasil" },
          { id: "4", name: "SEMA Salvador", location: "Salvador", country: "Brasil" },
          { id: "5", name: "SEMA Kampala", location: "Kampala", country: "Uganda" },
        ])
      } finally {
        setUnitsLoading(false)
      }
    }

    fetchUnits()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (!formData.unitId) {
      setError("Por favor, selecione uma unidade")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'student', // Por padrão, novos usuários são estudantes
          unit_id: formData.unitId,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      // Sucesso - redirecionar para página de sucesso
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1565c0",
              margin: "0 0 8px 0",
            }}
          >
            SEMA
          </h1>
          <p
            style={{
              color: "#2e7d32",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Sistema de Gestão Educacional
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              textAlign: "center",
              marginBottom: "8px",
              color: "#1a1a1a",
            }}
          >
            Criar Conta
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "24px",
              color: "#666666",
            }}
          >
            Cadastre-se como aluno para acessar o sistema SEMA
          </p>

          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Senha *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Confirmar Senha *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Unidade SEMA *
              </label>
              <select
                required
                value={formData.unitId}
                onChange={(e) => handleInputChange("unitId", e.target.value)}
                disabled={unitsLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: unitsLoading ? "#f5f5f5" : "white",
                }}
              >
                <option value="">
                  {unitsLoading ? "Carregando unidades..." : "Selecione a unidade"}
                </option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} - {unit.location}, {unit.country}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                }}
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#1a1a1a",
                  backgroundColor: "white",
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#d32f2f",
                  textAlign: "center",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isLoading ? "#90caf9" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginBottom: "16px",
              }}
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>

            <div style={{ textAlign: "center", fontSize: "14px" }}>
              <span style={{ color: "#666666" }}>Já tem uma conta? </span>
              <Link
                href="/auth/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
              >
                Fazer login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
