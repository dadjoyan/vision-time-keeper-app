import React from 'react';
import { RoleGuard } from '@/components/Auth/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAttendanceStore, User } from '@/stores/attendanceStore';
import { Plus, Edit, Trash2, User as UserIcon } from 'lucide-react';

const Users: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAttendanceStore();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [role, setRole] = React.useState('operator');
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleAddUser = () => {
    addUser({ name, employeeId, role, photos: [] });
    setOpen(false);
    setName('');
    setEmployeeId('');
    setRole('operator');
    setPhotos([]);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, { name, employeeId, role, photos });
      setOpen(false);
      setName('');
      setEmployeeId('');
      setRole('operator');
      setPhotos([]);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmployeeId(user.employeeId);
    setRole(user.role);
    setPhotos(user.photos);
    setOpen(true);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            مدیریت کاربران
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            افزودن، ویرایش و حذف کاربران سیستم
          </p>
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>لیست کاربران</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن کاربر جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      نام و نام خانوادگی
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employeeId" className="text-right">
                      شماره پرسنلی
                    </Label>
                    <Input
                      type="text"
                      id="employeeId"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      نقش
                    </Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="operator">اپراتور</option>
                      <option value="admin">مدیر</option>
                    </select>
                  </div>
                </div>
                <Button onClick={selectedUser ? handleUpdateUser : handleAddUser}>
                  {selectedUser ? 'ذخیره تغییرات' : 'افزودن کاربر'}
                </Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام</TableHead>
                    <TableHead className="text-right">شماره پرسنلی</TableHead>
                    <TableHead className="text-right">نقش</TableHead>
                    <TableHead className="text-center">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-right">{user.name}</TableCell>
                      <TableCell className="text-right">{user.employeeId}</TableCell>
                      <TableCell className="text-right">{user.role === 'admin' ? 'مدیر' : 'اپراتور'}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default Users;
