import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { AppState, AppAction, Hive, Inspection, Task } from '../lib/types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const initialState: AppState = {
  hives: [],
  inspections: [],
  tasks: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_HIVES':
      return { ...state, hives: action.payload };
    case 'ADD_HIVE':
      return { ...state, hives: [...state.hives, action.payload] };
    case 'UPDATE_HIVE':
      return { ...state, hives: state.hives.map(h => h.id === action.payload.id ? action.payload : h) };
    case 'DELETE_HIVE':
      return {
        ...state,
        hives: state.hives.filter(h => h.id !== action.payload),
        inspections: state.inspections.filter(i => i.hiveId !== action.payload),
        tasks: state.tasks.filter(t => t.hiveId !== action.payload),
      };
    case 'SET_INSPECTIONS':
      return { ...state, inspections: action.payload };
    case 'ADD_INSPECTION':
      return { ...state, inspections: [...state.inspections, action.payload] };
    case 'UPDATE_INSPECTION':
      return { ...state, inspections: state.inspections.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INSPECTION':
      return { ...state, inspections: state.inspections.filter(i => i.id !== action.payload) };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

function mapHiveFromDb(row: Record<string, unknown>): Hive {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    location: (row.location as string) || '',
    type: row.type as Hive['type'],
    dateEstablished: row.date_established as string,
    notes: (row.notes as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapInspectionFromDb(row: Record<string, unknown>): Inspection {
  return {
    id: row.id as string,
    hiveId: row.hive_id as string,
    userId: row.user_id as string,
    date: row.date as string,
    queenSpotted: row.queen_spotted as boolean,
    broodPattern: row.brood_pattern as Inspection['broodPattern'],
    temperament: row.temperament as Inspection['temperament'],
    honeyStores: row.honey_stores as Inspection['honeyStores'],
    pestsAndDiseases: (row.pests_and_diseases as string[]) || [],
    weather: {
      condition: row.weather_condition as Inspection['weather']['condition'],
      temperatureF: row.weather_temperature_f as number,
    },
    notes: (row.notes as string) || '',
    healthScore: row.health_score as number,
    createdAt: row.created_at as string,
  };
}

function mapTaskFromDb(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    hiveId: (row.hive_id as string) || null,
    title: row.title as string,
    description: (row.description as string) || '',
    dueDate: row.due_date as string,
    completed: row.completed as boolean,
    recurring: row.recurring as Task['recurring'],
    createdAt: row.created_at as string,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshData = async () => {
    if (!user) {
      dispatch({ type: 'SET_HIVES', payload: [] });
      dispatch({ type: 'SET_INSPECTIONS', payload: [] });
      dispatch({ type: 'SET_TASKS', payload: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const [hivesRes, inspRes, tasksRes] = await Promise.all([
      supabase.from('hives').select('*'),
      supabase.from('inspections').select('*'),
      supabase.from('tasks').select('*'),
    ]);

    dispatch({ type: 'SET_HIVES', payload: (hivesRes.data || []).map(mapHiveFromDb) });
    dispatch({ type: 'SET_INSPECTIONS', payload: (inspRes.data || []).map(mapInspectionFromDb) });
    dispatch({ type: 'SET_TASKS', payload: (tasksRes.data || []).map(mapTaskFromDb) });
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <AppContext.Provider value={{ state, dispatch, loading, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
