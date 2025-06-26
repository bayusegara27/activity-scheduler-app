
export enum ActivityCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  FITNESS = 'Fitness',
  LEARNING = 'Learning',
  SOCIAL = 'Social',
  OTHER = 'Other',
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  category: ActivityCategory;
  isCompleted: boolean;
}

export interface CategoryColorMap {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
}

export type AppView = 'today' | 'all' | 'analytics';
    