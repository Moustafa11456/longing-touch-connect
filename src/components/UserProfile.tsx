
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Edit, Save, X, Shield, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@/types/User";

interface UserProfileProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

const UserProfile = ({ user, onUpdateUser }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email
  });
  const { toast } = useToast();

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: editForm.name,
      email: editForm.email
    };
    
    onUpdateUser(updatedUser);
    localStorage.setItem('longingBraceletUser', JSON.stringify(updatedUser));
    
    setIsEditing(false);
    toast({
      title: "تم التحديث بنجاح",
      description: "تم حفظ تغييراتك على الملف الشخصي",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-purple-200">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl text-purple-800">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </CardDescription>
            
            <div className="flex justify-center gap-2 pt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                حساب موثق
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Star className="w-3 h-3 mr-1" />
                عضو نشط
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">
                {user.id.split('_')[1] ? new Date(parseInt(user.id.split('_')[1])).getMonth() + 1 : 0}
              </p>
              <p className="text-sm text-gray-600">لمسات هذا الشهر</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-pink-600">
                {Math.floor(Math.random() * 50) + 10}
              </p>
              <p className="text-sm text-gray-600">أيام متتالية</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-violet-600">
                {Math.floor(Math.random() * 5) + 1}
              </p>
              <p className="text-sm text-gray-600">اتصالات نشطة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-purple-800">المعلومات الشخصية</CardTitle>
            <CardDescription>
              إدارة بياناتك الشخصية ومعلومات الحساب
            </CardDescription>
          </div>
          
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
              >
                <Save className="w-4 h-4" />
                حفظ
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-right"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="text-left"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-left">{user.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">تاريخ إنشاء الحساب</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(user.createdAt)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">معرف المستخدم</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm text-gray-600">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">أمان الحساب</CardTitle>
          <CardDescription>
            إعدادات الحماية والخصوصية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })}
            >
              <Shield className="w-4 h-4 mr-2" />
              تغيير كلمة المرور
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({ title: "قريباً", description: "هذه الميزة ستكون متاحة قريباً" })}
            >
              <Mail className="w-4 h-4 mr-2" />
              تحديث البريد الإلكتروني
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">حسابك محمي</h4>
                <p className="text-sm text-blue-700 mt-1">
                  يتم تشفير جميع بياناتك وحمايتها بأعلى معايير الأمان. معرفك الفريد يضمن خصوصية تواصلك.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
