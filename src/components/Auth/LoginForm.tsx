
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Lock, AlertCircle } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';

export const LoginForm: React.FC = () => {
  const { setCurrentUser } = useAttendanceStore();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // شبیه‌سازی تأخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // شبیه‌سازی احراز هویت
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setCurrentUser({ name: 'مدیر سیستم', role: 'admin' });
    } else if (loginForm.username === 'operator' && loginForm.password === 'op123') {
      setCurrentUser({ name: 'اپراتور', role: 'operator' });
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
    
    setIsLogging(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            سیستم تشخیص چهره
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            سیستم حضور و غیاب هوشمند
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                نام کاربری
              </Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="نام کاربری خود را وارد کنید"
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                رمز عبور
              </Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="رمز عبور خود را وارد کنید"
                required
                className="h-12"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ورود...' : 'ورود به سیستم'}
            </Button>
          </form>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">حساب‌های نمونه:</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <span className="font-medium">مدیر سیستم:</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">admin / admin123</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                <span className="font-medium">اپراتور:</span>
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">operator / op123</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
