
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Camera, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAttendanceStore, Camera as CameraType } from '@/stores/attendanceStore';

const CameraConfiguration: React.FC = () => {
  const { cameras, addCamera, updateCamera, deleteCamera } = useAttendanceStore();
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraType | null>(null);
  const [newCamera, setNewCamera] = useState<Omit<CameraType, 'id'>>({
    name: '',
    source: 'usb',
    resolution: '720p',
    frameRate: 30,
    confidenceThreshold: 0.8,
    purpose: 'both',
    isActive: true
  });

  const handleAddCamera = () => {
    if (newCamera.name.trim()) {
      addCamera(newCamera);
      setNewCamera({
        name: '',
        source: 'usb',
        resolution: '720p',
        frameRate: 30,
        confidenceThreshold: 0.8,
        purpose: 'both',
        isActive: true
      });
      setIsAddingCamera(false);
    }
  };

  const handleEditCamera = (camera: CameraType) => {
    setEditingCamera(camera);
  };

  const handleUpdateCamera = () => {
    if (editingCamera) {
      updateCamera(editingCamera.id, editingCamera);
      setEditingCamera(null);
    }
  };

  const handleDeleteCamera = (id: string) => {
    deleteCamera(id);
  };

  const toggleCameraStatus = (id: string, isActive: boolean) => {
    updateCamera(id, { isActive });
  };

  const getPurposeText = (purpose: string) => {
    switch (purpose) {
      case 'entry': return 'ورود';
      case 'exit': return 'خروج';
      case 'both': return 'ورود و خروج';
      default: return purpose;
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'entry': return 'bg-green-100 text-green-700';
      case 'exit': return 'bg-red-100 text-red-700';
      case 'both': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            پیکربندی دوربین‌ها
          </CardTitle>
          <Dialog open={isAddingCamera} onOpenChange={setIsAddingCamera}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                افزودن دوربین
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>افزودن دوربین جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="camera-name">نام دوربین</Label>
                  <Input
                    id="camera-name"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    placeholder="مثال: دوربین ورود اصلی"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>منبع دوربین</Label>
                  <Select
                    value={newCamera.source}
                    onValueChange={(value: 'usb' | 'ip') => 
                      setNewCamera({ ...newCamera, source: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usb">دوربین USB</SelectItem>
                      <SelectItem value="ip">دوربین IP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newCamera.source === 'ip' && (
                  <div>
                    <Label htmlFor="ip-address">آدرس IP دوربین</Label>
                    <Input
                      id="ip-address"
                      value={newCamera.ipAddress || ''}
                      onChange={(e) => setNewCamera({ ...newCamera, ipAddress: e.target.value })}
                      placeholder="192.168.1.100"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>هدف دوربین</Label>
                  <Select
                    value={newCamera.purpose}
                    onValueChange={(value: 'entry' | 'exit' | 'both') => 
                      setNewCamera({ ...newCamera, purpose: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">ثبت ورود</SelectItem>
                      <SelectItem value="exit">ثبت خروج</SelectItem>
                      <SelectItem value="both">ورود و خروج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>کیفیت ویدیو</Label>
                  <Select
                    value={newCamera.resolution}
                    onValueChange={(value: '720p' | '1080p') => 
                      setNewCamera({ ...newCamera, resolution: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نرخ فریم (FPS): {newCamera.frameRate}</Label>
                  <Slider
                    value={[newCamera.frameRate]}
                    onValueChange={(value) => setNewCamera({ ...newCamera, frameRate: value[0] })}
                    max={60}
                    min={15}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>حداقل درصد اطمینان: {Math.round(newCamera.confidenceThreshold * 100)}%</Label>
                  <Slider
                    value={[newCamera.confidenceThreshold * 100]}
                    onValueChange={(value) => setNewCamera({ ...newCamera, confidenceThreshold: value[0] / 100 })}
                    max={100}
                    min={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddCamera} className="flex-1">
                    افزودن دوربین
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingCamera(false)} className="flex-1">
                    لغو
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {cameras.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            هیچ دوربینی پیکربندی نشده است
          </div>
        ) : (
          <div className="space-y-4">
            {cameras.map((camera) => (
              <div key={camera.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${camera.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h3 className="font-medium">{camera.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPurposeColor(camera.purpose)}`}>
                      {getPurposeText(camera.purpose)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCameraStatus(camera.id, !camera.isActive)}
                    >
                      {camera.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCamera(camera)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف دوربین</AlertDialogTitle>
                          <AlertDialogDescription>
                            آیا مطمئن هستید که می‌خواهید دوربین "{camera.name}" را حذف کنید؟
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>لغو</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCamera(camera.id)}>
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>منبع: {camera.source === 'usb' ? 'USB' : 'IP'}</div>
                  <div>رزولوشن: {camera.resolution}</div>
                  <div>FPS: {camera.frameRate}</div>
                  <div>اطمینان: {Math.round(camera.confidenceThreshold * 100)}%</div>
                </div>
                
                {camera.source === 'ip' && camera.ipAddress && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    آدرس IP: {camera.ipAddress}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Camera Dialog */}
        <Dialog open={!!editingCamera} onOpenChange={() => setEditingCamera(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ویرایش دوربین</DialogTitle>
            </DialogHeader>
            {editingCamera && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-camera-name">نام دوربین</Label>
                  <Input
                    id="edit-camera-name"
                    value={editingCamera.name}
                    onChange={(e) => setEditingCamera({ ...editingCamera, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>منبع دوربین</Label>
                  <Select
                    value={editingCamera.source}
                    onValueChange={(value: 'usb' | 'ip') => 
                      setEditingCamera({ ...editingCamera, source: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usb">دوربین USB</SelectItem>
                      <SelectItem value="ip">دوربین IP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingCamera.source === 'ip' && (
                  <div>
                    <Label htmlFor="edit-ip-address">آدرس IP دوربین</Label>
                    <Input
                      id="edit-ip-address"
                      value={editingCamera.ipAddress || ''}
                      onChange={(e) => setEditingCamera({ ...editingCamera, ipAddress: e.target.value })}
                      placeholder="192.168.1.100"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>هدف دوربین</Label>
                  <Select
                    value={editingCamera.purpose}
                    onValueChange={(value: 'entry' | 'exit' | 'both') => 
                      setEditingCamera({ ...editingCamera, purpose: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">ثبت ورود</SelectItem>
                      <SelectItem value="exit">ثبت خروج</SelectItem>
                      <SelectItem value="both">ورود و خروج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>کیفیت ویدیو</Label>
                  <Select
                    value={editingCamera.resolution}
                    onValueChange={(value: '720p' | '1080p') => 
                      setEditingCamera({ ...editingCamera, resolution: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نرخ فریم (FPS): {editingCamera.frameRate}</Label>
                  <Slider
                    value={[editingCamera.frameRate]}
                    onValueChange={(value) => setEditingCamera({ ...editingCamera, frameRate: value[0] })}
                    max={60}
                    min={15}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>حداقل درصد اطمینان: {Math.round(editingCamera.confidenceThreshold * 100)}%</Label>
                  <Slider
                    value={[editingCamera.confidenceThreshold * 100]}
                    onValueChange={(value) => setEditingCamera({ ...editingCamera, confidenceThreshold: value[0] / 100 })}
                    max={100}
                    min={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateCamera} className="flex-1">
                    ذخیره تغییرات
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCamera(null)} className="flex-1">
                    لغو
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CameraConfiguration;
