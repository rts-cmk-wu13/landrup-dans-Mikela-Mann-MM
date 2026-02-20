

// ─── API Response Types ────────────────────────────────────────────────────



export interface Asset {
  id: number;
  url: string;
  filename?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityType {
  id: number;
  name: string;
  description: string;
  weekday?: string;
  time?: string;
  minAge?: number;
  maxAge?: number;
  maxParticipants?: number;
  asset?: Asset;
  assetId?: number;
}

export interface Activity {
  id: number;
  name: string;
  weekday: string;
  time: string;
  description: string;
  minAge: number;
  maxAge: number;
  maxParticipants?: number;
  asset?: Asset;  // ← bruger nu Asset i stedet for inline
  assetId?: number;
  trainer?: User;
  users?: User[];
}

export interface ActivityProbs {
  activity: Activity;
}


export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  age: number;
  role: "default" | "instructor" | "admin";
  activities?: Activity[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
}




// ─── Auth Types ────────────────────────────────────────────────────────────

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  userId: number;
  token: string;
  role: "default" | "instructor" | "admin";
}

export interface Session {
  userId: number;
  token: string;
  role: "default" | "instructor" | "admin";
  rememberMe?: boolean;
}

export interface AuthErrors {
  username?: string;
  password?: string;
  general?: string;
}

// ─── Form Types ────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface NewsletterPayload {
  email: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  username: string;
  age: number;
  password: string;
  role: "default";
}

export interface CreateActivityPayload {
  name: string;
  description: string;
  weekday: string;
  time: string;
  minAge: number;
  maxAge: number;
  maxParticipants: number;
  file?: File | null;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

// ─── Component Props ───────────────────────────────────────────────────────

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface EnrollButtonProps {
  activityId: number;
  initialEnrolled: boolean;
  onEnroll: (activityId: number) => Promise<{ error?: string; success?: boolean }>;
  onLeave: (activityId: number) => Promise<{ error?: string; success?: boolean }>;
}