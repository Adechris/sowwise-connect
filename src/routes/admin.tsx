import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Sowwise365" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!api.isAuthed()) {
      navigate({ to: "/admin-login" });
    } else {
      setReady(true);
    }
  }, [navigate]);
  if (typeof window === "undefined") return null;
  if (!ready) return null;
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  );
}