
import React from 'react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'operator')[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { currentUser } = useAttendanceStore();

  if (!currentUser) {
    return null;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return fallback || (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <h3 className="text-lg font-medium mb-2">دسترسی محدود</h3>
          <p className="text-gray-600 dark:text-gray-400">
            شما به این بخش دسترسی ندارید
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
