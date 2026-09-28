import {
  User, Announcement, EventItem, NewsItem, GalleryItem,
  SchoolStats, AdmissionEnquiry, ContactMessage, TimetableEntry,
  Assignment, AttendanceRecord
} from '../types';

const API_BASE = '/api';

// Helper to retrieve auth token
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('horizontal_auth_token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

export const api = {
  // Auth
  async login(identifier: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication failed. Please check your credentials.');
    }
    const data = await res.json();
    localStorage.setItem('horizontal_auth_token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
    localStorage.removeItem('horizontal_auth_token');
  },

  async getMe(): Promise<User | null> {
    const token = localStorage.getItem('horizontal_auth_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // Stats
  async getStats(): Promise<SchoolStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Announcements
  async getAnnouncements(category?: string, audience?: string): Promise<Announcement[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (audience && audience !== 'All') params.append('audience', audience);

    const res = await fetch(`${API_BASE}/announcements?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createAnnouncement(data: {
    title: string;
    description: string;
    category?: string;
    target_audience?: string;
    is_pinned?: boolean;
  }): Promise<{ message: string; item: Announcement }> {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create announcement');
    }
    return res.json();
  },

  async deleteAnnouncement(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete announcement');
  },

  // Events
  async getEvents(category?: string): Promise<EventItem[]> {
    const url = category && category !== 'All' ? `${API_BASE}/events?category=${encodeURIComponent(category)}` : `${API_BASE}/events`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async createEvent(data: Partial<EventItem>): Promise<{ message: string; event: EventItem }> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create event');
    }
    return res.json();
  },

  async deleteEvent(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete event');
  },

  // News
  async getNews(category?: string): Promise<NewsItem[]> {
    const url = category && category !== 'All' ? `${API_BASE}/news?category=${encodeURIComponent(category)}` : `${API_BASE}/news`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async getNewsDetail(id: number): Promise<NewsItem> {
    const res = await fetch(`${API_BASE}/news/${id}`);
    if (!res.ok) throw new Error('Failed to fetch news detail');
    return res.json();
  },

  async createNews(data: Partial<NewsItem>): Promise<{ message: string; news: NewsItem }> {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to publish news');
    }
    return res.json();
  },

  async deleteNews(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete news');
  },

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const url = category && category !== 'All' ? `${API_BASE}/gallery?category=${encodeURIComponent(category)}` : `${API_BASE}/gallery`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch gallery items');
    return res.json();
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<{ message: string; item: GalleryItem }> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add gallery item');
    }
    return res.json();
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to remove gallery item');
  },

  // Admissions
  async submitAdmissionEnquiry(data: {
    student_name: string;
    parent_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    grade_applying_for: string;
    previous_school?: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; enquiry_id: number }> {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Submission failed');
    }
    return res.json();
  },

  async getAdmissionEnquiries(status?: string): Promise<AdmissionEnquiry[]> {
    const url = status && status !== 'All' ? `${API_BASE}/admissions?status=${encodeURIComponent(status)}` : `${API_BASE}/admissions`;
    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch admissions');
    return res.json();
  },

  async updateAdmissionStatus(id: number, status: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admissions/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update admission status');
  },

  // Contact
  async submitContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string; message_id: number }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Message submission failed');
    }
    return res.json();
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch contact messages');
    return res.json();
  },

  async updateContactStatus(id: number, status: string): Promise<void> {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
  },

  // Student Dashboard
  async getStudentDashboard(): Promise<{
    student: any;
    timetable: TimetableEntry[];
    assignments: Assignment[];
    attendance: AttendanceRecord[];
    announcements: Announcement[];
    events: EventItem[];
  }> {
    const res = await fetch(`${API_BASE}/student/dashboard`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to load student dashboard');
    return res.json();
  },

  // Teacher Dashboard
  async getTeacherDashboard(): Promise<{
    teacher: any;
    assigned_classes: Array<{ grade: string; subject: string; students_count: number; room: string }>;
    students: any[];
    assignments: Assignment[];
    recent_attendance: AttendanceRecord[];
  }> {
    const res = await fetch(`${API_BASE}/teacher/dashboard`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to load teacher dashboard');
    return res.json();
  },

  async createTeacherAssignment(data: {
    title: string;
    subject: string;
    grade: string;
    due_date: string;
    description: string;
    max_score: number;
  }): Promise<{ message: string; assignment: Assignment }> {
    const res = await fetch(`${API_BASE}/teacher/assignments`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create assignment');
    }
    return res.json();
  },

  async markTeacherAttendance(data: {
    student_id: number;
    status: string;
    date?: string;
    remarks?: string;
  }): Promise<{ message: string; record: AttendanceRecord }> {
    const res = await fetch(`${API_BASE}/teacher/attendance`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to mark attendance');
    }
    return res.json();
  },

  // Admin Dashboard
  async getAdminDashboard(): Promise<{
    admin: any;
    metrics: {
      total_students: number;
      total_teachers: number;
      enquiries_count: number;
      pending_enquiries: number;
      unread_messages: number;
      events_count: number;
      announcements_count: number;
    };
    latest_enquiries: AdmissionEnquiry[];
    latest_contacts: ContactMessage[];
    users: User[];
  }> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to load admin dashboard');
    return res.json();
  },
};
