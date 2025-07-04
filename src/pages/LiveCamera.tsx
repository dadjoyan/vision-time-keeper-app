
import React from 'react';
import { MultiCameraView } from '@/components/LiveCamera/MultiCameraView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { format } from 'date-fns';

const LiveCamera: React.FC = () => {
  const { attendanceRecords, cameras } = useAttendanceStore();
  
  // آخرین 5 رکورد
  const recentRecords = attendanceRecords
    .slice(0, 8)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // آمار دوربین‌ها
  const activeCameras = cameras.filter(c => c.isActive).length;
  const totalCameras = cameras.length;

  return (
    <div className="space-y-6">
      {/* نمایش دوربین‌ها */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">نمایش زنده دوربین‌ها</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>دوربین‌های فعال:</span>
            <Badge variant="outline">{activeCameras} از {totalCameras}</Badge>
          </div>
        </div>
        <MultiCameraView />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* لیست آخرین تشخیص‌ها */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>آخرین تشخیص‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={record.userPhoto}
                      alt={record.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{record.userName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(record.timestamp), 'HH:mm:ss')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge 
                        variant={record.type === 'entry' ? 'default' : 'secondary'}
                        className={`text-xs ${record.type === 'entry' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {record.type === 'entry' ? 'ورود' : 'خروج'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {Math.round(record.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  هنوز هیچ تشخیصی انجام نشده
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* آمار زنده */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {attendanceRecords.filter(r => r.type === 'entry').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  کل ورودی‌ها
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {attendanceRecords.filter(r => r.type === 'exit').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  کل خروجی‌ها
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {recentRecords.length > 0 
                    ? Math.round(recentRecords.reduce((acc, r) => acc + r.confidence, 0) / recentRecords.length * 100)
                    : 0
                  }%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  میانگین اطمینان
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {activeCameras}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  دوربین فعال
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {cameras.filter(c => c.purpose === 'entry').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  دوربین ورودی
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {cameras.filter(c => c.purpose === 'exit').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  دوربین خروجی
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveCamera;
