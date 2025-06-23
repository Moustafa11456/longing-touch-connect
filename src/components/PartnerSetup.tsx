
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, UserPlus, UserMinus, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePartnership } from "@/hooks/usePartnership";

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

interface PartnerSetupProps {
  user: Profile;
  partnership: Partnership | null;
}

const PartnerSetup = ({ user, partnership }: PartnerSetupProps) => {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createPartnership, deletePartnership } = usePartnership();

  const handleAddPartner = async () => {
    if (!partnerEmail.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني للشريك",
        variant: "destructive",
      });
      return;
    }

    if (partnerEmail === user.email) {
      toast({
        title: "خطأ",
        description: "لا يمكنك إضافة نفسك كشريك",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await createPartnership(partnerEmail);
    
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الشريك بنجاح",
        duration: 3000,
      });
      setPartnerEmail('');
    }
    setIsLoading(false);
  };

  const handleRemovePartner = async () => {
    setIsLoading(true);
    const { error } = await deletePartnership();
    
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم بنجاح",
        description: "تم حذف الشريك بنجاح",
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
      <CardHeader>
        <CardTitle className="text-right text-dark-plum flex items-center gap-2">
          <Heart className="w-5 h-5 text-baby-pink" />
          إعداد الشراكة
        </CardTitle>
        <CardDescription className="text-right">
          ربط حسابك مع شريك حياتك لمشاركة لمسات الاشتياق
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {partnership ? (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-lavender/10 to-baby-pink/10 border border-lavender/20 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-lavender to-baby-pink rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                {partnership.partner_profile?.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-dark-plum mb-1">
                {partnership.partner_profile?.name}
              </h3>
              <p className="text-sm text-dark-plum/70" dir="ltr">
                {partnership.partner_profile?.email}
              </p>
              <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-block">
                مرتبط
              </div>
            </div>

            <Button
              onClick={handleRemovePartner}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserMinus className="w-4 h-4 mr-2" />
              )}
              إلغاء الشراكة
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6 bg-lavender/5 border border-lavender/20 rounded-lg">
              <Users className="w-12 h-12 text-lavender/50 mx-auto mb-3" />
              <h3 className="font-medium text-dark-plum mb-2">لا يوجد شريك مرتبط</h3>
              <p className="text-sm text-dark-plum/70">
                أضف شريك حياتك لبدء مشاركة لمسات الاشتياق
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-right block">البريد الإلكتروني للشريك</Label>
              <Input
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="text-right border-lavender/30 focus:border-lavender"
                dir="ltr"
              />
            </div>

            <Button
              onClick={handleAddPartner}
              disabled={isLoading || !partnerEmail.trim()}
              className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              إضافة شريك
            </Button>

            <div className="text-xs text-dark-plum/60 text-center">
              <Mail className="w-3 h-3 inline mr-1" />
              تأكد من أن شريكك سجل في التطبيق بنفس البريد الإلكتروني
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnerSetup;
