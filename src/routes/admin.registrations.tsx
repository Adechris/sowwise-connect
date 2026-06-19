import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Search, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Registration, Status } from "@/types";

export const Route = createFileRoute("/admin/registrations")({ component: Registrations });

const STATUSES: Status[] = ["Pending", "Under Review", "Confirmed", "Rejected", "Waitlisted", "Completed"];

function Registrations() {
  const qc = useQueryClient();
  const { data: regs = [] } = useQuery({ queryKey: ["registrations"], queryFn: () => api.listRegistrations() });
  const [q, setQ] = useState(""); const [status, setStatus] = useState<string>(""); const [selected, setSelected] = useState<Registration | null>(null);
  const filtered = useMemo(() => regs.filter((r) => (!status || r.status === status) && (!q || `${r.fullName} ${r.email} ${r.ref} ${r.courseName}`.toLowerCase().includes(q.toLowerCase()))), [regs, q, status]);
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Registration> }) => api.updateRegistration(id, patch),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ["registrations"] }); if (r) setSelected(r); toast.success("Updated"); },
  });
  function exportCsv() {
    const headers = ["Ref","Name","Email","Phone","Course","Mode","Status","Payment","State","Date"];
    const rows = filtered.map((r) => [r.ref, r.fullName, r.email, r.phone, r.courseName, r.mode, r.status, r.payment, r.state, new Date(r.submittedAt).toISOString()]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "registrations.csv"; a.click();
  }
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div><h1 className="font-display text-2xl font-bold">Registrations</h1><p className="text-sm text-muted-foreground">{filtered.length} of {regs.length} records</p></div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"><Download className="h-4 w-4"/> Export CSV</button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[240px]"><Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground"/><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name, email, ref…" className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-none"/></div>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm"><option value="">All statuses</option>{STATUSES.map((s)=><option key={s}>{s}</option>)}</select>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="text-left px-5 py-3">Ref</th><th className="text-left px-5 py-3">Name</th><th className="text-left px-5 py-3">Course</th><th className="text-left px-5 py-3">Mode</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Payment</th><th className="text-left px-5 py-3">Date</th></tr></thead>
          <tbody>{filtered.map((r)=>(<tr key={r.id} onClick={()=>setSelected(r)} className="border-t border-border cursor-pointer hover:bg-secondary/40"><td className="px-5 py-3 font-mono text-xs">{r.ref}</td><td className="px-5 py-3 font-medium">{r.fullName}<div className="text-xs text-muted-foreground">{r.email}</div></td><td className="px-5 py-3">{r.courseName}</td><td className="px-5 py-3 text-muted-foreground">{r.mode}</td><td className="px-5 py-3"><StatusBadge status={r.status}/></td><td className="px-5 py-3"><StatusBadge status={r.payment}/></td><td className="px-5 py-3 text-muted-foreground">{new Date(r.submittedAt).toLocaleDateString()}</td></tr>))}
          {filtered.length===0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No registrations match.</td></tr>}</tbody>
        </table></div>
      </div>
      {selected && <DetailDrawer reg={selected} onClose={()=>setSelected(null)} onUpdate={(patch)=>update.mutate({id:selected.id, patch})}/>}
    </div>
  );
}

function DetailDrawer({ reg, onClose, onUpdate }: { reg: Registration; onClose: () => void; onUpdate: (p: Partial<Registration>) => void }) {
  const [notes, setNotes] = useState(reg.notes ?? "");
  const [emailBody, setEmailBody] = useState("");
  const qc = useQueryClient();
  const send = useMutation({
    mutationFn: () => api.sendEmail({ registrationId: reg.id, subject: `Update on your ${reg.courseName} registration`, body: emailBody, sentBy: "Admin" }),
    onSuccess: () => { setEmailBody(""); qc.invalidateQueries({ queryKey: ["emails"] }); toast.success("Email sent"); },
  });
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose}/>
      <div className="w-full max-w-xl bg-card overflow-y-auto border-l border-border">
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between"><div><h3 className="font-display text-lg font-bold">{reg.fullName}</h3><p className="text-xs font-mono text-muted-foreground">{reg.ref}</p></div><button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg"><X className="h-4 w-4"/></button></div>
        <div className="p-5 space-y-5">
          <Section title="Contact"><Field k="Email" v={reg.email}/><Field k="Phone" v={reg.phone}/><Field k="State" v={reg.state}/><Field k="Source" v={reg.source}/></Section>
          <Section title="Programme"><Field k="Course" v={reg.courseName}/><Field k="Mode" v={reg.mode}/><Field k="Experience" v={reg.experience}/><Field k="Preferred start" v={reg.preferredStart}/></Section>
          <div><label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</label>
            <div className="mt-2 flex flex-wrap gap-2">{STATUSES.map((s)=>(<button key={s} onClick={()=>onUpdate({status:s})} className={`px-3 py-1.5 text-xs rounded-full border ${reg.status===s?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-secondary"}`}>{s}</button>))}</div>
          </div>
          <div><label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment</label>
            <div className="mt-2 flex gap-2">{(["Unpaid","Partial","Paid"] as const).map((p)=>(<button key={p} onClick={()=>onUpdate({payment:p})} className={`px-3 py-1.5 text-xs rounded-full border ${reg.payment===p?"bg-primary text-primary-foreground border-primary":"border-border hover:bg-secondary"}`}>{p}</button>))}</div>
          </div>
          <div><label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Internal notes</label>
            <textarea rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})} className="mt-2 w-full rounded-lg border border-border bg-card p-3 text-sm"/></div>
          <div><label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Send Email</label>
            <textarea rows={4} value={emailBody} onChange={(e)=>setEmailBody(e.target.value)} placeholder="Write a message…" className="mt-2 w-full rounded-lg border border-border bg-card p-3 text-sm"/>
            <button disabled={!emailBody || send.isPending} onClick={()=>send.mutate()} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div><h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{title}</h4><div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-2">{children}</div></div>; }
function Field({ k, v }: { k: string; v?: string }) { return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v || "—"}</span></div>; }