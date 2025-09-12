"use client"

import type React from "react"

import { SidebarProvider } from "@/contexts/sidebar-context"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarProvider>{children}</SidebarProvider>
}
