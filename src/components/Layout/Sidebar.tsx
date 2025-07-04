
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Users, BarChart3, Settings, Calendar, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAttendanceStore } from '@/stores/attendanceStore';

interface SidebarProps {
  isCollapsed: boolean;
}

const allMenuItems = [
  { path: '/', icon: BarChart3, label: 'داشبورد', color: 'text-blue-600', roles: ['admin', 'operator'] },
  { path: '/live-camera', icon: Camera, label: 'دوربین زنده', color: 'text-green-600', roles: ['admin', 'operator'] },
  { path: '/attendance', icon: Calendar, label: 'گزارش حضور', color: 'text-purple-600', roles: ['admin', 'operator'] },
  { path: '/users', icon: Users, label: 'مدیریت کاربران', color: 'text-orange-600', roles: ['admin'] },
  { path: '/settings', icon: Settings, label: 'تنظیمات', color: 'text-gray-600', roles: ['admin'] },
  { path: '/security', icon: Shield, label: 'امنیت', color: 'text-red-600', roles: ['admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { currentUser } = useAttendanceStore();

  // فیلتر منوها بر اساس نقش کاربر
  const menuItems = allMenuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                تشخیص چهره
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                سیستم حضور و غیاب
              </p>
            </div>
          )}
        </div>

        {/* نمایش اطلاعات کاربر */}
        {!isCollapsed && currentUser && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.role === 'admin' ? 'مدیر' : 'اپراتور'}
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                )
              }
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
