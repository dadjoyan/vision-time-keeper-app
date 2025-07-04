import React from 'react';
import { RoleGuard } from '@/components/Auth/RoleGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Camera, Settings as SettingsIcon, Upload, Download } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import CameraConfiguration from '@/components/CameraConfiguration';

const Settings: React.FC = () => {
  const { cameraSettings, updateCameraSettings } = useAttendanceStore();

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Model uploaded:', file.name);
      // در اینجا منطق آپلود مدل قرار می‌گیرد
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            تنظیمات سیستم
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            پیکربندی دوربین، مدل‌های تشخیص چهره و سایر تنظیمات
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* پیکربندی دوربین‌ها */}
          <CameraConfiguration />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* تنظیمات دوربین قدیمی - برای سازگاری با عقب */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  تنظیمات دوربین کلی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>منبع دوربین پیش‌فرض</Label>
                  <Select
                    value={cameraSettings.source}
                    onValueChange={(value: 'usb' | 'ip') => 
                      updateCameraSettings({ source: value })
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

                {cameraSettings.source === 'ip' && (
                  <div>
                    <Label htmlFor="ip-address">آدرس IP دوربین</Label>
                    <Input
                      id="ip-address"
                      value={cameraSettings.ipAddress || ''}
                      onChange={(e) => updateCameraSettings({ ipAddress: e.target.value })}
                      placeholder="192.168.1.100"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>کیفیت ویدیو پیش‌فرض</Label>
                  <Select
                    value={cameraSettings.resolution}
                    onValueChange={(value: '720p' | '1080p') => 
                      updateCameraSettings({ resolution: value })
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
                  <Label>نرخ فریم (FPS): {cameraSettings.frameRate}</Label>
                  <Slider
                    value={[cameraSettings.frameRate]}
                    onValueChange={(value) => updateCameraSettings({ frameRate: value[0] })}
                    max={60}
                    min={15}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>حداقل درصد اطمینان: {Math.round(cameraSettings.confidenceThreshold * 100)}%</Label>
                  <Slider
                    value={[cameraSettings.confidenceThreshold * 100]}
                    onValueChange={(value) => updateCameraSettings({ confidenceThreshold: value[0] / 100 })}
                    max={100}
                    min={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <Button className="w-full">
                  تست دوربین
                </Button>
              </CardContent>
            </Card>

            {/* تنظیمات مدل */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-green-600" />
                  مدل تشخیص چهره
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>مدل فعلی</Label>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">QM-5min-optimized.onnx</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      آخرین بروزرسانی: 2024/01/15
                    </div>
                  </div>
                </div>

                <div>
                  <Label>بارگذاری مدل جدید</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".onnx,.pb,.h5"
                      onChange={handleModelUpload}
                      className="hidden"
                      id="model-upload"
                    />
                    <label htmlFor="model-upload">
                      <Button variant="outline" className="w-full" asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          انتخاب فایل مدل (.onnx, .pb, .h5)
                        </div>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    فرمت‌های پشتیبانی شده: ONNX, TensorFlow, Keras
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>پیش‌پردازش</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">نرمال‌سازی</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">تشخیص لبه</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>بهینه‌سازی</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">GPU شتاب</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">کش حافظه</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    تست مدل
                  </Button>
                  <Button>
                    اعمال تغییرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* تنظیمات سیستم */}
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات عمومی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>پشتیبان‌گیری خودکار</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      پشتیبان‌گیری روزانه از داده‌ها
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>اعلان‌های صوتی</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      پخش صدا هنگام تشخیص چهره
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>ذخیره عکس‌های ناشناس</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ذخیره چهره‌های تشخیص نشده
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>مدت زمان نگهداری لاگ‌ها (روز)</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                    min="1"
                    max="365"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    پشتیبان‌گیری
                  </Button>
                  <Button variant="destructive">
                    پاک‌سازی داده‌ها
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* اطلاعات سیستم */}
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات سیستم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">نسخه نرم‌افزار</Label>
                    <div className="font-medium">v2.1.0</div>
                  </div>
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">آخرین بروزرسانی</Label>
                    <div className="font-medium">2024/01/15</div>
                  </div>
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">وضعیت سیستم</Label>
                    <div className="font-medium text-green-600">عملکرد طبیعی</div>
                  </div>
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">مصرف حافظه</Label>
                    <div className="font-medium">245 MB</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  بررسی بروزرسانی
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Settings;
