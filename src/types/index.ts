export type Mode = "Online" | "In-Person" | "Hybrid";
export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Status = "Pending" | "Under Review" | "Confirmed" | "Rejected" | "Waitlisted" | "Completed";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid";

export interface Course {
  id: string; slug: string; name: string; category: string; description: string;
  mode: Mode; duration: string; level: Level; startDate: string;
  fee: number | null; seats: number; taken: number;
  status: "Active" | "Draft" | "Full" | "Completed"; featured: boolean; icon: string;
}
export interface Registration {
  id: string; ref: string; fullName: string; email: string; phone: string;
  gender?: string; dob?: string; state: string; source: string;
  courseId: string; courseName: string; mode: Mode; preferredStart: string;
  experience: string; motivation?: string; questions?: string;
  status: Status; payment: PaymentStatus; submittedAt: string; notes?: string;
}
export interface EmailMessage {
  id: string; registrationId: string; direction: "outbound" | "inbound";
  subject: string; body: string; sentBy?: string; sentAt: string; read?: boolean;
}
export interface Testimonial { name: string; course: string; quote: string; rating: number; }
