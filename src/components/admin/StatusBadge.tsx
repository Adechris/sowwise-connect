const styles: Record<string, string> = {
  Pending:"bg-amber-50 text-amber-700 ring-amber-200",
  "Under Review":"bg-blue-50 text-blue-700 ring-blue-200",
  Confirmed:"bg-green-50 text-green-700 ring-green-200",
  Rejected:"bg-red-50 text-red-700 ring-red-200",
  Waitlisted:"bg-slate-100 text-slate-700 ring-slate-200",
  Completed:"bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paid:"bg-green-50 text-green-700 ring-green-200",
  Partial:"bg-amber-50 text-amber-700 ring-amber-200",
  Unpaid:"bg-red-50 text-red-700 ring-red-200",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status] ?? "bg-secondary text-foreground ring-border"}`}>{status}</span>;
}
