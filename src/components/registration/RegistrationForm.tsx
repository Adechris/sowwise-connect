import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import { NIGERIAN_STATES } from "@/mock/data";
import type { Course, Registration } from "@/types";

const SOURCES = ["Social Media","Referral","Google","Others"];
const EXP = ["Beginner","Some experience","Professional"];
const MODES = ["Online","In-Person","Hybrid"] as const;

type FormState = { fullName:string; email:string; phone:string; gender:string; dob:string; state:string; source:string; courseId:string; mode:"Online"|"In-Person"|"Hybrid"; preferredStart:string; experience:string; motivation:string; questions:string; terms:boolean; privacy:boolean; };
const empty: FormState = { fullName:"", email:"", phone:"", gender:"", dob:"", state:"", source:"", courseId:"", mode:"Online", preferredStart:"", experience:"", motivation:"", questions:"", terms:false, privacy:false };

export function RegistrationForm({ courses, preselectCourseId }: { courses: Course[]; preselectCourseId?: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ ...empty, courseId: preselectCourseId ?? "" });
  const [success, setSuccess] = useState<Registration | null>(null);
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const course = courses.find((c)=>c.id===form.courseId)!;
      return api.createRegistration({ fullName:form.fullName, email:form.email, phone:form.phone, gender:form.gender||undefined, dob:form.dob||undefined, state:form.state, source:form.source, courseId:course.id, courseName:course.name, mode:form.mode, preferredStart:form.preferredStart||course.startDate, experience:form.experience, motivation:form.motivation||undefined, questions:form.questions||undefined });
    },
    onSuccess: (r) => { setSuccess(r); qc.invalidateQueries({ queryKey:["registrations"] }); toast.success("Registration submitted! Confirmation email sent."); },
    onError: (e: Error) => toast.error(e.message ?? "Could not submit"),
  });
  const update = <K extends keyof FormState>(k:K, v:FormState[K]) => setForm((f)=>({ ...f, [k]:v }));
  function next() {
    if (step===1 && (!form.fullName || !form.email || !form.phone || !form.state || !form.source)) return toast.error("Please fill in the required fields");
    if (step===2 && (!form.courseId || !form.experience)) return toast.error("Pick a course and experience level");
    setStep((s)=>Math.min(3, s+1));
  }
  function submit() {
    if (!form.terms || !form.privacy) return toast.error("Please accept the terms");
    mutation.mutate();
  }
  if (success) return <SuccessScreen reg={success} onAnother={()=>{ setSuccess(null); setForm({...empty}); setStep(1); }} />;
  const course = courses.find((c)=>c.id===form.courseId);
  return (
    <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
      <div className="px-6 sm:px-8 pt-7">
        <div className="flex items-center gap-2 mb-6">
          {[1,2,3].map((s)=>(
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${step>=s?"bg-primary text-primary-foreground":"bg-secondary text-muted-foreground"}`}>{step>s?<Check className="h-4 w-4"/>:s}</div>
              {s<3 && <div className={`h-1 flex-1 rounded ${step>s?"bg-primary":"bg-secondary"}`}/>}
            </div>
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Step {step} of 3</p>
        <h3 className="font-display text-2xl font-bold mt-1">{step===1?"Personal Information":step===2?"Course Selection":"Review & Submit"}</h3>
      </div>
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.2 }}>
            {step===1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *"><input className={inp} value={form.fullName} onChange={(e)=>update("fullName",e.target.value)}/></Field>
                <Field label="Email *"><input type="email" className={inp} value={form.email} onChange={(e)=>update("email",e.target.value)}/></Field>
                <Field label="Phone *"><input className={inp} value={form.phone} onChange={(e)=>update("phone",e.target.value)} placeholder="+234..."/></Field>
                <Field label="Gender"><select className={inp} value={form.gender} onChange={(e)=>update("gender",e.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
                <Field label="Date of birth"><input type="date" className={inp} value={form.dob} onChange={(e)=>update("dob",e.target.value)}/></Field>
                <Field label="State of residence *"><select className={inp} value={form.state} onChange={(e)=>update("state",e.target.value)}><option value="">Select state…</option>{NIGERIAN_STATES.map((s)=><option key={s}>{s}</option>)}</select></Field>
                <Field label="How did you hear about us? *" full><select className={inp} value={form.source} onChange={(e)=>update("source",e.target.value)}><option value="">Select…</option>{SOURCES.map((s)=><option key={s}>{s}</option>)}</select></Field>
              </div>
            )}
            {step===2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Course *" full><select className={inp} value={form.courseId} onChange={(e)=>update("courseId",e.target.value)}><option value="">Choose a programme…</option>{courses.map((c)=><option key={c.id} value={c.id}>{c.name} — {c.duration}</option>)}</select></Field>
                <Field label="Preferred mode"><select className={inp} value={form.mode} onChange={(e)=>update("mode",e.target.value as any)}>{MODES.map((m)=><option key={m}>{m}</option>)}</select></Field>
                <Field label="Preferred start date"><input type="date" className={inp} value={form.preferredStart} onChange={(e)=>update("preferredStart",e.target.value)}/></Field>
                <Field label="Experience level *" full>
                  <div className="flex flex-wrap gap-2">{EXP.map((x)=>(<button type="button" key={x} onClick={()=>update("experience",x)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${form.experience===x?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:border-primary"}`}>{x}</button>))}</div>
                </Field>
                <Field label="Motivation / goals" full><textarea rows={3} className={inp} value={form.motivation} onChange={(e)=>update("motivation",e.target.value)} placeholder="Tell us what you hope to achieve…"/></Field>
                <Field label="Any questions?" full><textarea rows={2} className={inp} value={form.questions} onChange={(e)=>update("questions",e.target.value)}/></Field>
              </div>
            )}
            {step===3 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-secondary/60 p-5 space-y-3">
                  <Row k="Full name" v={form.fullName}/>
                  <Row k="Email" v={form.email}/>
                  <Row k="Phone" v={form.phone}/>
                  <Row k="State" v={form.state}/>
                  <Row k="Course" v={course?.name ?? "—"}/>
                  <Row k="Mode" v={form.mode}/>
                  <Row k="Preferred start" v={form.preferredStart || course?.startDate || "—"}/>
                  <Row k="Experience" v={form.experience}/>
                  {form.motivation && <Row k="Motivation" v={form.motivation}/>}
                </div>
                <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={form.terms} onChange={(e)=>update("terms",e.target.checked)}/><span>I agree to the <a className="text-primary underline">Terms & Conditions</a></span></label>
                <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={form.privacy} onChange={(e)=>update("privacy",e.target.checked)}/><span>I have read the <a className="text-primary underline">Privacy Policy</a></span></label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-8">
          <button onClick={()=>setStep((s)=>Math.max(1,s-1))} disabled={step===1} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"><ArrowLeft className="h-4 w-4"/> Back</button>
          {step<3 ? (
            <button onClick={next} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card hover:bg-primary-dark">Continue <ArrowRight className="h-4 w-4"/></button>
          ) : (
            <button onClick={submit} disabled={mutation.isPending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated hover:bg-primary-dark disabled:opacity-60">{mutation.isPending && <Loader2 className="h-4 w-4 animate-spin"/>}Submit Registration</button>
          )}
        </div>
      </div>
    </div>
  );
}
const inp = "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) { return (<div className={full?"sm:col-span-2":""}><label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>{children}</div>); }
function Row({ k, v }: { k: string; v: string }) { return <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v || "—"}</span></div>; }
function SuccessScreen({ reg, onAnother }: { reg: Registration; onAnother: () => void }) {
  const first = reg.fullName.split(" ")[0];
  const wa = `https://wa.me/?text=${encodeURIComponent(`I just registered for ${reg.courseName} at SowwiseTechnologies365! 🚀`)}`;
  return (
    <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} className="rounded-2xl border border-border bg-card p-10 text-center shadow-elevated">
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:200}} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600"><Check className="h-10 w-10" strokeWidth={3}/></motion.div>
      <h3 className="font-display text-3xl font-bold mt-6">Registration Successful! 🎉</h3>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Thank you {first}! Your registration for <span className="font-medium text-foreground">{reg.courseName}</span> has been received. A confirmation email has been sent to <span className="font-medium text-foreground">{reg.email}</span>. Our team will contact you within 24 hours.</p>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-tint px-4 py-1.5 text-sm font-mono font-medium text-primary">Your ref: {reg.ref}</div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={wa} target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Share on WhatsApp</a>
        <button onClick={onAnother} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">Register Another</button>
        <a href="/" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">Back to Home</a>
      </div>
    </motion.div>
  );
}
