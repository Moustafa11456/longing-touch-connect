
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Edit3, Save, Heart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/User";
import PartnerSetup from "./PartnerSetup";

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const UserProfile = ({ user, onUpdateUser }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    const updatedUser = { ...user, name: editedName };
    onUpdateUser(updatedUser);
    localStorage.setItem('longingBraceletUser', JSON.stringify(updatedUser));
    setIsEditing(false);
    
    toast({
      title: "تم الحفظ",
      description: "تم تحديث الملف الشخصي بنجاح",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
          <TabsTrigger value="profile" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <UserIcon className="w-4 h-4 mr-2" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="partner" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            الشريك
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-white/60 backdrop-blur-sm border-red-200">
            <CardHeader>
              <CardTitle className="text-right text-red-800">الملف الشخصي</CardTitle>
              <CardDescription className="text-right">
                إدارة معلوماتك الشخصية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Section */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block">الاسم</Label>
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-right"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-right">
                      {user.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">البريد الإلكتروني</Label>
                  <div className="p-3 bg-gray-50 rounded-md text-right" dir="ltr">
                    {user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">تاريخ التسجيل</Label>
                  <div className="p-3 bg-gray-50 rounded-md text-right">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      حفظ التغييرات
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user.name);
                      }}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    تعديل الملف الشخصي
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-white/60 backdrop-blur-sm border-red-200">
            <CardHeader>
              <CardTitle className="text-right text-red-800">إحصائيات الاشتياق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {user.touchesSent || 0}
                  </div>
                  <div className="text-sm text-red-700">لمسات مُرسلة</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {user.touchesReceived || 0}
                  </div>
                  <div className="text-sm text-red-700">لمسات مُستقبلة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partner">
          <PartnerSetup user={user} onUpdateUser={onUpdateUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
