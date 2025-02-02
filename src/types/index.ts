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
    trainingGoals: string[];
  }
  
  export interface Lesson {
    id: string;
    studentId: string;
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
    studentId: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    completedAt?: string;
  }