export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  level: string;
  horse: {
    name: string;
    breed: string;
    age: number;
    level: string;
    discipline: string;
  };
  competitions: Competition[];
  training_goals?: TrainingGoal[];
  user_id?: string;
}

export interface Lesson {
  id: string;
  student_id: string;
  student?: {
    id: string;
    name: string;
    level: string;
  };
  date: string;
  time: string;
  duration: number;
  focus: string;
  notes?: string;
}

export interface Competition {
  id: string;
  date: string;
  location: string;
  level: string;
  result?: string;
  placement?: string;
}

export interface TrainingGoal {
  id: string;
  description: string;
  created_at: string;
  student_id: string;
  completed: boolean;
}

export interface LessonRequest {
  id: string;
  student_id: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  response_notes?: string;
  responded_at?: string;
  created_at: string;
}

export interface CompetitionEntry extends Competition {
  student_id: string;
  competition_name: string;
  status: 'registered' | 'completed';
  updated_at: string;
  created_at: string;
}