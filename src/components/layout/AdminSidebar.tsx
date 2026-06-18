import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { BarChart3, BookOpen, LayoutDashboard, LogOut, Mail, Settings, Users } from "lucide-react";
import { api } from "@/services/api";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/registrations", label: "Registrations", icon: Users },
  { to: "/admin/emails", label: "Email Centre", icon: Mail },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
        <span className="grid h-9 w-9 place-items-center rounded-lg gradient-hero text-primary-foreground font-bold">S</span>
        <span className="font-display font-bold">Sowwise<span className="text-primary">365</span></span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary-tint text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => { api.logout(); navigate({ to: "/admin-login" }); }}
        className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-destructive">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}
