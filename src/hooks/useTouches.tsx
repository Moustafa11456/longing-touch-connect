
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePartnership } from './usePartnership';

interface Touch {
  id: string;
  sender_id: string;
  receiver_id: string;
  partnership_id: string;
  message?: string;
  intensity: number;
  sent_at: string;
  received_at?: string;
  is_read: boolean;
}

export const useTouches = () => {
  const { user } = useAuth();
  const { partnership } = usePartnership();
  const [touches, setTouches] = useState<Touch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && partnership) {
      fetchTouches();
      subscribeToTouches();
    } else {
      setTouches([]);
      setLoading(false);
    }
  }, [user, partnership]);

  const fetchTouches = async () => {
    if (!user || !partnership) return;

    try {
      const { data, error } = await supabase
        .from('touches')
        .select('*')
        .eq('partnership_id', partnership.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching touches:', error);
        setTouches([]);
      } else {
        setTouches(data || []);
      }
    } catch (error) {
      console.error('Error fetching touches:', error);
      setTouches([]);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTouches = () => {
    if (!user || !partnership) return;

    const channel = supabase
      .channel('touches-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'touches',
          filter: `partnership_id=eq.${partnership.id}`
        },
        (payload) => {
          const newTouch = payload.new as Touch;
          setTouches(prev => [newTouch, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendTouch = async (intensity: number = 3, message?: string) => {
    if (!user || !partnership) return { error: 'No partnership found' };

    const receiverId = partnership.user1_id === user.id 
      ? partnership.user2_id 
      : partnership.user1_id;

    try {
      const { data, error } = await supabase
        .from('touches')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          partnership_id: partnership.id,
          intensity,
          message
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending touch:', error);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error sending touch:', error);
      return { error: 'حدث خطأ في إرسال اللمسة' };
    }
  };

  const markAsRead = async (touchId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('touches')
        .update({ is_read: true, received_at: new Date().toISOString() })
        .eq('id', touchId)
        .eq('receiver_id', user.id);

      if (error) {
        console.error('Error marking touch as read:', error);
      } else {
        setTouches(prev => prev.map(touch => 
          touch.id === touchId 
            ? { ...touch, is_read: true, received_at: new Date().toISOString() }
            : touch
        ));
      }
    } catch (error) {
      console.error('Error marking touch as read:', error);
    }
  };

  const getUnreadCount = () => {
    if (!user) return 0;
    return touches.filter(touch => 
      touch.receiver_id === user.id && !touch.is_read
    ).length;
  };

  const getReceivedTouches = () => {
    if (!user) return [];
    return touches.filter(touch => touch.receiver_id === user.id);
  };

  const getSentTouches = () => {
    if (!user) return [];
    return touches.filter(touch => touch.sender_id === user.id);
  };

  return {
    touches,
    loading,
    sendTouch,
    markAsRead,
    getUnreadCount,
    getReceivedTouches,
    getSentTouches,
    refetch: fetchTouches
  };
};
