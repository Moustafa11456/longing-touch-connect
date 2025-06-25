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
        console.log('Auth event:', event, 'Session:', session);
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

  // هنا عدلنا الرابط ليرسل ?type=recovery عند طلب إعادة تعيين كلمة المرور
  const getRedirectUrl = (path: string = '/') => {
    const baseUrl = 'https://id-preview--619dbd61-b071-4cf5-9afa-51b41c3a5d7d.lovable.app';
    if (path === '/reset-password') {
      return `${baseUrl}${path}?type=recovery`;
    }
    return `${baseUrl}${path}`;
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const redirectTo = getRedirectUrl('/');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { name }
        }
      });
      if (error) console.error('Signup error:', error);
      else console.log('Signup successful:', data);
      return { data, error };
    } catch (err) {
      console.error('Signup exception:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('Signin error:', error);
      else console.log('Signin successful:', data);
      return { data, error };
    } catch (err) {
      console.error('Signin exception:', err);
      return { data: null, error: err };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectTo = getRedirectUrl('/reset-password');
      console.log('Attempting password reset with redirect to:', redirectTo);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) console.error('Password reset error:', error);
      else console.log('Password reset email sent successfully');
      return { error };
    } catch (err) {
      console.error('Password reset exception:', err);
      return { error: err };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) console.error('Password update error:', error);
      else console.log('Password updated successfully');
      return { error };
    } catch (err) {
      console.error('Password update exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Signout error:', error);
      else console.log('Signout successful');
      return { error };
    } catch (err) {
      console.error('Signout exception:', err);
      return { error: err };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const redirectTo = getRedirectUrl('/');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectTo }
      });
      if (error) console.error('Resend confirmation error:', error);
      else console.log('Confirmation email resent successfully');
      return { error };
    } catch (err) {
      console.error('Resend confirmation exception:', err);
      return { error: err };
    }
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
