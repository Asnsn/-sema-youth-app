"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AttendanceRecord {
  status: string
  date: string
}

interface AdminStatsChartProps {
  attendanceData: AttendanceRecord[]
}

export function AdminStatsChart({ attendanceData }: AdminStatsChartProps) {
  // Process data for charts
  const statusCounts = attendanceData.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name:
      status === "present"
        ? "Presente"
        : status === "absent"
          ? "Ausente"
          : status === "late"
            ? "Atrasado"
            : "Justificado",
    value: count,
    status,
  }))

  // Group by date for trend chart
  const dailyData = attendanceData.reduce(
    (acc, record) => {
      const date = record.date
      if (!acc[date]) {
        acc[date] = { date, present: 0, absent: 0, late: 0, excused: 0 }
      }
      acc[date][record.status as keyof (typeof acc)[typeof date]]++
      return acc
    },
    {} as Record<string, { date: string; present: number; absent: number; late: number; excused: number }>,
  )

  const trendData = Object.values(dailyData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7) // Last 7 days
    .map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    }))

  const COLORS = {
    present: "#16a34a",
    absent: "#dc2626",
    late: "#ea580c",
    excused: "#2563eb",
  }

  const pieColors = ["#16a34a", "#dc2626", "#ea580c", "#2563eb"]

  return (
    <div className="space-y-6">
      {/* Attendance Status Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Distribuição de Status de Presença</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Attendance Trend */}
      {trendData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Tendência de Presença (Últimos 7 dias)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill={COLORS.present} name="Presente" />
                <Bar dataKey="late" stackId="a" fill={COLORS.late} name="Atrasado" />
                <Bar dataKey="absent" stackId="a" fill={COLORS.absent} name="Ausente" />
                <Bar dataKey="excused" stackId="a" fill={COLORS.excused} name="Justificado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
