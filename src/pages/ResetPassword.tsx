import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (!error) {
            setIsValid(true);
            toast({ title: 'جاهز لإعادة التعيين', description: 'يمكنك الآن تعيين كلمة مرور جديدة.' });
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
    if (password.length < 6) {
      toast({ title: 'خطأ', description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'خطأ', description: 'كلمة المرور وتأكيدها غير متطابقين.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast({ title: 'فشل التحديث', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تم التحديث', description: 'تم تغيير كلمة المرور بنجاح.' });
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (!initialized) return <p className="text-center mt-10">جار التحقق...</p>;
  if (!isValid) return <p className="text-center mt-10 text-red-600">الرابط غير صالح أو منتهي الصلاحية</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-arabic">
      <Input
        type="password"
        placeholder="كلمة المرور الجديدة"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={isLoading}
        className="mb-4"
      />
      <Input
        type="password"
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        disabled={isLoading}
        className="mb-6"
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'جاري التحديث...' : 'تحديث'}
      </Button>
    </div>
  );
};

export default ResetPassword;
