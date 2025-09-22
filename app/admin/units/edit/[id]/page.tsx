"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

export default function EditUnit() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "Brasil",
    students: 0,
    teachers: 0,
    activities: 0,
    attendance: 0,
  })

  useEffect(() => {
    const mockUnits = [
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
    ]

    const unit = mockUnits.find((u) => u.id === Number.parseInt(params.id as string))
    if (unit) {
      setFormData(unit)
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Unidade atualizada:", formData)
    router.push("/admin/units")
  }

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta unidade?")) {
      console.log("Unidade excluída:", params.id)
      router.push("/admin/units")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/units" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Editar Unidade</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Unidade</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite o nome da unidade"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Digite a localização (cidade)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Brasil">Brasil</option>
              <option value="Angola">Angola</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Alunos</label>
              <input
                type="number"
                min="0"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Professores</label>
              <input
                type="number"
                min="0"
                value={formData.teachers}
                onChange={(e) => setFormData({ ...formData, teachers: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Atividades</label>
              <input
                type="number"
                min="0"
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Percentual de Presença (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
