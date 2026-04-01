import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { HiveType } from '../lib/types';

export function useHives() {
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();

  const addHive = async (data: { name: string; location: string; type: HiveType; dateEstablished: string; notes: string }) => {
    if (!user) return null;
    const { data: row, error } = await supabase
      .from('hives')
      .insert({
        user_id: user.id,
        name: data.name,
        location: data.location,
        type: data.type,
        date_established: data.dateEstablished,
        notes: data.notes,
      })
      .select()
      .single();

    if (error || !row) return null;
    const hive = {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      location: row.location || '',
      type: row.type as HiveType,
      dateEstablished: row.date_established,
      notes: row.notes || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    dispatch({ type: 'ADD_HIVE', payload: hive });
    return hive;
  };

  const updateHive = async (id: string, data: Partial<{ name: string; location: string; type: HiveType; dateEstablished: string; notes: string }>) => {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.location !== undefined) dbData.location = data.location;
    if (data.type !== undefined) dbData.type = data.type;
    if (data.dateEstablished !== undefined) dbData.date_established = data.dateEstablished;
    if (data.notes !== undefined) dbData.notes = data.notes;
    dbData.updated_at = new Date().toISOString();

    const { data: row, error } = await supabase
      .from('hives')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error || !row) return;
    const hive = {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      location: row.location || '',
      type: row.type as HiveType,
      dateEstablished: row.date_established,
      notes: row.notes || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    dispatch({ type: 'UPDATE_HIVE', payload: hive });
  };

  const deleteHive = async (id: string) => {
    const { error } = await supabase.from('hives').delete().eq('id', id);
    if (!error) dispatch({ type: 'DELETE_HIVE', payload: id });
  };

  const getHive = (id: string) => state.hives.find(h => h.id === id);

  return { hives: state.hives, addHive, updateHive, deleteHive, getHive };
}
