export interface Hive {
  id: string;
  name: string;
  location: string;
  type: HiveType;
  dateEstablished: string;
  notes: string;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export type HiveType = 'Langstroth' | 'Top Bar' | 'Warre' | 'Flow' | 'Other';

export interface Inspection {
  id: string;
  hiveId: string;
  date: string;
  queenSpotted: boolean;
  broodPattern: BroodPattern;
  temperament: Temperament;
  honeyStores: HoneyStores;
  pestsAndDiseases: string[];
  weather: Weather;
  notes: string;
  healthScore: number;
  createdAt: string;
}

export type BroodPattern = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
export type Temperament = 'Calm' | 'Nervous' | 'Aggressive';
export type HoneyStores = 'Abundant' | 'Adequate' | 'Low' | 'Empty';

export interface Weather {
  condition: WeatherCondition;
  temperatureF: number;
}

export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy' | 'Overcast';

export interface Task {
  id: string;
  hiveId: string | null;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  recurring: RecurringType;
  createdAt: string;
}

export type RecurringType = 'none' | 'weekly' | 'biweekly' | 'monthly';

export interface SeasonalTip {
  id: string;
  month: number;
  title: string;
  content: string;
  category: TipCategory;
}

export type TipCategory = 'feeding' | 'inspection' | 'treatment' | 'harvest' | 'general';

export interface AppState {
  hives: Hive[];
  inspections: Inspection[];
  tasks: Task[];
}

export type AppAction =
  | { type: 'SET_HIVES'; payload: Hive[] }
  | { type: 'ADD_HIVE'; payload: Hive }
  | { type: 'UPDATE_HIVE'; payload: Hive }
  | { type: 'DELETE_HIVE'; payload: string }
  | { type: 'SET_INSPECTIONS'; payload: Inspection[] }
  | { type: 'ADD_INSPECTION'; payload: Inspection }
  | { type: 'UPDATE_INSPECTION'; payload: Inspection }
  | { type: 'DELETE_INSPECTION'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };
