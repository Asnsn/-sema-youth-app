"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Aluno",
    unit: "SEMA Brasil",
    status: "Ativo",
  })

  useEffect(() => {
    const mockUsers = [
      { id: 1, name: "João Silva", email: "joao@email.com", type: "Aluno", unit: "SEMA Brasil", status: "Ativo" },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria@email.com",
        type: "Professor",
        unit: "SEMA Brasil",
        status: "Ativo",
      },
      { id: 3, name: "Pedro Costa", email: "pedro@email.com", type: "Aluno", unit: "SEMA Angola", status: "Ativo" },
      {
        id: 4,
        name: "Ana Oliveira",
        email: "ana@email.com",
        type: "Professor",
        unit: "SEMA Angola",
        status: "Inativo",
      },
    ]

    const user = mockUsers.find((u) => u.id === Number.parseInt(params.id as string))
    if (user) {
      setFormData(user)
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Usuário atualizado:", formData)
    router.push("/admin/users")
  }

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      console.log("Usuário excluído:", params.id)
      router.push("/admin/users")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/users" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Editar Usuário</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
              <Trash2 size={16} />
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save size={16} />
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="SEMA Brasil">SEMA Brasil</option>
              <option value="SEMA Angola">SEMA Angola</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
