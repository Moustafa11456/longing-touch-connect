import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, User, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, resendConfirmation } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      let errorMessage = error.message;
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.message === 'Email not confirmed') {
        errorMessage = "يرجى تأكيد بريدك الإلكتروني أولاً";
        // Offer to resend confirmation
        toast({
          title: "البريد الإلكتروني غير مؤكد",
          description: "يرجى تأكيد بريدك الإلكتروني أولاً. هل تريد إعادة إرسال رابط التأكيد؟",
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const { error: resendError } = await resendConfirmation(email);
                if (resendError) {
                  toast({
                    title: "خطأ",
                    description: "فشل في إرسال رابط التأكيد",
                    variant: "destructive"
                  });
                } else {
                  toast({
                    title: "تم الإرسال",
                    description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني",
                  });
                }
              }}
            >
              إعادة إرسال
            </Button>
          )
        });
      }
      
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "أهلاً وسهلاً",
        description: "تم تسجيل الدخول بنجاح",
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال جميع البيانات المطلوبة",
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
    const { error } = await signUp(email, password, name);
    
    if (error) {
      let errorMessage = error.message;
      
      if (error.message && error.message.includes('already registered')) {
        errorMessage = "هذا البريد الإلكتروني مسجل مسبقاً";
      } else if (error.message && error.message.includes('rate limit')) {
        errorMessage = "تم تجاوز الحد المسموح. يرجى الانتظار قليلاً والمحاولة مرة أخرى";
      }
      
      toast({
        title: "خطأ في التسجيل",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم التسجيل بنجاح",
        description: "تحقق من بريدك الإلكتروني لتأكيد الحساب. قد تحتاج للتحقق من مجلد الرسائل غير المرغوبة",
        duration: 8000,
      });
      setMode('signin');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    
    if (error) {
      let errorMessage = error.message;
      
      if (error.message && error.message.includes('rate limit')) {
        errorMessage = "تم تجاوز الحد المسموح. يرجى الانتظار قليلاً والمحاولة مرة أخرى";
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الإرسال",
        description: "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور. قد تحتاج للتحقق من مجلد الرسائل غير المرغوبة",
        duration: 8000,
      });
      setMode('signin');
    }
    setIsLoading(false);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resendConfirmation(email);
    
    if (error) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال رابط التأكيد",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الإرسال",
        description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني",
        duration: 5000,
      });
    }
    setIsLoading(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'تسجيل الدخول';
      case 'signup': return 'إنشاء حساب جديد';
      case 'reset': return 'استرجاع كلمة المرور';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin': return 'سجل دخولك للوصول إلى أسوارة الاشتياق';
      case 'signup': return 'أنشئ حساباً جديداً للبدء في تجربة الاشتياق';
      case 'reset': return 'أدخل بريدك الإلكتروني لاسترجاع كلمة المرور';
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
          <CardTitle className="text-2xl text-dark-plum">{getTitle()}</CardTitle>
          <CardDescription className="text-dark-plum/70">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-right pr-10"
                    disabled={isLoading}
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-right pr-10"
                  dir="ltr"
                  disabled={isLoading}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-right pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-dark-plum/60 text-right">
                    كلمة المرور يجب أن تكون 6 أحرف على الأقل
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleResetPassword}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {mode === 'signin' ? 'تسجيل الدخول' : mode === 'signup' ? 'إنشاء الحساب' : 'إرسال رابط الاسترجاع'}
          </Button>

          <div className="space-y-2">
            {mode === 'signin' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setMode('reset')}
                  className="w-full text-baby-pink hover:text-baby-pink-dark"
                  disabled={isLoading}
                >
                  نسيت كلمة المرور؟
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMode('signup')}
                  className="w-full border-lavender text-lavender hover:bg-lavender hover:text-white"
                  disabled={isLoading}
                >
                  إنشاء حساب جديد
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResendConfirmation}
                  className="w-full text-sm text-dark-plum/70 hover:text-dark-plum"
                  disabled={isLoading || !email}
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة إرسال رابط التأكيد
                </Button>
              </>
            )}

            {(mode === 'signup' || mode === 'reset') && (
              <Button
                variant="ghost"
                onClick={() => setMode('signin')}
                className="w-full text-dark-plum hover:text-dark-plum/80"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة لتسجيل الدخول
              </Button>
            )}
          </div>

          <div className="text-center text-xs text-dark-plum/60 pt-4 border-t border-baby-pink-light">
            <p>بمتابعة استخدام التطبيق، أنت توافق على شروط الخدمة</p>
            <p className="mt-1">تم التصميم بحب بواسطة Eng. Moustafa Huda</p>
            <p className="mt-2 text-xs text-orange-600">
              💡 نصيحة: تحقق من مجلد الرسائل غير المرغوبة إذا لم تستلم رسالة التأكيد
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
