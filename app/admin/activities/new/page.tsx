"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function NewActivity() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "Esporte",
    instructor: "",
    participants: 0,
    unit: "SEMA Brasil",
    status: "Ativo",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nova atividade criada:", formData)
    router.push("/admin/activities")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/activities" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Nova Atividade</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save size={16} />
            Criar
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Atividade</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o nome da atividade"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Esporte">Esporte</option>
              <option value="Arte">Arte</option>
              <option value="Cultura">Cultura</option>
              <option value="Educacional">Educacional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instrutor</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o nome do instrutor"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Participantes</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: Number.parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o número de participantes"
              required
            />
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
              <option value="Pausado">Pausado</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}
