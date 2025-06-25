import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const token = params.get('access_token');
    const type = params.get('type');

    if (token && type === 'recovery') {
      setAccessToken(token);
      setInitialized(true);
      toast({ title: 'جاهز لإعادة التعيين', description: 'يمكنك الآن تعيين كلمة مرور جديدة.' });
    } else {
      toast({ title: 'رابط غير صالح', description: 'الرابط منتهي أو غير صحيح.', variant: 'destructive' });
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

    if (!accessToken) {
      toast({ title: 'خطأ', description: 'رمز إعادة التعيين غير موجود.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast({ title: 'تم التحديث', description: 'تم تغيير كلمة المرور بنجاح.' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorData = await res.json();
        toast({ title: 'فشل التحديث', description: errorData.message || 'حدث خطأ.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'فشل التحديث', description: 'حدث خطأ في الاتصال.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  if (!initialized) return <p className="text-center mt-10">جار التحقق...</p>;

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
