
import React from 'react';
import { AttendanceTable } from '@/components/Attendance/AttendanceTable';

const Attendance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          گزارش حضور و غیاب
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مشاهده و مدیریت رکوردهای حضور و غیاب کارکنان
        </p>
      </div>
      
      <AttendanceTable />
    </div>
  );
};

export default Attendance;
