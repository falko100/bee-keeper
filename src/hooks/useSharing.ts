import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { HiveShare, Profile } from '../lib/types';

export function useSharing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const shareHive = async (hiveId: string, email: string, permission: 'view' | 'edit' = 'view') => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);

    // Find user by email
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .limit(1);

    if (!profiles || profiles.length === 0) {
      setLoading(false);
      return { error: 'No user found with that email address' };
    }

    const targetUser = profiles[0];
    if (targetUser.id === user.id) {
      setLoading(false);
      return { error: "You can't share a hive with yourself" };
    }

    const { error } = await supabase
      .from('hive_shares')
      .upsert({
        hive_id: hiveId,
        owner_id: user.id,
        shared_with_id: targetUser.id,
        permission,
      }, { onConflict: 'hive_id,shared_with_id' });

    setLoading(false);
    if (error) return { error: error.message };
    return { error: null };
  };

  const getSharesForHive = async (hiveId: string): Promise<(HiveShare & { email: string })[]> => {
    const { data } = await supabase
      .from('hive_shares')
      .select(`
        id, hive_id, owner_id, shared_with_id, permission, created_at,
        profiles!hive_shares_shared_with_id_fkey ( email )
      `)
      .eq('hive_id', hiveId);

    if (!data) return [];
    return data.map((row: any) => ({
      id: row.id,
      hiveId: row.hive_id,
      ownerId: row.owner_id,
      sharedWithId: row.shared_with_id,
      permission: row.permission,
      createdAt: row.created_at,
      email: row.profiles?.email || 'Unknown',
    }));
  };

  const removeShare = async (shareId: string) => {
    const { error } = await supabase.from('hive_shares').delete().eq('id', shareId);
    return { error: error?.message ?? null };
  };

  const getSharedWithMe = async () => {
    if (!user) return [];
    const { data } = await supabase
      .from('hive_shares')
      .select(`
        id, hive_id, owner_id, permission, created_at,
        profiles!hive_shares_owner_id_fkey ( email, display_name )
      `)
      .eq('shared_with_id', user.id);

    return data || [];
  };

  return { shareHive, getSharesForHive, removeShare, getSharedWithMe, loading };
}
