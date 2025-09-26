import { faker } from '@faker-js/faker';
import { 
  SOSAlert, 
  OfflineMessage, 
  EmergencyContact, 
  MedicalProfile, 
  LocationTracking, 
  VoiceCommand, 
  PhotoEvidence, 
  Notification,
  ApiResponse 
} from '../types';

// Mock API service for demo purposes
// In production, replace with actual API calls

class ApiService {
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // SOS Alerts
  async createSOSAlert(message: string, location: any): Promise<ApiResponse<SOSAlert>> {
    await this.delay();
    const alert: SOSAlert = {
      id: faker.string.uuid(),
      userId: 'current-user',
      message,
      location,
      status: 'active',
      priority: 'critical',
      createdAt: new Date().toISOString()
    };
    
    // Store in localStorage for demo
    const existing = JSON.parse(localStorage.getItem('sos_alerts') || '[]');
    existing.push(alert);
    localStorage.setItem('sos_alerts', JSON.stringify(existing));

    return {
      success: true,
      message: 'SOS Alert created successfully',
      data: alert
    };
  }

  async getSOSAlerts(): Promise<ApiResponse<SOSAlert[]>> {
    await this.delay();
    const alerts = JSON.parse(localStorage.getItem('sos_alerts') || '[]');
    
    // Add some mock data if empty
    if (alerts.length === 0) {
      const mockAlerts = Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        userId: 'current-user',
        message: faker.lorem.sentence(),
        location: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          address: faker.location.streetAddress()
        },
        status: faker.helpers.arrayElement(['active', 'resolved', 'cancelled']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
        createdAt: faker.date.recent().toISOString()
      }));
      
      localStorage.setItem('sos_alerts', JSON.stringify(mockAlerts));
      return {
        success: true,
        message: 'SOS Alerts fetched successfully',
        data: mockAlerts
      };
    }

    return {
      success: true,
      message: 'SOS Alerts fetched successfully',
      data: alerts
    };
  }

  // Emergency Contacts
  async getEmergencyContacts(): Promise<ApiResponse<EmergencyContact[]>> {
    await this.delay();
    const contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
    
    if (contacts.length === 0) {
      const mockContacts = Array.from({ length: 4 }, () => ({
        id: faker.string.uuid(),
        userId: 'current-user',
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        relationship: faker.helpers.arrayElement(['Family', 'Friend', 'Colleague', 'Doctor', 'Emergency Service']),
        isPrimary: faker.datatype.boolean(),
        createdAt: faker.date.recent().toISOString()
      }));
      
      localStorage.setItem('emergency_contacts', JSON.stringify(mockContacts));
      return {
        success: true,
        message: 'Emergency contacts fetched successfully',
        data: mockContacts
      };
    }

    return {
      success: true,
      message: 'Emergency contacts fetched successfully',
      data: contacts
    };
  }

  async createEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<EmergencyContact>> {
    await this.delay();
    
    const newContact: EmergencyContact = {
      ...contact,
      id: faker.string.uuid(),
      userId: 'current-user',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
    existing.push(newContact);
    localStorage.setItem('emergency_contacts', JSON.stringify(existing));

    return {
      success: true,
      message: 'Emergency contact created successfully',
      data: newContact
    };
  }

  // Medical Profile
  async getMedicalProfile(): Promise<ApiResponse<MedicalProfile>> {
    await this.delay();
    const profile = JSON.parse(localStorage.getItem('medical_profile') || 'null');
    
    if (!profile) {
      const mockProfile: MedicalProfile = {
        id: faker.string.uuid(),
        userId: 'current-user',
        bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
        allergies: ['Penicillin', 'Nuts'],
        medications: ['Aspirin'],
        conditions: ['Hypertension'],
        emergencyNotes: 'Contact family physician Dr. Smith at +44-123-456-7890',
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('medical_profile', JSON.stringify(mockProfile));
      return {
        success: true,
        message: 'Medical profile fetched successfully',
        data: mockProfile
      };
    }

    return {
      success: true,
      message: 'Medical profile fetched successfully',
      data: profile
    };
  }

  async updateMedicalProfile(profile: Partial<MedicalProfile>): Promise<ApiResponse<MedicalProfile>> {
    await this.delay();
    
    const existing = JSON.parse(localStorage.getItem('medical_profile') || 'null');
    const updated = {
      ...existing,
      ...profile,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('medical_profile', JSON.stringify(updated));

    return {
      success: true,
      message: 'Medical profile updated successfully',
      data: updated
    };
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    if (notifications.length === 0) {
      const mockNotifications = Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        userId: 'current-user',
        title: faker.helpers.arrayElement([
          'Emergency Alert',
          'System Update',
          'Weather Warning',
          'Contact Updated',
          'Location Shared'
        ]),
        message: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(['info', 'warning', 'error', 'success']),
        isRead: faker.datatype.boolean(),
        createdAt: faker.date.recent().toISOString()
      }));
      
      localStorage.setItem('notifications', JSON.stringify(mockNotifications));
      return {
        success: true,
        message: 'Notifications fetched successfully',
        data: mockNotifications
      };
    }

    return {
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications
    };
  }

  // Add more methods for other features...
  async getOfflineMessages(): Promise<ApiResponse<OfflineMessage[]>> {
    await this.delay();
    return {
      success: true,
      message: 'Offline messages fetched successfully',
      data: []
    };
  }

  async getLocationHistory(): Promise<ApiResponse<LocationTracking[]>> {
    await this.delay();
    return {
      success: true,
      message: 'Location history fetched successfully',
      data: []
    };
  }

  async getVoiceCommands(): Promise<ApiResponse<VoiceCommand[]>> {
    await this.delay();
    return {
      success: true,
      message: 'Voice commands fetched successfully',
      data: []
    };
  }

  async getPhotoEvidence(): Promise<ApiResponse<PhotoEvidence[]>> {
    await this.delay();
    return {
      success: true,
      message: 'Photo evidence fetched successfully',
      data: []
    };
  }
}

export const apiService = new ApiService();
