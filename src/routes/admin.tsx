import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Sowwise365" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !api.isAuthed()) {
      throw redirect({ to: "/admin-login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  );
}