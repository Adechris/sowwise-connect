import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle2, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { api } from "@/services/api";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const COLORS = ["#1D4ED8", "#60A5FA", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

function Dashboard() {
  const { data: regs = [] } = useQuery({ queryKey: ["registrations"], queryFn: () => api.listRegistrations() });
  const total = regs.length;
  const confirmed = regs.filter((r) => r.status === "Confirmed").length;
  const pending = regs.filter((r) => r.status === "Pending" || r.status === "Under Review").length;
  const revenue = regs.filter((r) => r.payment === "Paid").length * 200000;
  const byCourse = Object.entries(regs.reduce<Record<string, number>>((a, r) => ((a[r.courseName] = (a[r.courseName] || 0) + 1), a), {})).map(([name, value]) => ({ name: name.slice(0, 14), value }));
  const byMode = Object.entries(regs.reduce<Record<string, number>>((a, r) => ((a[r.mode] = (a[r.mode] || 0) + 1), a), {})).map(([name, value]) => ({ name, value }));
  const recent = [...regs].sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt)).slice(0, 6);
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold">Dashboard</h1><p className="text-sm text-muted-foreground">Welcome back, here's what's happening today.</p></div>
        <Link to="/admin/registrations" className="text-sm font-semibold text-primary inline-flex items-center gap-1">View all <ArrowUpRight className="h-4 w-4"/></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Registrations" value={total} icon={Users} accent="primary"/>
        <StatCard label="Confirmed" value={confirmed} icon={CheckCircle2} accent="green"/>
        <StatCard label="Pending Review" value={pending} icon={Clock} accent="amber"/>
        <StatCard label="Est. Revenue" value={`₦${(revenue/1000).toFixed(0)}k`} icon={DollarSign} accent="primary"/>
      </div>
      <div className="grid gap-4 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-bold mb-4">Registrations by Course</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={byCourse}><XAxis dataKey="name" fontSize={11} stroke="#94a3b8"/><YAxis fontSize={11} stroke="#94a3b8"/><Tooltip/><Bar dataKey="value" fill="#1D4ED8" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-bold mb-4">Delivery Mode</h3>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byMode} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>{byMode.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between"><h3 className="font-display font-bold">Recent Registrations</h3><Link to="/admin/registrations" className="text-xs font-semibold text-primary">View all</Link></div>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="text-left px-5 py-3">Ref</th><th className="text-left px-5 py-3">Name</th><th className="text-left px-5 py-3">Course</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Date</th></tr></thead>
          <tbody>{recent.map((r) => (<tr key={r.id} className="border-t border-border"><td className="px-5 py-3 font-mono text-xs">{r.ref}</td><td className="px-5 py-3 font-medium">{r.fullName}</td><td className="px-5 py-3 text-muted-foreground">{r.courseName}</td><td className="px-5 py-3"><StatusBadge status={r.status}/></td><td className="px-5 py-3 text-muted-foreground">{new Date(r.submittedAt).toLocaleDateString()}</td></tr>))}</tbody>
        </table></div>
      </div>
    </div>
  );
}