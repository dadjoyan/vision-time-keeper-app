
import React from 'react';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { NotificationPanel } from '@/components/Notifications/NotificationPanel';
import { UserProfile } from '@/components/Profile/UserProfile';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, darkMode, toggleDarkMode, setCurrentUser } = useAttendanceStore();
  const currentTime = new Date().toLocaleString('fa-IR');

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentTime}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationPanel />

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <span className="hidden md:inline text-sm">
                {currentUser?.name || 'کاربر مهمان'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <UserProfile />
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              خروج از سیستم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
