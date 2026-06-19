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
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const ok = api.isAuthed();
    setAuthed(ok);
    setChecked(true);
    if (!ok) navigate({ to: "/admin-login" });
  }, [navigate]);
  if (!checked || !authed) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary/30 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  );
}