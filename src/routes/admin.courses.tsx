import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin/courses")({ component: CoursesAdmin });

function CoursesAdmin() {
  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: () => api.listCourses() });
  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold mb-1">Courses</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your programme catalogue.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const pct = Math.round((c.taken / c.seats) * 100);
          return (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between"><span className="text-3xl">{c.icon}</span><span className={`text-xs px-2 py-0.5 rounded-full ${c.status==="Active"?"bg-green-50 text-green-700":c.status==="Full"?"bg-red-50 text-red-700":"bg-secondary text-muted-foreground"}`}>{c.status}</span></div>
              <h3 className="font-display text-lg font-bold mt-3">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.duration} • {c.mode} • {c.level}</p>
              <div className="mt-4"><div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Enrolment</span><span>{c.taken}/{c.seats}</span></div><div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary" style={{ width: `${pct}%` }}/></div></div>
              <div className="mt-4 flex items-center justify-between text-sm"><span className="text-muted-foreground">Starts {new Date(c.startDate).toLocaleDateString()}</span><span className="font-semibold">{c.fee ? `₦${c.fee.toLocaleString()}` : "Free"}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}