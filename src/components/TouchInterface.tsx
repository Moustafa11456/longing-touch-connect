
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Send, Vibrate, Users, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/User";

interface TouchInterfaceProps {
  user: User;
  isConnected: boolean;
}

const TouchInterface = ({ user, isConnected }: TouchInterfaceProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchesReceived, setTouchesReceived] = useState(0);
  const [touchesSent, setTouchesSent] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Simulate receiving touches randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && Math.random() < 0.1) { // 10% chance every 5 seconds
        receiveTouch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const sendTouch = () => {
    if (!isConnected) {
      toast({
        title: "غير متصل",
        description: "يرجى الاتصال بالأسوارة أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!user.partnerId) {
      toast({
        title: "لا يوجد شريك",
        description: "يرجى إضافة شريك أولاً من الملف الشخصي",
        variant: "destructive",
      });
      return;
    }

    setIsAnimating(true);
    setTouchesSent(prev => prev + 1);
    setLastTouchTime(new Date());

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    toast({
      title: "تم إرسال لمسة الاشتياق ❤️",
      description: `وصلت لمستك المليئة بالحب إلى ${user.partnerName || 'شريكك'}`,
      duration: 4000,
    });

    setTimeout(() => setIsAnimating(false), 2000);
  };

  const receiveTouch = () => {
    setTouchesReceived(prev => prev + 1);
    setLastTouchTime(new Date());

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([300, 150, 300, 150, 300]);
    }

    toast({
      title: "وصلتك لمسة اشتياق! 💕",
      description: "شخص ما يفتقدك ويرسل لك حبه",
      duration: 5000,
    });

    // Add heart animation effect
    createHeartAnimation();
  };

  const createHeartAnimation = () => {
    const hearts = document.createElement('div');
    hearts.className = 'fixed inset-0 pointer-events-none z-50';
    
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.className = 'absolute text-2xl animate-bounce';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.animationDelay = i * 0.1 + 's';
      hearts.appendChild(heart);
    }
    
    document.body.appendChild(hearts);
    
    setTimeout(() => {
      document.body.removeChild(hearts);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Partner Status */}
      {user.partnerId ? (
        <Card className="bg-white/60 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-semibold">مرتبط مع {user.partnerName}</span>
                </div>
                <p className="text-sm text-red-600">{user.partnerEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-yellow-800 font-semibold mb-2">لا يوجد شريك مرتبط</p>
              <p className="text-sm text-yellow-700">يرجى إضافة شريك من الملف الشخصي لبدء إرسال لمسات الاشتياق</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">لمسات مُرسلة</p>
                <p className="text-2xl font-bold text-red-600">{touchesSent}</p>
              </div>
              <Send className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">لمسات مُستقبلة</p>
                <p className="text-2xl font-bold text-red-600">{touchesReceived}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="text-sm font-semibold text-red-600">
                  {isConnected ? 'متصل ونشط' : 'غير متصل'}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Touch Interface */}
      <Card className="bg-white/60 backdrop-blur-sm border-red-200">
        <CardHeader className="text-center">
          <CardTitle className="text-red-800 text-2xl">لمسة الاشتياق</CardTitle>
          <CardDescription>
            اضغط على الزر لإرسال لمسة حب ومودة إلى الطرف الآخر
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Touch Button */}
          <div className="flex justify-center">
            <Button
              onClick={sendTouch}
              disabled={!isConnected || isAnimating || !user.partnerId}
              className={`
                w-40 h-40 rounded-full text-white font-bold text-lg
                transition-all duration-300 transform
                ${isAnimating 
                  ? 'scale-110 bg-gradient-to-r from-red-600 to-red-800 animate-pulse' 
                  : 'hover:scale-105 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
                }
                ${(!isConnected || !user.partnerId) ? 'opacity-50 cursor-not-allowed' : ''}
                shadow-2xl
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Heart className={`w-12 h-12 ${isAnimating ? 'animate-bounce' : ''}`} />
                <span className="text-sm">أرسل لمسة</span>
                <span className="text-sm">اشتياق</span>
              </div>
            </Button>
          </div>

          {/* Connection Status */}
          <div className="text-center space-y-2">
            {!isConnected ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <Vibrate className="w-5 h-5" />
                  <span>يرجى الاتصال بالأسوارة من الأعلى لبدء الاستخدام</span>
                </div>
              </div>
            ) : !user.partnerId ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-orange-700">
                  <Users className="w-5 h-5" />
                  <span>يرجى إضافة شريك من الملف الشخصي لبدء الاستخدام</span>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Users className="w-5 h-5" />
                  <span>متصل ومستعد لإرسال واستقبال لمسات الاشتياق</span>
                </div>
              </div>
            )}
          </div>

          {/* Last Touch Info */}
          {lastTouchTime && (
            <div className="text-center text-sm text-gray-600">
              آخر لمسة: {lastTouchTime.toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 text-center">كيفية الاستخدام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
              <p>أضف شريكك من الملف الشخصي</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
              <p>تأكد من الاتصال بالأسوارة عبر البلوتوث</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
              <p>اضغط على زر "أرسل لمسة اشتياق" لإرسال رسالة حب</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
              <p>استمتع بالتواصل العاطفي مع من تحب في أي وقت</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouchInterface;
