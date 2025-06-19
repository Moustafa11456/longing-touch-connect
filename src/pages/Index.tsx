
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bluetooth, User, Settings, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/AuthForm";
import TouchInterface from "@/components/TouchInterface";
import UserProfile from "@/components/UserProfile";
import { User as UserType } from "@/types/User";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("touch");
  const { toast } = useToast();

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('longingBraceletUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
  }, []);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    localStorage.setItem('longingBraceletUser', JSON.stringify(user));
    toast({
      title: "أهلاً وسهلاً",
      description: `مرحباً بك ${user.name}! تم تسجيل الدخول بنجاح`,
      duration: 3000,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('longingBraceletUser');
    setIsConnected(false);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
      duration: 3000,
    });
  };

  const simulateBluetoothConnection = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "تم قطع الاتصال" : "تم الاتصال بنجاح",
      description: isConnected ? "تم قطع الاتصال مع الأسوارة" : "تم الاتصال مع أسوارة الاشتياق",
      duration: 3000,
    });
  };

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey-light via-baby-pink-light/20 to-lavender/10 font-arabic">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-baby-pink-light sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-lavender to-baby-pink p-2 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-plum">أسوارة الاشتياق</h1>
                <p className="text-sm text-dark-plum/70">Longing Bracelet</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-dark-plum/70">
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={simulateBluetoothConnection}
                className="flex items-center gap-2 border-lavender text-lavender hover:bg-lavender hover:text-white"
              >
                <Bluetooth className="w-4 h-4" />
                {isConnected ? 'قطع الاتصال' : 'الاتصال'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="touch" className="flex items-center gap-2 data-[state=active]:bg-lavender data-[state=active]:text-white">
              <Heart className="w-4 h-4" />
              لمسة الاشتياق
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-lavender data-[state=active]:text-white">
              <User className="w-4 h-4" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-lavender data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="touch">
            <TouchInterface user={currentUser} isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile user={currentUser} onUpdateUser={setCurrentUser} />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white/60 backdrop-blur-sm border-baby-pink-light">
              <CardHeader>
                <CardTitle className="text-right text-dark-plum">الإعدادات</CardTitle>
                <CardDescription className="text-right">
                  إدارة إعدادات التطبيق والحساب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between border-lavender text-lavender hover:bg-lavender hover:text-white"
                    onClick={() => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })}
                  >
                    <span>إعدادات الإشعارات</span>
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-between border-baby-pink text-baby-pink hover:bg-baby-pink hover:text-white"
                    onClick={() => window.open('mailto:Safo6789safo@gmail.com', '_blank')}
                  >
                    <span>التواصل مع المطور</span>
                    <Mail className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-baby-pink-light text-center text-sm text-dark-plum/70">
                  <p>تم التصميم بواسطة</p>
                  <p className="font-semibold text-lavender">Eng. Moustafa Huda</p>
                  <p className="text-xs mt-2">
                    للتواصل: 
                    <a href="mailto:Safo6789safo@gmail.com" className="text-baby-pink hover:underline ml-1">
                      Safo6789safo@gmail.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
