
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Edit, Trash2, Camera, Upload } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { format } from 'date-fns';

const Users: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAttendanceStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    role: '',
    photos: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
    } else {
      addUser(formData);
      setIsAddDialogOpen(false);
    }
    
    setFormData({ name: '', employeeId: '', role: '', photos: [] });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      employeeId: user.employeeId,
      role: user.role,
      photos: user.photos
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 5) // حداکثر 5 عکس
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            مدیریت کاربران
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            افزودن، ویرایش و حذف کاربران سیستم
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              افزودن کاربر
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>افزودن کاربر جدید</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">نام کامل</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employeeId">شناسه کاربری</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role">سمت / نقش</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label>عکس‌های چهره</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button type="button" variant="outline" className="w-full" asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        بارگذاری عکس (حداکثر 5 عکس)
                      </div>
                    </Button>
                  </label>
                </div>
                
                {formData.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`عکس ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">ثبت</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  لغو
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* لیست کاربران */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.photos[0]} />
                  <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user.role}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">ID: {user.employeeId}</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                ثبت شده در: {format(new Date(user.createdAt), 'yyyy/MM/dd')}
              </div>
              
              {user.photos.length > 1 && (
                <div className="flex gap-1 mb-4">
                  {user.photos.slice(1, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`عکس ${index + 2}`}
                      className="w-8 h-8 object-cover rounded border"
                    />
                  ))}
                  {user.photos.length > 4 && (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center text-xs">
                      +{user.photos.length - 4}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(user)}>
                      <Edit className="w-4 h-4 mr-1" />
                      ویرایش
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>ویرایش کاربر</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">نام کامل</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-employeeId">شناسه کاربری</Label>
                        <Input
                          id="edit-employeeId"
                          value={formData.employeeId}
                          onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-role">سمت / نقش</Label>
                        <Input
                          id="edit-role"
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1">ذخیره</Button>
                        <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                          لغو
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف کاربر "{user.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>لغو</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              هیچ کاربری ثبت نشده
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              برای شروع، اولین کاربر را اضافه کنید
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              افزودن کاربر
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
