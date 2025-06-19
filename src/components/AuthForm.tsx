
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@/types/User";

interface AuthFormProps {
  onLogin: (user: UserType) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const validateEmail = (email: string) => {
    return email.endsWith('@gmail.com');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى استخدام بريد إلكتروني من Gmail فقط",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate login process
    setTimeout(() => {
      const user: UserType = {
        id: generateUserId(),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى استخدام بريد إلكتروني من Gmail فقط",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمتا المرور غير متطابقتان",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      const user: UserType = {
        id: generateUserId(),
        name: formData.name,
        email: formData.email,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في أسوارة الاشتياق!",
      });

      onLogin(user);
      setIsLoading(false);
    }, 2000);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast({
        title: "أدخل بريدك الإلكتروني",
        description: "يرجى إدخال البريد الإلكتروني أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى استخدام بريد إلكتروني من Gmail فقط",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم إرسال رابط الاسترداد",
      description: "تحقق من بريدك الإلكتروني لاسترداد كلمة المرور",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100 flex items-center justify-center p-4 font-arabic">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">أسوارة الاشتياق</h1>
          <p className="text-gray-600">Longing Bracelet</p>
          <p className="text-sm text-purple-600 mt-2">اربط قلبك بمن تحب عبر لمسة واحدة</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-md border-purple-200 shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-800">مرحباً بعودتك</CardTitle>
                <CardDescription>
                  سجل دخولك للتواصل مع من تحب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">البريد الإلكتروني (Gmail)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 text-left"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-purple-600 hover:text-purple-800 p-0 h-auto"
                      onClick={handleForgotPassword}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري تسجيل الدخول...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        تسجيل الدخول
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-800">إنشاء حساب جديد</CardTitle>
                <CardDescription>
                  انضم لمجتمع أسوارة الاشتياق
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">البريد الإلكتروني (Gmail)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 text-left"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="أعد إدخال كلمة المرور"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري إنشاء الحساب...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        إنشاء الحساب
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>✨ يعمل السيرفر في سوريا وجميع البلدان ✨</p>
          <p className="mt-2">تم التصميم بواسطة <span className="font-semibold text-purple-700">Eng. Moustafa Huda</span></p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
