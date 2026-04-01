import { useAppContext } from '../context/AppContext';
import type { Inspection, BroodPattern, Temperament, HoneyStores, Weather } from '../lib/types';
import { generateId } from '../lib/utils';
import { calculateHealthScore } from '../lib/health-score';

export interface InspectionInput {
  hiveId: string;
  date: string;
  queenSpotted: boolean;
  broodPattern: BroodPattern;
  temperament: Temperament;
  honeyStores: HoneyStores;
  pestsAndDiseases: string[];
  weather: Weather;
  notes: string;
}

export function useInspections() {
  const { state, dispatch } = useAppContext();

  const addInspection = (data: InspectionInput) => {
    const healthScore = calculateHealthScore(data);
    const inspection: Inspection = {
      id: generateId(),
      ...data,
      healthScore,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INSPECTION', payload: inspection });
    return inspection;
  };

  const updateInspection = (id: string, data: InspectionInput) => {
    const existing = state.inspections.find(i => i.id === id);
    if (!existing) return;
    const healthScore = calculateHealthScore(data);
    const updated: Inspection = { ...existing, ...data, healthScore };
    dispatch({ type: 'UPDATE_INSPECTION', payload: updated });
  };

  const deleteInspection = (id: string) => {
    dispatch({ type: 'DELETE_INSPECTION', payload: id });
  };

  const getInspectionsForHive = (hiveId: string) =>
    state.inspections
      .filter(i => i.hiveId === hiveId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getLatestInspection = (hiveId: string) => {
    const hiveInspections = getInspectionsForHive(hiveId);
    return hiveInspections[0] || null;
  };

  return {
    inspections: state.inspections,
    addInspection,
    updateInspection,
    deleteInspection,
    getInspectionsForHive,
    getLatestInspection,
  };
}
