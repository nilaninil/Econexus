export interface User {
  id: string;
  email: string;
  role: 'institution' | 'city_admin' | 'municipality_officer';
  name: string;
  type?: 'Resort' | 'Restaurant' | 'College' | 'Hostel' | 'Event Hall';
  phone?: string;
  address?: string;
  zone: 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';
}

export interface DailyReport {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionType: 'Resort' | 'Restaurant' | 'College' | 'Hostel' | 'Event Hall';
  zone: 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';
  date: string; // YYYY-MM-DD
  foodPrepared: number; // kg
  foodConsumed: number; // kg
  foodWasted: number; // kg
  visitors: number; // Attendance / count
  foodWaste: number; // kg
  plasticWaste: number; // kg
  paperWaste: number; // kg
  organicWaste: number; // kg
  otherWaste: number; // kg
  waterUsage: number; // Liters
  electricityUsage: number; // kWh
}

export interface ZoneMetrics {
  zone: 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';
  totalWaste: number; // kg per day/week/month
  sustainabilityScore: number; // 0 - 100
  foodWasteRate: number; // percentage
  recyclingRate: number; // percentage
  efficiencyScore: number;
}

export interface PredictionResult {
  date: string;
  expectedAttendance: number;
  expectedFoodPrepared: number; // kg
  expectedFoodWaste: number; // kg
  alerts: {
    type: 'warning' | 'info' | 'success';
    message: string;
  }[];
}

export interface AIInsight {
  id: string;
  target: 'all' | 'institution' | string;
  type: 'pattern' | 'alert' | 'recommendation';
  title: string;
  description: string;
  icon: string;
  date: string;
}

export interface SystemNotification {
  id: string;
  userId: string; // "all" or specific
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  date: string; // ISO String
  read: boolean;
}
