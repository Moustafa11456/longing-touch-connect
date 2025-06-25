import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Lock, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/supabaseClient';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isValid, setIsValid] = useState(false);

  let accessToken = '';
  let refreshToken = '';

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    accessToken = params.get('access_token') || '';
    refreshToken = params.get('refresh_token') || '';
    const type = params.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      // بناء الجلسة تمهيدًا لتحديث كلمة المرور
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (!error) {
            setIsValid(true);
          } else {
            toast({ title: 'خطأ بالجلسة', description: error.message, variant: 'destructive' });
          }
          setInitialized(true);
        });
    } else {
      toast({ title: 'رابط غير صالح', description: 'الرابط منتهي أو غير صحيح.', variant: 'destructive' });
      setInitialized(true);
      setTimeout(() => navigate('/'), 3000);
    }
  }, [location, navigate, toast]);

  const handleSubmit = async () => {
    if (password.length < 6) return toast({ title: 'خطأ', description: 'كلمة المرور 6 أحرف على الأقل', variant: 'destructive' });
    if (password !== confirmPassword) return toast({ title: 'خطأ', description: 'كلمة المرور والتأكيد غير مطابقين', variant: 'destructive' });

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) toast({ title: 'فشل التحديث', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'تم التحديث', description: 'تم تغيير كلمة المرور بنجاح' });
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (!initialized) return <p>جار التحقق...</p>;
  if (!isValid) return <p>الرابط غير صالح</p>;

  return (
    <div className="...">
      {/* حقل تعديل كلمة المرور */}
      <Input type="password" ... onChange={e => setPassword(e.target.value)} />
      <Input type="password" ... onChange={e => setConfirmPassword(e.target.value)} />
      <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? '...' : 'تحديث'}</Button>
    </div>
  );
};

export default ResetPassword;
