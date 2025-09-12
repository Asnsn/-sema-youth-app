"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Users, Calendar, ArrowLeft, Download } from "lucide-react"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default function AdminReports() {
  const [reportType, setReportType] = useState("")

  const generateReport = (type: string) => {
    alert(`Gerando relatório de ${type}...`)
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
                <h1 className="text-lg font-bold text-gray-900">Relatórios</h1>
                <p className="text-sm text-gray-500">Análises e estatísticas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Relatórios Administrativos</h1>
                <p className="text-gray-600">Análises detalhadas do sistema SEMA</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Relatório de Frequência</h3>
                  <p className="text-sm text-gray-500">Análise de presença</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Taxa de presença por atividade
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Comparativo entre unidades
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Tendências mensais
                </div>
              </div>

              <button
                onClick={() => generateReport("Frequência")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={16} />
                Gerar Relatório
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Relatório de Alunos</h3>
                  <p className="text-sm text-gray-500">Estatísticas de inscrições</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Total de alunos por unidade
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Inscrições por modalidade
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Faixa etária e distribuição
                </div>
              </div>

              <button
                onClick={() => generateReport("Alunos")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download size={16} />
                Gerar Relatório
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Relatório de Atividades</h3>
                  <p className="text-sm text-gray-500">Performance e ocupação</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Taxa de ocupação
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Atividades mais populares
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Performance por professor
                </div>
              </div>

              <button
                onClick={() => generateReport("Atividades")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Download size={16} />
                Gerar Relatório
              </button>
            </div>
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
