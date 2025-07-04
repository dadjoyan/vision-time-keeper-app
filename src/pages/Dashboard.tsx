
import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, UserCheck, UserX, Activity, TrendingUp, Clock } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { format, startOfDay, endOfDay, subDays, isToday } from 'date-fns';

const Dashboard: React.FC = () => {
  const { attendanceRecords, users } = useAttendanceStore();

  // محاسبه آمار روزانه
  const today = new Date();
  const todayRecords = attendanceRecords.filter(record => 
    isToday(new Date(record.timestamp))
  );
  
  const todayEntries = todayRecords.filter(r => r.type === 'entry').length;
  const todayExits = todayRecords.filter(r => r.type === 'exit').length;

  // داده‌های نمودار خطی (7 روز گذشته)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dayRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startOfDay(date) && recordDate <= endOfDay(date);
    });
    
    return {
      date: format(date, 'MM/dd'),
      entries: dayRecords.filter(r => r.type === 'entry').length,
      exits: dayRecords.filter(r => r.type === 'exit').length,
    };
  });

  // داده‌های نمودار دایره‌ای
  const pieData = [
    { name: 'ورود', value: todayEntries, color: '#10B981' },
    { name: 'خروج', value: todayExits, color: '#EF4444' },
  ];

  // داده‌های نمودار ستونی (ساعات پرتردد)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourRecords = todayRecords.filter(record => {
      const recordHour = new Date(record.timestamp).getHours();
      return recordHour === hour;
    });
    
    return {
      hour: `${hour}:00`,
      count: hourRecords.length,
    };
  }).filter(data => data.count > 0);

  return (
    <div className="space-y-6">
      {/* آمار کلیدی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="ورود امروز"
          value={todayEntries}
          icon={UserCheck}
          trend={{ value: 12, isPositive: true }}
          colorClass="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatsCard
          title="خروج امروز"
          value={todayExits}
          icon={UserX}
          trend={{ value: 5, isPositive: false }}
          colorClass="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatsCard
          title="کل کاربران"
          value={users.length}
          icon={Users}
          colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatsCard
          title="میانگین حضور"
          value="7.5 ساعت"
          icon={Clock}
          trend={{ value: 8, isPositive: true }}
          colorClass="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار خطی تردد هفتگی */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              تردد هفته گذشته
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="entries" stroke="#10B981" strokeWidth={2} name="ورود" />
                  <Line type="monotone" dataKey="exits" stroke="#EF4444" strokeWidth={2} name="خروج" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* نمودار دایره‌ای */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              توزیع تردد امروز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نمودار ساعات پرتردد */}
      {hourlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ساعات پرتردد امروز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
