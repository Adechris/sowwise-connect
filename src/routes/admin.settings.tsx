import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { apiBaseUrl } from "@/services/api";

export const Route = createFileRoute("/admin/settings")({ component: Settings });

function Settings() {
  const [form, setForm] = useState({ companyName: "SowwiseTechnologies365", email: "hello@sowwise365.com", phone: "+234 800 000 0000", apiUrl: apiBaseUrl || "", autoEmail: true });
  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Configure your organisation and integrations.</p>
      <div className="space-y-6">
        <Section title="Company">
          <Input label="Company name" value={form.companyName} onChange={(v)=>setForm({...form, companyName:v})}/>
          <Input label="Support email" value={form.email} onChange={(v)=>setForm({...form, email:v})}/>
          <Input label="Phone" value={form.phone} onChange={(v)=>setForm({...form, phone:v})}/>
        </Section>
        <Section title="API Integration">
          <Input label="Backend API base URL (VITE_API_BASE_URL)" value={form.apiUrl} onChange={(v)=>setForm({...form, apiUrl:v})} placeholder="https://api.your-backend.com"/>
          <p className="text-xs text-muted-foreground">Set this in your environment to connect to a Node.js or PHP backend.</p>
        </Section>
        <Section title="Automation">
          <label className="flex items-center gap-3"><input type="checkbox" checked={form.autoEmail} onChange={(e)=>setForm({...form, autoEmail:e.target.checked})}/><span className="text-sm">Send automated confirmation emails on new registration</span></label>
        </Section>
        <button onClick={()=>toast.success("Settings saved")} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">Save changes</button>
      </div>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3"><h3 className="font-display font-bold">{title}</h3>{children}</div>; }
function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) { return <div><label className="block text-xs font-medium mb-1.5 text-muted-foreground">{label}</label><input value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-primary outline-none"/></div>; }