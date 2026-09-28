export type Role = 'student' | 'teacher' | 'admin';

export interface StudentProfile {
  id: number;
  user_id: number;
  student_id: string;
  full_name: string;
  grade: string;
  section: string;
  roll_no: string;
  attendance_percentage: number;
  parent_name: string;
  parent_phone: string;
  address: string;
  avatar_url?: string;
}

export interface TeacherProfile {
  id: number;
  user_id: number;
  employee_id: string;
  full_name: string;
  department: string;
  designation: string;
  qualification: string;
  phone: string;
  office_room: string;
  avatar_url?: string;
}

export interface AdminProfile {
  id: number;
  user_id: number;
  full_name: string;
  title: string;
  department: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: Role;
  created_at: string;
  profile?: StudentProfile | TeacherProfile | AdminProfile | null;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  category: 'General' | 'Academics' | 'Events' | 'Examination' | 'Sports' | string;
  target_audience: 'All' | 'Students' | 'Teachers' | 'Parents' | string;
  date: string;
  is_pinned: boolean;
  created_at: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Annual Day' | 'Sports' | 'Science Exhibition' | 'Cultural' | 'PTM' | 'Workshop' | string;
  image_url: string;
  created_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: 'Achievement' | 'Campus' | 'Research' | 'Community' | string;
  description: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: 'Campus' | 'Events' | 'Sports' | 'Classrooms' | 'Activities' | 'Students' | string;
  image_url: string;
  caption?: string;
  created_at: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacher_name: string;
  due_date: string;
  description: string;
  max_score: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  grade: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
  created_at: string;
}

export interface TimetableEntry {
  id: number;
  grade: string;
  day_of_week: string;
  period: number;
  time_slot: string;
  subject: string;
  teacher_name: string;
  room: string;
}

export interface AdmissionEnquiry {
  id: number;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  grade_applying_for: string;
  previous_school?: string;
  message?: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  created_at: string;
}

export interface SchoolStats {
  students_count: number;
  faculty_count: number;
  student_teacher_ratio: string;
  campus_acres: number;
  nationalities: number;
  college_acceptance: string;
  events_count: number;
  enquiries_count: number;
  announcements_count: number;
}
