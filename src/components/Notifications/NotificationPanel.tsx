
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, User, Camera, Clock, X } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'unknown_face' | 'system' | 'security' | 'attendance';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity: 'info' | 'warning' | 'error';
}

export const NotificationPanel: React.FC = () => {
  const { attendanceRecords, cameras } = useAttendanceStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // شبیه‌سازی اعلانات چهره‌های ناشناس
  useEffect(() => {
    const generateNotifications = () => {
      const unknownFaceNotifications: Notification[] = [
        {
          id: Date.now().toString() + '1',
          type: 'unknown_face',
          title: 'چهره ناشناس شناسایی شد',
          message: 'یک چهره ناشناس در دوربین ورودی شناسایی شد',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false,
          severity: 'warning'
        },
        {
          id: Date.now().toString() + '2',
          type: 'unknown_face',
          title: 'چهره ناشناس شناسایی شد',
          message: 'یک چهره ناشناس در دوربین خروجی شناسایی شد',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          severity: 'warning'
        },
        {
          id: Date.now().toString() + '3',
          type: 'security',
          title: 'تلاش ورود مشکوک',
          message: 'تلاش چندین باره برای ورود توسط چهره ناشناس',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          severity: 'error'
        },
        {
          id: Date.now().toString() + '4',
          type: 'system',
          title: 'دوربین آفلاین',
          message: 'دوربین شماره ۲ از شبکه قطع شده است',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          isRead: true,
          severity: 'error'
        },
        {
          id: Date.now().toString() + '5',
          type: 'attendance',
          title: 'گزارش حضور و غیاب',
          message: 'گزارش روزانه حضور و غیاب آماده است',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isRead: true,
          severity: 'info'
        }
      ];

      setNotifications(unknownFaceNotifications);
      const unread = unknownFaceNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    };

    generateNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'unknown_face':
        return <User className="w-4 h-4" />;
      case 'security':
        return <AlertTriangle className="w-4 h-4" />;
      case 'system':
        return <Camera className="w-4 h-4" />;
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              اعلانات
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                علامت‌گذاری همه به‌عنوان خوانده‌شده
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${getSeverityColor(notification.severity)} ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <CardTitle className="text-sm font-medium">
                        {notification.title}
                      </CardTitle>
                      {!notification.isRead && (
                        <Badge variant="default" className="text-xs">جدید</Badge>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {format(notification.timestamp, 'HH:mm - dd/MM/yyyy')}
                    </span>
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs"
                      >
                        علامت‌گذاری به‌عنوان خوانده‌شده
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <p>هیچ اعلانی وجود ندارد</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
