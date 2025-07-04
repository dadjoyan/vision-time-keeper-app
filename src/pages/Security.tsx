
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, User, Key, Activity, AlertTriangle, Eye } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { format } from 'date-fns';

const Security: React.FC = () => {
  const { currentUser, setCurrentUser } = useAttendanceStore();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // داده‌های نمونه برای audit log
  const auditLogs = [
    {
      id: '1',
      user: 'مدیر سیستم',
      action: 'تغییر تنظیمات دوربین',
      timestamp: new Date(),
      ip: '192.168.1.100',
      status: 'موفق'
    },
    {
      id: '2',
      user: 'اپراتور1',  
      action: 'حذف کاربر',
      timestamp: new Date(Date.now() - 3600000),
      ip: '192.168.1.101',
      status: 'موفق'
    },
    {
      id: '3',
      user: 'ناشناس',
      action: 'تلاش ورود ناموفق',
      timestamp: new Date(Date.now() - 7200000),
      ip: '192.168.1.150',
      status: 'ناموفق'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // شبیه‌سازی احراز هویت
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setCurrentUser({ name: 'مدیر سیستم', role: 'admin' });
    } else if (loginForm.username === 'operator' && loginForm.password === 'op123') {
      setCurrentUser({ name: 'اپراتور', role: 'operator' });
    } else {
      alert('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">ورود به سیستم</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              لطفاً اطلاعات کاربری خود را وارد کنید
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                ورود
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">حساب‌های نمونه:</p>
              <div className="text-xs space-y-1">
                <div>مدیر: admin / admin123</div>
                <div>اپراتور: operator / op123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          امنیت و کنترل دسترسی
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مدیریت کاربران، نقش‌ها و گزارش فعالیت‌ها
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* اطلاعات کاربر فعلی */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              کاربر فعلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-medium">{currentUser.name}</div>
                <Badge variant="outline" className="text-xs">
                  {currentUser.role === 'admin' ? 'مدیر' : 'اپراتور'}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>آخرین ورود: امروز 14:30</div>
              <div>IP: 192.168.1.100</div>
              <div>مرورگر: Chrome 120.0</div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentUser(null)}
            >
              خروج از سیستم
            </Button>
          </CardContent>
        </Card>

        {/* نقش‌ها و مجوزها */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-green-600" />
              نقش‌ها و مجوزها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">مدیر سیستم</span>
                  <Badge className="bg-red-100 text-red-700">کامل</Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>✓ مدیریت کاربران</div>
                  <div>✓ تغییر تنظیمات</div>
                  <div>✓ مشاهده گزارش‌ها</div>
                  <div>✓ کنترل دوربین</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">اپراتور</span>
                  <Badge variant="outline">محدود</Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>✓ مشاهده گزارش‌ها</div>
                  <div>✓ کنترل دوربین</div>
                  <div>✗ مدیریت کاربران</div>
                  <div>✗ تغییر تنظیمات</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* آمار امنیتی */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              آمار امنیتی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">157</div>
                <div className="text-xs text-gray-500">ورود موفق</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-xs text-gray-500">ورود ناموفق</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-xs text-gray-500">کاربر فعال</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-xs text-gray-500">هشدار امنیتی</div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                2 تلاش ورود مشکوک در 24 ساعت گذشته
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* گزارش فعالیت‌ها (Audit Log) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              گزارش فعالیت‌ها (Audit Log)
            </CardTitle>
            <Button variant="outline" size="sm">
              خروجی کامل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">کاربر</th>
                  <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">عملیات</th>
                  <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">زمان</th>
                  <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">IP</th>
                  <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 font-medium">{log.user}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {format(log.timestamp, 'yyyy/MM/dd HH:mm:ss')}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{log.ip}</td>
                    <td className="p-3">
                      <Badge 
                        variant={log.status === 'موفق' ? 'default' : 'destructive'}
                        className={log.status === 'موفق' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
