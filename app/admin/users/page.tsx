"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Download, Edit, Trash2, Search } from "lucide-react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "João Silva", email: "joao@email.com", type: "Aluno", unit: "SEMA Brasil", status: "Ativo" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", type: "Professor", unit: "SEMA Brasil", status: "Ativo" },
    { id: 3, name: "Pedro Costa", email: "pedro@email.com", type: "Aluno", unit: "SEMA Angola", status: "Ativo" },
    { id: 4, name: "Ana Oliveira", email: "ana@email.com", type: "Professor", unit: "SEMA Angola", status: "Inativo" },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExportList = () => {
    const csvContent =
      "Nome,Email,Tipo,Unidade,Status\n" +
      users.map((user) => `${user.name},${user.email},${user.type},${user.unit},${user.status}`).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "usuarios_sema.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Usuários</h1>
                <p className="text-sm text-gray-500">{users.length} usuários</p>
              </div>
            </div>
            <button onClick={handleExportList} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
              <Download size={20} />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                <p className="text-gray-600">Administração de alunos e professores ({users.length} usuários)</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportList}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download size={16} />
                  Exportar Lista
                </button>
                <Link
                  href="/admin/users/new"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Novo Usuário
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search and Filters */}
        <div className="hidden lg:block px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {/* Mobile Users List */}
          <div className="lg:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{user.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "Professor" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.type}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{user.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span
                      className={`w-2 h-2 rounded-full ${user.status === "Ativo" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <Link
                      href={`/admin/users/edit/${user.id}`}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Unidade</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "Professor" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{user.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${user.status === "Ativo" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className={`text-sm ${user.status === "Ativo" ? "text-green-700" : "text-red-700"}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/edit/${user.id}`}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <Link
        href="/admin/users/new"
        className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <Plus size={24} className="text-white" />
      </Link>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}
