import { useAppContext } from '../context/AppContext';
import type { Hive, HiveType } from '../lib/types';
import { generateId } from '../lib/utils';

export function useHives() {
  const { state, dispatch } = useAppContext();

  const addHive = (data: { name: string; location: string; type: HiveType; dateEstablished: string; notes: string }) => {
    const now = new Date().toISOString();
    const hive: Hive = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_HIVE', payload: hive });
    return hive;
  };

  const updateHive = (id: string, data: Partial<Omit<Hive, 'id' | 'createdAt'>>) => {
    const existing = state.hives.find(h => h.id === id);
    if (!existing) return;
    const updated: Hive = { ...existing, ...data, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_HIVE', payload: updated });
  };

  const deleteHive = (id: string) => {
    dispatch({ type: 'DELETE_HIVE', payload: id });
  };

  const getHive = (id: string) => state.hives.find(h => h.id === id);

  return { hives: state.hives, addHive, updateHive, deleteHive, getHive };
}
