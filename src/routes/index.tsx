import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, BookOpenCheck, GraduationCap, Sparkles, Star, Users } from "lucide-react";
import { api } from "@/services/api";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { TESTIMONIALS, FAQS } from "@/mock/data";
import type { Course } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SowwiseTechnologies365 — Tech Training that Launches Careers" },
      { name: "description", content: "Register for industry-led training in Data Analytics, Web Development, Cybersecurity, UI/UX and more." },
      { property: "og:title", content: "SowwiseTechnologies365 — Tech Training" },
      { property: "og:description", content: "Practical, instructor-led tech training programmes across Africa." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data: courses = [] } = useQuery({ queryKey: ["courses"], queryFn: () => api.listCourses() });
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <Hero />
      <Stats />
      <Courses courses={courses} />
      <Register courses={courses} />
      <Why />
      <Testimonials />
      <FAQ />
      <PublicFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5"/> 2026 Cohort Open</span>
          <h1 className="mt-5 font-display text-4xl sm:text-6xl font-extrabold leading-tight text-foreground">Launch your <span className="text-primary">tech career</span> with hands-on training.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">Join thousands of learners across Africa mastering Data, Web, Security and Design — taught by industry experts, built for real jobs.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:bg-primary-dark transition">Register Now <ArrowRight className="h-4 w-4"/></a>
            <a href="#courses" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary transition">Browse Courses</a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary"/> Certified programmes</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary"/> 5,000+ alumni</div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl gradient-hero p-8 shadow-elevated text-primary-foreground">
            <GraduationCap className="h-10 w-10"/>
            <h3 className="font-display text-2xl font-bold mt-4">Industry-led curriculum</h3>
            <p className="mt-2 text-primary-tint/90 text-sm">Live projects, mentor support and career coaching from day one.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["96% Pass","24/7 Support","Job Ready"].map((t)=>(<div key={t} className="rounded-lg bg-white/10 backdrop-blur p-3 text-center text-xs font-semibold">{t}</div>))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [{ k:"5,000+", v:"Graduates" },{ k:"40+", v:"Industry Mentors" },{ k:"96%", v:"Completion Rate" },{ k:"12+", v:"Programmes" }];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i)=>(<div key={i.v} className="text-center"><div className="font-display text-3xl font-bold text-primary">{i.k}</div><div className="text-sm text-muted-foreground mt-1">{i.v}</div></div>))}
      </div>
    </section>
  );
}

function Courses({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Programmes</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Choose your path</h2>
        <p className="mt-3 text-muted-foreground">Beginner to advanced — pick the programme that fits your goals.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c)=>(
          <div key={c.id} className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition">
            <div className="text-4xl">{c.icon}</div>
            <div className="mt-4 flex items-center gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-tint text-primary">{c.category}</span><span className="text-xs text-muted-foreground">{c.level}</span></div>
            <h3 className="font-display text-xl font-bold mt-3">{c.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{c.duration} • {c.mode}</span>
              <span className="font-semibold text-foreground">{c.fee ? `₦${c.fee.toLocaleString()}` : "Free"}</span>
            </div>
            <a href={`#register`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">Register <ArrowRight className="h-4 w-4"/></a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Register({ courses }: { courses: Course[] }) {
  return (
    <section id="register" className="bg-secondary/60 border-y border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Apply</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Register in 3 simple steps</h2>
          <p className="mt-3 text-muted-foreground">Takes less than 2 minutes. Confirmation arrives instantly.</p>
        </div>
        <RegistrationForm courses={courses} />
      </div>
    </section>
  );
}

function Why() {
  const items=[{i:BookOpenCheck,t:"Project-Based",d:"Build a real portfolio while you learn."},{i:Users,t:"Mentor Access",d:"1-on-1 guidance from working professionals."},{i:BadgeCheck,t:"Certified",d:"Industry-recognised certificate on completion."}];
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center max-w-2xl mx-auto"><span className="text-xs font-semibold uppercase tracking-wider text-primary">Why Sowwise365</span><h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Built for outcomes, not certificates alone</h2></div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map(({i:Icon,t,d})=>(<div key={t} className="rounded-2xl border border-border bg-card p-6"><div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-tint text-primary"><Icon className="h-6 w-6"/></div><h3 className="font-display text-lg font-bold mt-4">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-secondary/60 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center"><span className="text-xs font-semibold uppercase tracking-wider text-primary">Voices</span><h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Loved by our graduates</h2></div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t)=>(<div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card"><div className="flex">{Array.from({length:t.rating}).map((_,i)=>(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400"/>))}</div><p className="mt-3 text-sm">{t.quote}</p><div className="mt-4 text-sm font-semibold">{t.name}<span className="text-muted-foreground font-normal"> — {t.course}</span></div></div>))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
      <div className="text-center mb-10"><span className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</span><h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">Frequently asked</h2></div>
      <div className="space-y-3">
        {FAQS.map((f)=>(<details key={f.q} className="group rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-semibold list-none flex items-center justify-between">{f.q}<span className="text-primary group-open:rotate-45 transition">+</span></summary><p className="mt-3 text-sm text-muted-foreground">{f.a}</p></details>))}
      </div>
    </section>
  );
}