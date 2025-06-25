import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";

const PartnerLink = () => {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckPartner = async () => {
    if (!partnerEmail) {
      toast({
        title: "تنبيه",
        description: "يرجى إدخال بريد الشريك",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from('profiles') // تأكد أن جدول profiles يحتوي على بيانات الشركاء
      .select('*')
      .eq('email', partnerEmail)
      .single();

    setIsLoading(false);

    if (error || !data) {
      toast({
        title: "الشريك غير موجود",
        description: "البريد الإلكتروني غير مسجل في قاعدة البيانات",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم العثور على الشريك",
        description: `البريد ${partnerEmail} مسجل ويمكنك المتابعة.`,
      });
      // هنا ممكن تضيف منطق الربط بين المستخدم والشريك
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-arabic">
      <h2 className="text-xl mb-4">ربط مع شريك</h2>
      <Input
        type="email"
        placeholder="بريد الشريك الإلكتروني"
        value={partnerEmail}
        onChange={(e) => setPartnerEmail(e.target.value)}
        className="mb-4 w-full max-w-md"
        dir="ltr"
      />
      <Button onClick={handleCheckPartner} disabled={isLoading}>
        {isLoading ? "جاري التحقق..." : "تحقق من الشريك"}
      </Button>
    </div>
  );
};

export default PartnerLink;
