import type { Course, Registration, EmailMessage, Testimonial } from "@/types";

export const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

export const COURSES: Course[] = [
  { id: "c1", slug: "data-analytics", name: "Data Analytics", category: "Data Analytics", description: "Master Excel, SQL, Power BI and Python for data-driven decision making.", mode: "Hybrid", duration: "10 Weeks", level: "Beginner", startDate: "2026-07-14", fee: 180000, seats: 30, taken: 22, status: "Active", featured: true, icon: "📊" },
  { id: "c2", slug: "web-development", name: "Full-Stack Web Development", category: "Web Dev", description: "Build modern web apps with React, Node.js and PostgreSQL from zero to deployment.", mode: "Online", duration: "12 Weeks", level: "Intermediate", startDate: "2026-07-21", fee: 250000, seats: 40, taken: 18, status: "Active", featured: true, icon: "💻" },
  { id: "c3", slug: "cybersecurity", name: "Cybersecurity Essentials", category: "Cybersecurity", description: "Defensive security, ethical hacking labs and SOC fundamentals.", mode: "In-Person", duration: "8 Weeks", level: "Intermediate", startDate: "2026-08-04", fee: 220000, seats: 25, taken: 25, status: "Full", featured: true, icon: "🛡️" },
  { id: "c4", slug: "ui-ux-design", name: "UI/UX Design", category: "UI/UX", description: "Design thinking, Figma, prototyping and shipping interfaces users love.", mode: "Hybrid", duration: "8 Weeks", level: "Beginner", startDate: "2026-07-28", fee: 160000, seats: 30, taken: 12, status: "Active", featured: true, icon: "🎨" },
  { id: "c5", slug: "mobile-app", name: "Mobile App Development", category: "Mobile App Dev", description: "Cross-platform apps with React Native — from prototype to Play Store.", mode: "Online", duration: "10 Weeks", level: "Intermediate", startDate: "2026-08-11", fee: 240000, seats: 35, taken: 8, status: "Active", featured: false, icon: "📱" },
  { id: "c6", slug: "project-management", name: "Project Management (PMP Prep)", category: "Project Management", description: "Agile, Scrum and PMP-aligned project leadership for tech teams.", mode: "Online", duration: "6 Weeks", level: "Advanced", startDate: "2026-07-07", fee: null, seats: 25, taken: 14, status: "Active", featured: false, icon: "📈" },
];

const FIRSTS=["Ada","Chinedu","Tobi","Aisha","Funke","Emeka","Zainab","Kunle","Ngozi","Bola","Ibrahim","Halima","Seyi","Uche","Yemi","Folake","Tunde","Amaka","Hassan","Bukola"];
const LASTS=["Okafor","Adeyemi","Okonkwo","Bello","Williams","Eze","Mohammed","Ogunleye","Nwosu","Lawal","Yusuf","Adebayo","Onyeka","Ibrahim","Dada"];
const SOURCES=["Social Media","Referral","Google","Others"];
const STATUSES=["Pending","Under Review","Confirmed","Confirmed","Confirmed","Rejected","Waitlisted","Completed"] as const;
const MODES=["Online","In-Person","Hybrid"] as const;
const EXP=["Beginner","Some experience","Professional"];

export const REGISTRATIONS: Registration[] = Array.from({ length: 48 }).map((_, i) => {
  const c = COURSES[i % COURSES.length];
  const f = FIRSTS[(i*3) % FIRSTS.length]; const l = LASTS[(i*7+1) % LASTS.length];
  const d = new Date(); d.setDate(d.getDate() - Math.floor(i * 1.3));
  return { id:`r${i+1}`, ref:`SW-2025-${String(1000+i)}`, fullName:`${f} ${l}`,
    email:`${f.toLowerCase()}.${l.toLowerCase()}@example.com`,
    phone:`+234 80${String(10000000+i*137).slice(0,8)}`, gender:i%2===0?"Female":"Male",
    state:NIGERIAN_STATES[i%NIGERIAN_STATES.length], source:SOURCES[i%SOURCES.length],
    courseId:c.id, courseName:c.name, mode:MODES[i%3], preferredStart:c.startDate,
    experience:EXP[i%EXP.length],
    motivation:i%3===0?"Looking to switch careers into tech and build practical skills.":undefined,
    status:STATUSES[i%STATUSES.length], payment:(["Unpaid","Partial","Paid"] as const)[i%3],
    submittedAt:d.toISOString(), notes:i%5===0?"Strong candidate — follow up by Friday.":undefined };
});

export const EMAILS: EmailMessage[] = REGISTRATIONS.slice(0,14).flatMap((r,i) => [
  { id:`e${i}a`, registrationId:r.id, direction:"outbound" as const,
    subject:`Welcome to ${r.courseName}, ${r.fullName.split(" ")[0]}!`,
    body:`Hi ${r.fullName.split(" ")[0]},\n\nThanks for registering for ${r.courseName}. Your reference is ${r.ref}.\n\n— SowwiseTechnologies365`,
    sentBy:"Admin", sentAt:r.submittedAt, read:true },
  ...(i%2===0?[{ id:`e${i}b`, registrationId:r.id, direction:"inbound" as const,
    subject:`Re: Welcome to ${r.courseName}`, body:"Thank you! When does payment open?",
    sentAt:new Date(Date.now()-i*86400000).toISOString(), read:i%3===0 }]:[]),
]);

export const TESTIMONIALS: Testimonial[] = [
  { name:"Chidinma O.", course:"Data Analytics", rating:5, quote:"The hands-on projects gave me real confidence. I landed an analyst role two months after graduating." },
  { name:"Samuel A.", course:"Full-Stack Web Development", rating:5, quote:"Best decision I made this year. The instructors actually care and the curriculum is industry-grade." },
  { name:"Hauwa M.", course:"UI/UX Design", rating:5, quote:"I went from zero design experience to shipping production interfaces. Highly recommend Sowwise365." },
];

export const FAQS = [
  { q:"How will I receive my confirmation?", a:"Immediately after submitting, you'll get a confirmation email with your reference number. Our team follows up within 24 hours." },
  { q:"Can I pay in installments?", a:"Yes. We support flexible 2- and 3-part payment plans for most programmes." },
  { q:"Is there a certificate at the end?", a:"Yes. Every completed programme awards a SowwiseTechnologies365 certificate." },
  { q:"Can I switch courses after registering?", a:"Absolutely. Reach out up to 7 days before your cohort starts and we'll switch you at no cost." },
  { q:"What do I need to participate online?", a:"A laptop, stable internet (4 Mbps+), and a working webcam. We provide all software." },
  { q:"How do I contact support?", a:"Email support@sowwise365.com or message us on WhatsApp — we reply within business hours." },
];
