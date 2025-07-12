
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Lock, Edit, Save, X } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { toast } from '@/hooks/use-toast';

export const UserProfile: React.FC = () => {
  const { currentUser, setCurrentUser } = useAttendanceStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleNameChange = () => {
    if (newName.trim() === '') {
      toast({ title: 'خطا', description: 'نام کاربری نمی‌تواند خالی باشد' });
      return;
    }
    
    if (currentUser) {
      setCurrentUser({ ...currentUser, name: newName });
      toast({ title: 'موفق', description: 'نام کاربری با موفقیت تغییر یافت' });
      setIsEditingName(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordForm.currentPassword === '' || passwordForm.newPassword === '' || passwordForm.confirmPassword === '') {
      toast({ title: 'خطا', description: 'تمام فیلدها باید پر شوند' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'خطا', description: 'رمز عبور جدید و تأیید آن یکسان نیست' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({ title: 'خطا', description: 'رمز عبور باید حداقل ۶ کاراکتر باشد' });
      return;
    }

    // شبیه‌سازی تغییر رمز عبور
    toast({ title: 'موفق', description: 'رمز عبور با موفقیت تغییر یافت' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsEditingPassword(false);
  };

  if (!currentUser) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          پروفایل کاربری
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            پروفایل کاربری
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* نام کاربری */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">نام کاربری</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditingName ? (
                <div className="flex gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="نام کاربری جدید"
                  />
                  <Button size="sm" onClick={handleNameChange}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsEditingName(false);
                    setNewName(currentUser.name);
                  }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currentUser.name}</span>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingName(true)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* نقش کاربری */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">نقش کاربری</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {currentUser.role === 'admin' ? 'مدیر سیستم' : 'اپراتور'}
              </span>
            </CardContent>
          </Card>

          {/* تغییر رمز عبور */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">رمز عبور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isEditingPassword ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingPassword(true)}
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  تغییر رمز عبور
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current-password">رمز عبور فعلی</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="رمز عبور فعلی"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">رمز عبور جدید</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="رمز عبور جدید"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">تأیید رمز عبور جدید</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="تأیید رمز عبور جدید"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePasswordChange} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      ذخیره
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      انصراف
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
