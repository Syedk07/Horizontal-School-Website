import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export interface FirestoreAdmissionEnquiry {
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  grade_applying_for: string;
  previous_school?: string;
  message?: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  created_at?: string;
}

export interface FirestoreContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  created_at?: string;
}

export const firestoreSync = {
  // Sync admission enquiry to Firestore
  async submitAdmissionEnquiry(id: string | number, data: FirestoreAdmissionEnquiry) {
    const docId = `enq_${id}`;
    const path = `admissions/${docId}`;
    try {
      await setDoc(doc(db, 'admissions', docId), {
        student_name: data.student_name.trim().slice(0, 100),
        parent_name: data.parent_name.trim().slice(0, 100),
        email: data.email.trim().slice(0, 120),
        phone: data.phone.trim().slice(0, 30),
        date_of_birth: data.date_of_birth.trim().slice(0, 30),
        grade_applying_for: data.grade_applying_for.trim().slice(0, 100),
        previous_school: (data.previous_school || '').trim().slice(0, 150),
        message: (data.message || '').trim().slice(0, 1000),
        status: 'Pending',
        created_at: new Date().toISOString(),
      });
      return { success: true, docId };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Sync contact message to Firestore
  async submitContactMessage(id: string | number, data: FirestoreContactMessage) {
    const docId = `msg_${id}`;
    const path = `contacts/${docId}`;
    try {
      await setDoc(doc(db, 'contacts', docId), {
        name: data.name.trim().slice(0, 100),
        email: data.email.trim().slice(0, 120),
        phone: (data.phone || '').trim().slice(0, 30),
        subject: data.subject.trim().slice(0, 200),
        message: data.message.trim().slice(0, 2000),
        status: 'Unread',
        created_at: new Date().toISOString(),
      });
      return { success: true, docId };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Sync announcements
  async publishAnnouncement(id: string | number, data: {
    title: string;
    description: string;
    category: string;
    target_audience: string;
    date: string;
    is_pinned?: boolean;
  }) {
    const docId = `ann_${id}`;
    const path = `announcements/${docId}`;
    try {
      await setDoc(doc(db, 'announcements', docId), {
        title: data.title.trim().slice(0, 200),
        description: data.description.trim().slice(0, 2000),
        category: data.category.trim().slice(0, 64),
        target_audience: data.target_audience.trim().slice(0, 64),
        date: data.date.trim().slice(0, 32),
        is_pinned: !!data.is_pinned,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Sync event
  async publishEvent(id: string | number, data: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category?: string;
    image_url?: string;
  }) {
    const docId = `ev_${id}`;
    const path = `events/${docId}`;
    try {
      await setDoc(doc(db, 'events', docId), {
        title: data.title.trim().slice(0, 200),
        date: data.date.trim().slice(0, 64),
        time: data.time.trim().slice(0, 64),
        location: data.location.trim().slice(0, 128),
        description: data.description.trim().slice(0, 2000),
        category: (data.category || 'General').trim().slice(0, 64),
        image_url: (data.image_url || '').slice(0, 500),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Sync news
  async publishNews(id: string | number, data: {
    title: string;
    date: string;
    category: string;
    description: string;
    content: string;
    image_url?: string;
    author?: string;
  }) {
    const docId = `news_${id}`;
    const path = `news/${docId}`;
    try {
      await setDoc(doc(db, 'news', docId), {
        title: data.title.trim().slice(0, 200),
        date: data.date.trim().slice(0, 64),
        category: data.category.trim().slice(0, 64),
        description: data.description.trim().slice(0, 1000),
        content: data.content.trim().slice(0, 5000),
        image_url: (data.image_url || '').slice(0, 500),
        author: (data.author || 'HORIZON Communications').trim().slice(0, 100),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};

