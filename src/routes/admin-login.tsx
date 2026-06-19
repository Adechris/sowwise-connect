import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — Sowwise365" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@sowwise365.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try { await api.login(email, password); toast.success("Welcome back, Admin"); navigate({ to: "/admin" }); }
    catch (err: any) { toast.error(err.message ?? "Login failed"); }
    finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen grid place-items-center bg-secondary/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="grid h-12 w-12 place-items-center rounded-xl gradient-hero text-primary-foreground"><Lock className="h-5 w-5"/></div>
        <h1 className="font-display text-2xl font-bold mt-5">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground mt-1">Access the SowwiseTechnologies365 dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label><input className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required/></div>
          <div><label className="block text-xs font-medium mb-1.5 text-muted-foreground">Password</label><input className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required/></div>
          <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin"/>}Sign In</button>
        </form>
        <p className="mt-5 text-xs text-muted-foreground text-center">Demo credentials are prefilled.</p>
      </div>
    </div>
  );
}