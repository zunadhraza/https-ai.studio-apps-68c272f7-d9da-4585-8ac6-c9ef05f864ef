export type Department = 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'GENERAL';

export const DEPARTMENTS: { id: Department; label: string; full: string; color: string }[] = [
  { id: 'CSE', label: 'CSE', full: 'Computer Science & Engineering', color: '#1E40AF' },
  { id: 'ECE', label: 'ECE', full: 'Electronics & Communication', color: '#0369A1' },
  { id: 'EEE', label: 'EEE', full: 'Electrical & Electronics', color: '#047857' },
  { id: 'MECH', label: 'MECH', full: 'Mechanical Engineering', color: '#C2410C' },
  { id: 'CIVIL', label: 'CIVIL', full: 'Civil Engineering', color: '#7C2D12' },
  { id: 'GENERAL', label: 'GENERAL', full: 'General Administration', color: '#4338CA' },
];

export interface Notice {
  id: string;
  title: string;
  department: Department;
  description: string;
  author: string;
  publishedDate: string; // YYYY-MM-DD or ISO
  isBookmarked?: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  views?: number;
  contactEmail?: string;
  location?: string;
}

export type ScreenView = 'home' | 'detail' | 'add' | 'saved' | 'flutter_code';
export type DeviceMode = 'mobile' | 'portal';
export type Orientation = 'portrait' | 'landscape';
