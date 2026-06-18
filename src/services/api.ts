import { COURSES, REGISTRATIONS, EMAILS } from "@/mock/data";
import type { Course, EmailMessage, Registration, Status } from "@/types";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
export const apiBaseUrl = API_BASE;
const K = { regs:"sw_registrations", emails:"sw_emails", courses:"sw_courses", token:"sw_admin_token" };

function read<T>(k:string, fb:T):T { if (typeof window==="undefined") return fb; try { const r=localStorage.getItem(k); return r?JSON.parse(r) as T:fb; } catch { return fb; } }
function write<T>(k:string, v:T) { if (typeof window!=="undefined") localStorage.setItem(k, JSON.stringify(v)); }
function seed() { if (typeof window==="undefined") return; if (!localStorage.getItem(K.regs)) write(K.regs, REGISTRATIONS); if (!localStorage.getItem(K.emails)) write(K.emails, EMAILS); if (!localStorage.getItem(K.courses)) write(K.courses, COURSES); }
const delay = (ms=250) => new Promise((r)=>setTimeout(r, ms));

export const api = {
  async listCourses(): Promise<Course[]> { seed(); await delay(); return read<Course[]>(K.courses, COURSES); },
  async saveCourse(c: Course) { seed(); await delay(); const l=read<Course[]>(K.courses, COURSES); const i=l.findIndex(x=>x.id===c.id); if(i>=0)l[i]=c; else l.unshift(c); write(K.courses,l); return c; },
  async deleteCourse(id: string) { seed(); await delay(); write(K.courses, read<Course[]>(K.courses, COURSES).filter(c=>c.id!==id)); },
  async listRegistrations(): Promise<Registration[]> { seed(); await delay(); return read<Registration[]>(K.regs, REGISTRATIONS); },
  async getRegistration(id: string) { seed(); await delay(150); return read<Registration[]>(K.regs, REGISTRATIONS).find(r=>r.id===id); },
  async createRegistration(p: Omit<Registration,"id"|"ref"|"submittedAt"|"status"|"payment">) {
    seed(); await delay(500); const list=read<Registration[]>(K.regs, REGISTRATIONS);
    const r: Registration = { ...p, id:`r${Date.now()}`, ref:`SW-2025-${String(1000+list.length+1)}`, status:"Pending", payment:"Unpaid", submittedAt:new Date().toISOString() };
    write(K.regs, [r, ...list]); return r;
  },
  async updateRegistrationStatus(id: string, status: Status) { seed(); await delay(); const l=read<Registration[]>(K.regs, REGISTRATIONS); const i=l.findIndex(r=>r.id===id); if(i>=0){l[i]={...l[i],status};write(K.regs,l);} return l[i]; },
  async updateRegistration(id: string, patch: Partial<Registration>) { seed(); await delay(); const l=read<Registration[]>(K.regs, REGISTRATIONS); const i=l.findIndex(r=>r.id===id); if(i>=0){l[i]={...l[i],...patch};write(K.regs,l);} return l[i]; },
  async listEmails(): Promise<EmailMessage[]> { seed(); await delay(); return read<EmailMessage[]>(K.emails, EMAILS); },
  async sendEmail(m: { registrationId: string; subject: string; body: string; sentBy?: string }) {
    seed(); await delay(400); const list=read<EmailMessage[]>(K.emails, EMAILS);
    const created: EmailMessage = { id:`e${Date.now()}`, direction:"outbound", sentAt:new Date().toISOString(), ...m };
    write(K.emails, [created, ...list]); return created;
  },
  async login(email: string, password: string) { await delay(500); if(!email||!password) throw new Error("Invalid credentials"); const t=btoa(`${email}:${Date.now()}`); if (typeof window!=="undefined") localStorage.setItem(K.token, t); return { token:t, user:{email, name:"Admin"} }; },
  logout() { if (typeof window!=="undefined") localStorage.removeItem(K.token); },
  isAuthed() { return typeof window!=="undefined" && !!localStorage.getItem(K.token); },
};
