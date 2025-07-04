
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Maximize, Settings, AlertCircle } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Badge } from '@/components/ui/badge';

interface CameraViewProps {
  camera: {
    id: string;
    name: string;
    source: 'usb' | 'ip';
    ipAddress?: string;
    resolution: '720p' | '1080p';
    frameRate: number;
    confidenceThreshold: number;
    purpose: 'entry' | 'exit' | 'both';
    isActive: boolean;
  };
}

const SingleCameraView: React.FC<CameraViewProps> = ({ camera }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isPlaying, setIsPlaying] = useState(camera.isActive);
  const [detectedFaces, setDetectedFaces] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    confidence: number;
  }>>([]);
  
  const { addAttendanceRecord, users } = useAttendanceStore();

  // شبیه‌سازی تشخیص چهره برای هر دوربین
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && users.length > 0 && camera.isActive) {
        // شبیه‌سازی تشخیص تصادفی چهره
        if (Math.random() > 0.8) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const confidence = 0.8 + Math.random() * 0.15;
          
          setDetectedFaces([{
            x: 50 + Math.random() * 100,
            y: 30 + Math.random() * 80,
            width: 80,
            height: 100,
            name: randomUser.name,
            confidence: confidence
          }]);

          // ثبت رکورد حضور
          if (confidence >= camera.confidenceThreshold) {
            const recordType = camera.purpose === 'both' 
              ? (Math.random() > 0.5 ? 'entry' : 'exit')
              : camera.purpose;
              
            addAttendanceRecord({
              userId: randomUser.id,
              userName: randomUser.name,
              userPhoto: randomUser.photos[0] || '/placeholder.svg',
              timestamp: new Date(),
              type: recordType,
              confidence: confidence
            });
          }
        } else {
          setDetectedFaces([]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, users, camera, addAttendanceRecord]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    const element = webcamRef.current?.video;
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen();
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying && camera.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <CardTitle className="text-sm">{camera.name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {camera.purpose === 'entry' ? 'ورود' : camera.purpose === 'exit' ? 'خروج' : 'ورود/خروج'}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {!camera.isActive ? (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">دوربین غیرفعال</p>
              </div>
            </div>
          ) : isPlaying ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-full object-cover"
              videoConstraints={{
                width: camera.resolution === '1080p' ? 1920 : 1280,
                height: camera.resolution === '1080p' ? 1080 : 720,
                frameRate: camera.frameRate
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Pause className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">متوقف شده</p>
              </div>
            </div>
          )}
          
          {/* نمایش کادرهای تشخیص چهره */}
          {detectedFaces.map((face, index) => (
            <div
              key={index}
              className="absolute border-2 border-green-400"
              style={{
                left: face.x,
                top: face.y,
                width: face.width,
                height: face.height,
              }}
            >
              <div className="absolute -bottom-6 left-0 bg-green-400 text-black px-1 py-0.5 rounded text-xs font-medium">
                {face.name} ({Math.round(face.confidence * 100)}%)
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>{camera.resolution}</div>
          <div>{Math.round(camera.confidenceThreshold * 100)}%</div>
          <div>{camera.source === 'usb' ? 'USB' : 'IP'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MultiCameraView: React.FC = () => {
  const { cameras } = useAttendanceStore();

  if (cameras.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">هیچ دوربینی پیکربندی نشده</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            برای شروع، لطفاً از بخش تنظیمات دوربین اضافه کنید
          </p>
          <Button variant="outline">
            رفتن به تنظیمات
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <SingleCameraView key={camera.id} camera={camera} />
      ))}
    </div>
  );
};
