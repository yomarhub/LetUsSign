"use client"

import type React from "react"

import { RouteGuard } from "@/components/route-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RouteGuard allowedRoles={["admin"]}>{children}</RouteGuard>
}
