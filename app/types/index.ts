

// ─── API Response Types ────────────────────────────────────────────────────

export interface ActivityType {
  id: number;
  name: string;
  description: string;
  asset?: {
    filename: string;
  };
}

export interface Activity {
    id: number;
    name: string;
    weekday: string; // "Tirsdag"
    time: string; // "13:45"
    description: string;
    minAge: number;
    maxAge: number;
    maxParticipants?: number;
    asset?: {
        filename: string;
    }
    trainer?: User;
    users?: User[];
    };
    

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

export interface ActivityType {
    id: number;
    name: string;
    description: string;
    asset?: {
        filename: string;
    };
}

// ─── Auth Types ────────────────────────────────────────────────────────────

// ─── Form Types ────────────────────────────────────────────────────────────

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