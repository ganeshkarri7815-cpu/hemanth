import axios from 'axios';
import { User, ApiResponse } from '../types';
import { faker } from '@faker-js/faker';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock authentication service for demo purposes
class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const user: User = {
      id: faker.string.uuid(),
      email,
      name: faker.person.fullName(),
      role: 'user',
      phone: faker.phone.number(),
      createdAt: new Date().toISOString()
    };

    const token = faker.string.alphanumeric(64);

    return {
      success: true,
      message: 'Login successful',
      data: { user, token }
    };
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: faker.string.uuid(),
      email,
      name,
      role: 'user',
      phone: faker.phone.number(),
      createdAt: new Date().toISOString()
    };

    const token = faker.string.alphanumeric(64);

    return {
      success: true,
      message: 'Registration successful',
      data: { user, token }
    };
  }

  async logout(): Promise<ApiResponse> {
    return {
      success: true,
      message: 'Logout successful'
    };
  }
}

export const authService = new AuthService();
