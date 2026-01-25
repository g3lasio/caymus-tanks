/**
 * JSON File Storage Implementation
 * Simple, functional, and consistent storage for small user bases
 * 
 * Stores data in JSON files on the filesystem
 * Perfect for 10-20 users without needing a database server
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directory
const STORAGE_DIR = path.join(__dirname, '../.data');
const USERS_FILE = path.join(STORAGE_DIR, 'users.json');
const DEVICES_FILE = path.join(STORAGE_DIR, 'devices.json');
const DEVICE_REQUESTS_FILE = path.join(STORAGE_DIR, 'device-requests.json');

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  isOwner: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface DeviceInfo {
  userId: string;
  deviceId: string;
  registeredAt: string;
}

export interface DeviceChangeRequest {
  userId: string;
  oldDeviceId: string;
  newDeviceId: string;
  requestedAt: string;
}

interface StorageData {
  users: User[];
  devices: DeviceInfo[];
  deviceRequests: DeviceChangeRequest[];
}

/**
 * Ensure storage directory and files exist
 */
async function ensureStorage(): Promise<void> {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    
    // Create users file if it doesn't exist
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    }
    
    // Create devices file if it doesn't exist
    try {
      await fs.access(DEVICES_FILE);
    } catch {
      await fs.writeFile(DEVICES_FILE, JSON.stringify([], null, 2));
    }
    
    // Create device requests file if it doesn't exist
    try {
      await fs.access(DEVICE_REQUESTS_FILE);
    } catch {
      await fs.writeFile(DEVICE_REQUESTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring storage:', error);
    throw error;
  }
}

/**
 * Read users from storage
 */
export async function getUsers(): Promise<User[]> {
  await ensureStorage();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

/**
 * Get user by phone number
 */
export async function getUserByPhone(phoneNumber: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.phoneNumber === phoneNumber);
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.id === userId);
}

/**
 * Create new user
 */
export async function createUser(phoneNumber: string, name: string, isOwner: boolean): Promise<User> {
  await ensureStorage();
  const users = await getUsers();
  
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    phoneNumber,
    name,
    isOwner,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  
  users.push(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  
  return newUser;
}

/**
 * Update user's last login
 */
export async function updateUserLastLogin(userId: string): Promise<void> {
  await ensureStorage();
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    user.lastLogin = new Date().toISOString();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

/**
 * Read devices from storage
 */
export async function getDevices(): Promise<DeviceInfo[]> {
  await ensureStorage();
  try {
    const data = await fs.readFile(DEVICES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading devices:', error);
    return [];
  }
}

/**
 * Get device by user ID
 */
export async function getDeviceByUserId(userId: string): Promise<DeviceInfo | undefined> {
  const devices = await getDevices();
  return devices.find(d => d.userId === userId);
}

/**
 * Get device by device ID
 */
export async function getDeviceByDeviceId(deviceId: string): Promise<DeviceInfo | undefined> {
  const devices = await getDevices();
  return devices.find(d => d.deviceId === deviceId);
}

/**
 * Register device for user
 */
export async function registerDevice(userId: string, deviceId: string): Promise<void> {
  await ensureStorage();
  const devices = await getDevices();
  
  // Remove any existing device for this user
  const filteredDevices = devices.filter(d => d.userId !== userId);
  
  filteredDevices.push({
    userId,
    deviceId,
    registeredAt: new Date().toISOString(),
  });
  
  await fs.writeFile(DEVICES_FILE, JSON.stringify(filteredDevices, null, 2));
}

/**
 * Read device change requests from storage
 */
export async function getDeviceRequests(): Promise<DeviceChangeRequest[]> {
  await ensureStorage();
  try {
    const data = await fs.readFile(DEVICE_REQUESTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading device requests:', error);
    return [];
  }
}

/**
 * Get device change request by user ID
 */
export async function getDeviceRequestByUserId(userId: string): Promise<DeviceChangeRequest | undefined> {
  const requests = await getDeviceRequests();
  return requests.find(r => r.userId === userId);
}

/**
 * Create device change request
 */
export async function createDeviceRequest(userId: string, oldDeviceId: string, newDeviceId: string): Promise<void> {
  await ensureStorage();
  const requests = await getDeviceRequests();
  
  // Remove any existing request for this user
  const filteredRequests = requests.filter(r => r.userId !== userId);
  
  filteredRequests.push({
    userId,
    oldDeviceId,
    newDeviceId,
    requestedAt: new Date().toISOString(),
  });
  
  await fs.writeFile(DEVICE_REQUESTS_FILE, JSON.stringify(filteredRequests, null, 2));
}

/**
 * Delete device change request
 */
export async function deleteDeviceRequest(userId: string): Promise<void> {
  await ensureStorage();
  const requests = await getDeviceRequests();
  const filteredRequests = requests.filter(r => r.userId !== userId);
  await fs.writeFile(DEVICE_REQUESTS_FILE, JSON.stringify(filteredRequests, null, 2));
}

// Initialize storage on module load
ensureStorage().catch(console.error);
