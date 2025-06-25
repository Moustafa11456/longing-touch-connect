import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('Error getting session:', error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getRedirectUrl = (path: string = '/reset-password') => {
    const baseUrl = 'https://id-preview--619dbd61-b071-4cf5-9afa-51b41c3a5d7d.lovable.app';
    return `${baseUrl}${path}`;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const redirectTo = getRedirectUrl('/');
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { name }
      }
    });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const resetPassword = async (email: string) => {
    const redirectTo = getRedirectUrl('/reset-password');
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
  };

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const resendConfirmation = async (email: string) => {
    const redirectTo = getRedirectUrl('/');
    return await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: { emailRedirectTo: redirectTo }
    });
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signOut,
    resendConfirmation
  };
};
