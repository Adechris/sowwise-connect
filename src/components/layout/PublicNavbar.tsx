import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-hero text-primary-foreground font-bold">S</span>
          <span>Sowwise<span className="text-primary">365</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#courses" className="text-sm font-medium text-muted-foreground hover:text-foreground">Courses</a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">About</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">FAQ</a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to={"/admin-login" as any} className="text-sm font-medium text-muted-foreground hover:text-primary">Admin Login</Link>
          <a href="#register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary-dark transition">Register</a>
        </div>
        <button onClick={()=>setOpen(!open)} className="md:hidden p-2" aria-label="Menu">{open?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}</button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col p-4 gap-3">
            <a href="#courses" onClick={()=>setOpen(false)} className="text-sm font-medium">Courses</a>
            <a href="#about" onClick={()=>setOpen(false)} className="text-sm font-medium">About</a>
            <a href="#faq" onClick={()=>setOpen(false)} className="text-sm font-medium">FAQ</a>
            <Link to={"/admin-login" as any} className="text-sm font-medium text-primary">Admin Login</Link>
            <a href="#register" onClick={()=>setOpen(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground text-center">Register</a>
          </div>
        </div>
      )}
    </header>
  );
}
