
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Maximize, Settings } from 'lucide-react';
import { useAttendanceStore } from '@/stores/attendanceStore';

export const CameraView: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    confidence: number;
  }>>([]);
  
  const { cameraSettings, addAttendanceRecord, users } = useAttendanceStore();

  // شبیه‌سازی تشخیص چهره
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && users.length > 0) {
        // شبیه‌سازی تشخیص تصادفی چهره
        if (Math.random() > 0.7) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const confidence = 0.8 + Math.random() * 0.15;
          
          setDetectedFaces([{
            x: 100 + Math.random() * 200,
            y: 50 + Math.random() * 150,
            width: 120,
            height: 150,
            name: randomUser.name,
            confidence: confidence
          }]);

          // ثبت رکورد حضور
          if (confidence >= cameraSettings.confidenceThreshold) {
            addAttendanceRecord({
              userId: randomUser.id,
              userName: randomUser.name,
              userPhoto: randomUser.photos[0] || '/placeholder.svg',
              timestamp: new Date(),
              type: Math.random() > 0.5 ? 'entry' : 'exit',
              confidence: confidence
            });
          }
        } else {
          setDetectedFaces([]);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, users, cameraSettings.confidenceThreshold, addAttendanceRecord]);

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          نمایش زنده دوربین
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {isPlaying ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              className="w-full h-full object-cover"
              videoConstraints={{
                width: cameraSettings.resolution === '1080p' ? 1920 : 1280,
                height: cameraSettings.resolution === '1080p' ? 1080 : 720,
                frameRate: cameraSettings.frameRate
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Pause className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>دوربین متوقف شده</p>
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
              <div className="absolute -bottom-8 left-0 bg-green-400 text-black px-2 py-1 rounded text-xs font-medium">
                {face.name} ({Math.round(face.confidence * 100)}%)
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>رزولوشن: {cameraSettings.resolution}</div>
          <div>آستانه اطمینان: {Math.round(cameraSettings.confidenceThreshold * 100)}%</div>
          <div>منبع: {cameraSettings.source === 'usb' ? 'USB' : 'IP'}</div>
        </div>
      </CardContent>
    </Card>
  );
};
