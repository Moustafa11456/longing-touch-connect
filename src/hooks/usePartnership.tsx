
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Partnership {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string; // Changed from strict union to string to match database
  created_at: string;
  accepted_at?: string;
  partner_profile?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export const usePartnership = () => {
  const { user } = useAuth();
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPartnership();
      subscribeToPartnership();
    } else {
      setPartnership(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPartnership = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('partnerships')
        .select(`
          *,
          user1_profile:profiles!partnerships_user1_id_fkey(id, name, email, avatar_url),
          user2_profile:profiles!partnerships_user2_id_fkey(id, name, email, avatar_url)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching partnership:', error);
        setPartnership(null);
      } else if (data) {
        // Determine which profile is the partner
        const isUser1 = data.user1_id === user.id;
        const partnerProfile = isUser1 ? data.user2_profile : data.user1_profile;
        
        setPartnership({
          ...data,
          partner_profile: partnerProfile
        });
      } else {
        setPartnership(null);
      }
    } catch (error) {
      console.error('Error fetching partnership:', error);
      setPartnership(null);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPartnership = () => {
    if (!user) return;

    const channel = supabase
      .channel('partnership-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partnerships',
          filter: `user1_id=eq.${user.id},user2_id=eq.${user.id}`
        },
        () => {
          fetchPartnership();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPartnership = async (partnerEmail: string) => {
    if (!user) return { error: 'No user' };

    try {
      // First, find the partner by email
      const { data: partnerProfile, error: partnerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', partnerEmail)
        .single();

      if (partnerError || !partnerProfile) {
        return { error: 'الشريك غير موجود أو لم يسجل بعد في التطبيق' };
      }

      if (partnerProfile.id === user.id) {
        return { error: 'لا يمكنك إضافة نفسك كشريك' };
      }

      // Create partnership
      const { data, error } = await supabase
        .from('partnerships')
        .insert({
          user1_id: user.id,
          user2_id: partnerProfile.id,
          status: 'accepted' // Auto-accept for now
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { error: 'الشراكة موجودة بالفعل' };
        }
        return { error: error.message };
      }

      await fetchPartnership();
      return { data };
    } catch (error) {
      console.error('Error creating partnership:', error);
      return { error: 'حدث خطأ في إنشاء الشراكة' };
    }
  };

  const deletePartnership = async () => {
    if (!user || !partnership) return { error: 'No partnership to delete' };

    try {
      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', partnership.id);

      if (error) {
        return { error: error.message };
      }

      setPartnership(null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting partnership:', error);
      return { error: 'حدث خطأ في حذف الشراكة' };
    }
  };

  return {
    partnership,
    loading,
    createPartnership,
    deletePartnership,
    refetch: fetchPartnership
  };
};
