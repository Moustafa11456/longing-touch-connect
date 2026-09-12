
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Vibrate, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTouches } from "@/hooks/useTouches";
import BluetoothDeviceSelector from "@/components/BluetoothDeviceSelector";
import { LongingDevice, sendTouchToDevice } from "@/services/BluetoothService";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface Partnership {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  created_at: string;
  accepted_at?: string;
  partner_profile?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

interface TouchInterfaceProps {
  user: Profile;
  partnership: Partnership | null;
  isConnected: boolean;
}

const TouchInterface = ({ user, partnership, isConnected }: TouchInterfaceProps) => {
  const [intensity, setIntensity] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedBracelet, setConnectedBracelet] = useState<LongingDevice | null>(null);
  const { toast } = useToast();
  const { sendTouch, touches } = useTouches();

  // --- 1. الاستماع للمسات اللحظية عبر Supabase Realtime ---
  useEffect(() => {
    if (!partnership) return;

    const channelId = `partnership_${partnership.id}`;
    const channel = supabase.channel(channelId);

    channel
      .on('broadcast', { event: 'touch_event' }, async (payload) => {
        console.log('وصلت لمسة لحظية من السيرفر:', payload);

        toast({
          title: "💖 لمسة اشتياق وصلتك الآن!",
          description: `بقوة: ${payload.payload?.intensity || 3}`,
          duration: 4000,
        });

        // إرسال أمر الاهتزاز والإضاءة للسوار المتصل عبر البلوتوث
        if (connectedBracelet) {
          try {
            await sendTouchToDevice(connectedBracelet, payload.payload?.intensity || 3);
          } catch (err) {
            console.error("خطأ في إرسال الإشارة للسوار عبر البلوتوث", err);
          }
        }
      })
      .subscribe((status) => {
        console.log('حالة اشتراك قناة اللمسات:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnership, connectedBracelet, toast]);

  // --- 2. إرسال لمسة عبر الشاشة أو السوار ---
  const handleSendTouch = async () => {
    if (!partnership) {
      toast({
        title: "خطأ",
        description: "يجب ربط حساب شريك أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // أ) الإرسال لقاعدة البيانات
    const { error } = await sendTouch(intensity);

    // ب) البث اللحظي عبر Realtime Broadcast
    const channelId = `partnership_${partnership.id}`;
    const channel = supabase.channel(channelId);

    try {
      await channel.subscribe();
      await channel.send({
        type: 'broadcast',
        event: 'touch_event',
        payload: { 
          sender_id: user.id,
          intensity: intensity 
        },
      });
    } catch (broadcastError) {
      console.error('خطأ في البث اللحظي:', broadcastError);
    } finally {
      supabase.removeChannel(channel);
    }

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تسجيل اللمسة",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الإرسال",
        description: `تم إرسال لمسة اشتياق إلى ${partnership.partner_profile?.name}`,
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  const handleBraceletConnected = (device: LongingDevice) => {
    setConnectedBracelet(device);
    toast({
      title: "تم الاتصال بالأسوارة",
      description: `تم الاتصال بـ ${device.name} بنجاح`,
    });
  };

  const handleBraceletDisconnected = () => {
    setConnectedBracelet(null);
    toast({
      title: "تم قطع الاتصال",
      description: "تم قطع الاتصال بالأسوارة",
    });
  };

  return (
    <div className="space-y-6">
      {/* Bluetooth Device Selector */}
      <BluetoothDeviceSelector 
        onDeviceConnected={handleBraceletConnected}
        onDisconnected={handleBraceletDisconnected}
      />

      {/* Connection Status */}
      <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
        <CardHeader>
          <CardTitle className="text-right text-dark-plum flex items-center gap-2">
            <Heart className="w-5 h-5 text-baby-pink" />
            حالة الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-lavender/5 border border-lavender/20 rounded-lg">
            <div className="text-right">
              <div className="font-medium text-dark-plum">
                {connectedBracelet ? "متصل بالأسوارة" : "غير متصل بالأسوارة"}
              </div>
              <div className="text-sm text-dark-plum/70">
                {connectedBracelet 
                  ? `متصل بـ ${connectedBracelet.name}`
                  : "ابحث عن الأسوارة للاتصال بها"
                }
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${connectedBracelet ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          
          {isConnected && partnership && (
            <div className="mt-3 p-3 bg-baby-pink/5 border border-baby-pink/20 rounded-lg">
              <div className="text-sm text-dark-plum/70 text-right">
                مرتبط مع {partnership.partner_profile?.name}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Touch Interface */}
      <Card className="bg-white/60 backdrop-blur-sm border-baby-pink/30">
        <CardHeader>
          <CardTitle className="text-right text-dark-plum">إرسال لمسة الاشتياق</CardTitle>
          <CardDescription className="text-right">
            اختر قوة اللمسة وأرسل مشاعرك لشريك حياتك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intensity Selector */}
          <div className="space-y-3">
            <label className="text-right block text-sm font-medium text-dark-plum">
              قوة اللمسة: {intensity}
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    intensity >= level
                      ? 'bg-gradient-to-br from-lavender to-baby-pink text-white shadow-lg'
                      : 'bg-lavender/10 text-lavender border border-lavender/30 hover:bg-lavender/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="text-xs text-center text-dark-plum/60">
              1 = همسة خفيفة • 5 = عناق قوي
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendTouch}
            disabled={!isConnected || !connectedBracelet || isLoading}
            className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white py-6 text-lg"
          >
            {isLoading ? (
              <Vibrate className="w-6 h-6 mr-2 animate-pulse" />
            ) : (
              <Send className="w-6 h-6 mr-2" />
            )}
            إرسال لمسة الاشتياق
          </Button>

          {(!isConnected || !connectedBracelet) && (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Users className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">
                {!isConnected && "يجب ربط حساب شريك أولاً"}
                {isConnected && !connectedBracelet && "يجب الاتصال بالأسوارة لإرسال اللمسات"}
                {!isConnected && !connectedBracelet && "يجب ربط حساب شريك والاتصال بالأسوارة"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Touches */}
      {touches.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
          <CardHeader>
            <CardTitle className="text-right text-dark-plum">آخر اللمسات المستقبلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {touches.slice(0, 3).map((touch) => (
                <div key={touch.id} className="flex justify-between items-center p-3 bg-lavender/5 border border-lavender/20 rounded-lg">
                  <div className="text-right">
                    <div className="font-medium text-dark-plum">
                      لمسة من {partnership?.partner_profile?.name}
                    </div>
                    <div className="text-xs text-dark-plum/60">
                      {new Date(touch.sent_at).toLocaleString('ar-EG')}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: touch.intensity }).map((_, i) => (
                      <Heart key={i} className="w-4 h-4 text-baby-pink fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TouchInterface;
