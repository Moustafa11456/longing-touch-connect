
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Heart, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/User";

interface PartnerSetupProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const PartnerSetup = ({ user, onUpdateUser }: PartnerSetupProps) => {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddPartner = async () => {
    if (!partnerEmail.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد الشريك الإلكتروني",
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

    // Simulate API call to find and connect partner
    setTimeout(() => {
      const updatedUser = {
        ...user,
        partnerEmail: partnerEmail,
        partnerName: partnerEmail.split('@')[0], // Simple name extraction
        partnerId: 'partner_' + Date.now()
      };

      onUpdateUser(updatedUser);
      localStorage.setItem('longingBraceletUser', JSON.stringify(updatedUser));

      toast({
        title: "تم بنجاح! ❤️",
        description: `تم ربطك مع الشريك ${partnerEmail}`,
        duration: 4000,
      });

      setPartnerEmail('');
      setIsLoading(false);
    }, 2000);
  };

  const handleRemovePartner = () => {
    const updatedUser = {
      ...user,
      partnerEmail: undefined,
      partnerName: undefined,
      partnerId: undefined
    };

    onUpdateUser(updatedUser);
    localStorage.setItem('longingBraceletUser', JSON.stringify(updatedUser));

    toast({
      title: "تم إلغاء الربط",
      description: "تم إلغاء الربط مع الشريك",
      duration: 3000,
    });
  };

  if (user.partnerId) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
        <CardHeader>
          <CardTitle className="text-right text-dark-plum flex items-center gap-2">
            <Heart className="w-5 h-5 text-lavender" />
            الشريك المرتبط
          </CardTitle>
          <CardDescription className="text-right">
            أنت مرتبط حالياً مع شريكك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-lavender/10 border border-lavender/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="font-semibold text-dark-plum">{user.partnerName}</p>
                <p className="text-sm text-dark-plum/70">{user.partnerEmail}</p>
              </div>
              <div className="bg-lavender text-white rounded-full p-2">
                <Check className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleRemovePartner}
            className="w-full border-baby-pink text-baby-pink hover:bg-baby-pink hover:text-white"
          >
            إلغاء الربط مع الشريك
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
      <CardHeader>
        <CardTitle className="text-right text-dark-plum flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-lavender" />
          إضافة شريك الاشتياق
        </CardTitle>
        <CardDescription className="text-right">
          أدخل البريد الإلكتروني لشريكك لبدء مشاركة لمسات الاشتياق
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partnerEmail" className="text-right block">
            البريد الإلكتروني للشريك
          </Label>
          <Input
            id="partnerEmail"
            type="email"
            placeholder="partner@example.com"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            className="text-right border-lavender/30 focus:border-lavender"
            dir="ltr"
          />
        </div>

        <Button
          onClick={handleAddPartner}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري البحث عن الشريك...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              إرسال دعوة للشريك
            </div>
          )}
        </Button>

        <div className="bg-lavender/10 border border-lavender/30 rounded-lg p-3">
          <p className="text-sm text-dark-plum/70 text-center">
            سيتم إرسال دعوة للشريك عبر البريد الإلكتروني لتأكيد الربط
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerSetup;
