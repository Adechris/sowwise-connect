import type { LucideIcon } from "lucide-react";
export function StatCard({ label, value, icon: Icon, accent = "primary", hint }: { label: string; value: string | number; icon: LucideIcon; accent?: "primary" | "amber" | "green" | "red"; hint?: string; }) {
  const accents: Record<string, string> = { primary:"bg-primary-tint text-primary", amber:"bg-amber-50 text-amber-600", green:"bg-green-50 text-green-600", red:"bg-red-50 text-red-600" };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-display font-bold text-foreground">{value}</p>{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${accents[accent]}`}><Icon className="h-5 w-5"/></div>
      </div>
    </div>
  );
}
