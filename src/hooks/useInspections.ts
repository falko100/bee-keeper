import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { BroodPattern, Temperament, HoneyStores, Weather, Inspection } from '../lib/types';
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

function mapRow(row: Record<string, unknown>): Inspection {
  return {
    id: row.id as string,
    hiveId: row.hive_id as string,
    userId: row.user_id as string,
    date: row.date as string,
    queenSpotted: row.queen_spotted as boolean,
    broodPattern: row.brood_pattern as BroodPattern,
    temperament: row.temperament as Temperament,
    honeyStores: row.honey_stores as HoneyStores,
    pestsAndDiseases: (row.pests_and_diseases as string[]) || [],
    weather: {
      condition: row.weather_condition as Weather['condition'],
      temperatureF: row.weather_temperature_f as number,
    },
    notes: (row.notes as string) || '',
    healthScore: row.health_score as number,
    createdAt: row.created_at as string,
  };
}

export function useInspections() {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();

  const addInspection = async (data: InspectionInput) => {
    if (!user) return null;
    const healthScore = calculateHealthScore(data);
    const { data: row, error } = await supabase
      .from('inspections')
      .insert({
        hive_id: data.hiveId,
        user_id: user.id,
        date: data.date,
        queen_spotted: data.queenSpotted,
        brood_pattern: data.broodPattern,
        temperament: data.temperament,
        honey_stores: data.honeyStores,
        pests_and_diseases: data.pestsAndDiseases,
        weather_condition: data.weather.condition,
        weather_temperature_f: data.weather.temperatureF,
        notes: data.notes,
        health_score: healthScore,
      })
      .select()
      .single();

    if (error || !row) return null;
    const inspection = mapRow(row);
    dispatch({ type: 'ADD_INSPECTION', payload: inspection });
    return inspection;
  };

  const updateInspection = async (id: string, data: InspectionInput) => {
    const healthScore = calculateHealthScore(data);
    const { data: row, error } = await supabase
      .from('inspections')
      .update({
        date: data.date,
        queen_spotted: data.queenSpotted,
        brood_pattern: data.broodPattern,
        temperament: data.temperament,
        honey_stores: data.honeyStores,
        pests_and_diseases: data.pestsAndDiseases,
        weather_condition: data.weather.condition,
        weather_temperature_f: data.weather.temperatureF,
        notes: data.notes,
        health_score: healthScore,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !row) return;
    dispatch({ type: 'UPDATE_INSPECTION', payload: mapRow(row) });
  };

  const deleteInspection = async (id: string) => {
    const { error } = await supabase.from('inspections').delete().eq('id', id);
    if (!error) dispatch({ type: 'DELETE_INSPECTION', payload: id });
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
