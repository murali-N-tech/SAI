export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin';
  age?: number;
  height?: number;
  weight?: number;
  location?: {
    city?: string;
    state?: string;
  };
}

export interface Test {
  id: string;
  name: string;
  description: string;
}

export interface Submission {
  _id: string;
  athlete: string;
  test: Test;
  videoUrl?: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed' | 'normal_user' | 'prospect_approved';
  score: number;
  feedback?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
    athleteId: string;
    name: string;
    location?: {
        state?: string;
    };
    score: number;
    date: string;
}