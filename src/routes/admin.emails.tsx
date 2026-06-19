import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MailOpen, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin/emails")({ component: Emails });

function Emails() {
  const { data: emails = [] } = useQuery({ queryKey: ["emails"], queryFn: () => api.listEmails() });
  const inbound = emails.filter((e) => e.direction === "inbound").length;
  const outbound = emails.filter((e) => e.direction === "outbound").length;
  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="font-display text-2xl font-bold mb-1">Email Centre</h1>
      <p className="text-sm text-muted-foreground mb-6">All conversations with registrants in one place.</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card icon={Mail} label="Total" value={emails.length}/>
        <Card icon={ArrowUpRight} label="Sent" value={outbound}/>
        <Card icon={ArrowDownLeft} label="Received" value={inbound}/>
      </div>
      <div className="rounded-xl border border-border bg-card divide-y divide-border shadow-card">
        {emails.map((e) => (
          <div key={e.id} className="p-4 flex gap-4">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${e.direction==="outbound"?"bg-primary-tint text-primary":"bg-amber-50 text-amber-600"}`}>{e.read?<MailOpen className="h-4 w-4"/>:<Mail className="h-4 w-4"/>}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3"><div className="font-semibold text-sm truncate">{e.subject}</div><div className="text-xs text-muted-foreground shrink-0">{new Date(e.sentAt).toLocaleDateString()}</div></div>
              <p className="text-xs text-muted-foreground mt-0.5">{e.direction==="outbound"?`Sent by ${e.sentBy ?? "Admin"}`:"From registrant"}</p>
              <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{e.body}</p>
            </div>
          </div>
        ))}
        {emails.length===0 && <div className="p-10 text-center text-muted-foreground">No emails yet.</div>}
      </div>
    </div>
  );
}
function Card({ icon: Icon, label, value }: { icon: any; label: string; value: number }) { return <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-tint text-primary"><Icon className="h-4 w-4"/></div><div><div className="text-xs text-muted-foreground">{label}</div><div className="font-display text-xl font-bold">{value}</div></div></div>; }