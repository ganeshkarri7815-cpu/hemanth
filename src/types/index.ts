export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'responder';
  phone?: string;
  createdAt: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  message: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'active' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolvedAt?: string;
}

export interface OfflineMessage {
  id: string;
  userId: string;
  recipient: string;
  message: string;
  status: 'queued' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface MedicalProfile {
  id: string;
  userId: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyNotes: string;
  updatedAt: string;
}

export interface LocationTracking {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface VoiceCommand {
  id: string;
  userId: string;
  command: string;
  response: string;
  action?: string;
  timestamp: string;
}

export interface PhotoEvidence {
  id: string;
  userId: string;
  filename: string;
  url: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
