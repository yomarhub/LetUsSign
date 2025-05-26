"use client"

import type React from "react"

import { RouteGuard } from "@/components/route-guard"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RouteGuard allowedRoles={["student"]}>{children}</RouteGuard>
}
