"use client"

import type React from "react"

import { RouteGuard } from "@/components/route-guard"

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RouteGuard allowedRoles={["professor"]}>{children}</RouteGuard>
}
