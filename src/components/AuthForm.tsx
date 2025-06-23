
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey-light via-baby-pink-light/20 to-lavender/10 flex items-center justify-center p-4 font-arabic">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-baby-pink-light">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-lavender to-baby-pink p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-dark-plum">أسوارة الاشتياق</CardTitle>
          <CardDescription className="text-dark-plum/70">
            اربط قلبك مع من تحب واشعر باللمسات عن بُعد
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-lavender/10 border border-lavender/30 rounded-lg p-4 text-center">
            <p className="text-sm text-dark-plum/70 mb-2">
              مرحباً بك في تجربة الاشتياق الرقمية
            </p>
            <p className="text-xs text-dark-plum/60">
              سجل دخولك بحساب Google لبدء التجربة
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري تسجيل الدخول...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                تسجيل الدخول بـ Google
              </div>
            )}
          </Button>

          <div className="text-center text-xs text-dark-plum/60 pt-4 border-t border-baby-pink-light">
            <p>بمتابعة استخدام التطبيق، أنت توافق على شروط الخدمة</p>
            <p className="mt-1">تم التصميم بحب بواسطة Eng. Moustafa Huda</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
