import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });
const COLORS = ["#1D4ED8", "#60A5FA", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

function Analytics() {
  const { data: regs = [] } = useQuery({ queryKey: ["registrations"], queryFn: () => api.listRegistrations() });
  const byDate = Object.entries(regs.reduce<Record<string, number>>((a, r) => { const d=new Date(r.submittedAt).toLocaleDateString("en", { month:"short", day:"numeric" }); a[d]=(a[d]||0)+1; return a; }, {})).map(([date, count]) => ({ date, count })).reverse();
  const bySource = Object.entries(regs.reduce<Record<string, number>>((a, r) => ((a[r.source]=(a[r.source]||0)+1),a), {})).map(([name,value])=>({name,value}));
  const byState = Object.entries(regs.reduce<Record<string, number>>((a, r) => ((a[r.state]=(a[r.state]||0)+1),a), {})).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,8);
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <h1 className="font-display text-2xl font-bold mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground mb-6">Trends across registrations.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Registrations Over Time"><LineChart data={byDate}><XAxis dataKey="date" fontSize={11} stroke="#94a3b8"/><YAxis fontSize={11} stroke="#94a3b8"/><Tooltip/><Line type="monotone" dataKey="count" stroke="#1D4ED8" strokeWidth={2.5} dot={false}/></LineChart></Panel>
        <Panel title="Top States"><BarChart data={byState}><XAxis dataKey="name" fontSize={11} stroke="#94a3b8"/><YAxis fontSize={11} stroke="#94a3b8"/><Tooltip/><Bar dataKey="value" fill="#10B981" radius={[6,6,0,0]}/></BarChart></Panel>
        <Panel title="Acquisition Source"><PieChart><Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>{bySource.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}</Pie><Tooltip/></PieChart></Panel>
      </div>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactElement }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-card"><h3 className="font-display font-bold mb-4">{title}</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></div>;
}