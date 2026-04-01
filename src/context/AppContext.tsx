import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Hive, Inspection, Task } from '../lib/types';
import { getItem, setItem, initStorage } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/constants';

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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initStorage();
    const hives = getItem<Hive[]>(STORAGE_KEYS.HIVES) || [];
    const inspections = getItem<Inspection[]>(STORAGE_KEYS.INSPECTIONS) || [];
    const tasks = getItem<Task[]>(STORAGE_KEYS.TASKS) || [];
    dispatch({ type: 'SET_HIVES', payload: hives });
    dispatch({ type: 'SET_INSPECTIONS', payload: inspections });
    dispatch({ type: 'SET_TASKS', payload: tasks });
  }, []);

  useEffect(() => {
    setItem(STORAGE_KEYS.HIVES, state.hives);
  }, [state.hives]);

  useEffect(() => {
    setItem(STORAGE_KEYS.INSPECTIONS, state.inspections);
  }, [state.inspections]);

  useEffect(() => {
    setItem(STORAGE_KEYS.TASKS, state.tasks);
  }, [state.tasks]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
