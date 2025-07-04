
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Download, Calendar, ArrowUpDown } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const AttendanceTable: React.FC = () => {
  const { attendanceRecords } = useAttendanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'timestamp' | 'userName'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = attendanceRecords.filter(record =>
      record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userId.includes(searchTerm)
    );

    filtered.sort((a, b) => {
      const aValue = sortField === 'timestamp' ? new Date(a.timestamp).getTime() : a.userName;
      const bValue = sortField === 'timestamp' ? new Date(b.timestamp).getTime() : b.userName;
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [attendanceRecords, searchTerm, sortField, sortOrder]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredAndSortedRecords.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredAndSortedRecords, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / recordsPerPage);

  const handleSort = (field: 'timestamp' | 'userName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportToExcel = () => {
    const exportData = filteredAndSortedRecords.map(record => ({
      'نام': record.userName,
      'شناسه کاربری': record.userId,
      'تاریخ و زمان': format(new Date(record.timestamp), 'yyyy/MM/dd HH:mm:ss'),
      'نوع': record.type === 'entry' ? 'ورود' : 'خروج',
      'درصد اطمینان': `${Math.round(record.confidence * 100)}%`
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش حضور');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>گزارش حضور و غیاب</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              خروجی Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">
                  عکس
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('userName')}
                >
                  <div className="flex items-center gap-1">
                    نام کامل
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">
                  شناسه
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    زمان رویداد
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">
                  نوع
                </th>
                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-400">
                  اطمینان
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={record.userPhoto} />
                      <AvatarFallback>{record.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-3 font-medium">{record.userName}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{record.userId}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {format(new Date(record.timestamp), 'yyyy/MM/dd HH:mm')}
                  </td>
                  <td className="p-3">
                    <Badge 
                      variant={record.type === 'entry' ? 'default' : 'secondary'}
                      className={record.type === 'entry' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    >
                      {record.type === 'entry' ? 'ورود' : 'خروج'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-medium">
                      {Math.round(record.confidence * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              قبلی
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              صفحه {currentPage} از {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              بعدی
            </Button>
          </div>
        )}

        {paginatedRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            هیچ رکوردی یافت نشد
          </div>
        )}
      </CardContent>
    </Card>
  );
};
