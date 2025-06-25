import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Lock, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // قراءة باراميترات الـ hash من الرابط (بعد #)
    const hashParams = new URLSearchParams(location.hash.replace('#', ''));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    console.log('Reset password hash params:', { accessToken, type });

    if (accessToken && type === 'recovery') {
      setIsValidToken(true);
      toast({
        title: "جاهز لإعادة التعيين",
        description: "يمكنك الآن إدخال كلمة المرور الجديدة",
      });
    } else {
      toast({
        title: "رابط غير صالح",
        description: "الرابط المستخدم غير صالح أو منتهي الصلاحية",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [location.hash, navigate, toast]);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كلمة المرور وتأكيدها",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور وتأكيدها غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      toast({
        title: "خطأ في تحديث كلمة المرور",
        description: error.message || "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث كلمة المرور بنجاح. جاري التوجه للصفحة الرئيسية...",
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setIsLoading(false);
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-grey-light via-baby-pink-light/20 to-lavender/10 flex items-center justify-center p-4 font-arabic">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-baby-pink-light">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-3 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-dark-plum">رابط غير صالح</CardTitle>
            <CardDescription className="text-dark-plum/70">
              الرابط المستخدم غير صالح أو منتهي الصلاحية
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey-light via-baby-pink-light/20 to-lavender/10 flex items-center justify-center p-4 font-arabic">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-baby-pink-light">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-lavender to-baby-pink p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-dark-plum">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription className="text-dark-plum/70">
            أدخل كلمة المرور الجديدة الخاصة بك
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right pr-10"
                  disabled={isLoading}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="أكد كلمة المرور الجديدة"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-right pr-10"
                  disabled={isLoading}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-dark-plum/60 text-right">
              كلمة المرور يجب أن تكون 6 أحرف على الأقل
            </p>
          </div>

          <Button
            onClick={handleUpdatePassword}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            تحديث كلمة المرور
          </Button>

          <div className="text-center text-xs text-dark-plum/60 pt-4 border-t border-baby-pink-light">
            <p>سيتم توجيهك للصفحة الرئيسية بعد تحديث كلمة المرور</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
