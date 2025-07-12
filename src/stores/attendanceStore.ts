
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  timestamp: Date;
  type: 'entry' | 'exit';
  confidence: number;
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  photos: string[];
  createdAt: Date;
}

export interface CameraSettings {
  source: 'usb' | 'ip';
  ipAddress?: string;
  resolution: '720p' | '1080p';
  frameRate: number;
  confidenceThreshold: number;
}

interface AttendanceState {
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Attendance Records
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  
  // Camera Settings
  cameraSettings: CameraSettings;
  updateCameraSettings: (settings: Partial<CameraSettings>) => void;

  // UI State
  currentUser: { name: string; role: 'operator' | 'admin' } | null;
  setCurrentUser: (user: { name: string; role: 'operator' | 'admin' } | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      attendanceRecords: [],
      cameraSettings: {
        source: 'usb',
        resolution: '720p',
        frameRate: 30,
        confidenceThreshold: 0.8,
      },
      currentUser: null,
      darkMode: false,

      // User management
      addUser: (user) => set((state) => ({
        users: [...state.users, {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date(),
        }]
      })),

      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      })),

      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),

      // Attendance management
      addAttendanceRecord: (record) => set((state) => ({
        attendanceRecords: [{
          ...record,
          id: Date.now().toString(),
        }, ...state.attendanceRecords]
      })),

      // Camera settings
      updateCameraSettings: (settings) => set((state) => ({
        cameraSettings: { ...state.cameraSettings, ...settings }
      })),

      // UI state
      setCurrentUser: (user) => set({ currentUser: user }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'attendance-storage',
    }
  )
);
