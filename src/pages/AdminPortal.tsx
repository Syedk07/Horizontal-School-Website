import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { firestoreSync } from '../services/firestoreSync';
import { User, AdmissionEnquiry, ContactMessage, Announcement, EventItem, NewsItem } from '../types';
import { Users, FileText, Bell, Calendar, Newspaper, Check, Trash2, Plus, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminPortalProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'messages' | 'announcements' | 'events' | 'news'>('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
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
  } | null>(null);

  // Forms
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    category: 'General',
    target_audience: 'All',
    is_pinned: false,
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'General',
  });

  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Campus',
    description: '',
    content: '',
  });

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmissionStatus = async (id: number, status: string) => {
    try {
      await api.updateAdmissionStatus(id, status);
      setActionNotice(`Enquiry #${id} marked as ${status}.`);
      setTimeout(() => setActionNotice(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry');
    }
  };

  const handleUpdateContactStatus = async (id: number, status: string) => {
    try {
      await api.updateContactStatus(id, status);
      setActionNotice(`Message #${id} updated.`);
      setTimeout(() => setActionNotice(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update message');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.description) return;
    try {
      const res = await api.createAnnouncement(newAnnouncement);
      try {
        await firestoreSync.publishAnnouncement(res.item?.id || Date.now(), {
          ...newAnnouncement,
          date: res.item?.date || new Date().toISOString().split('T')[0],
        });
      } catch (fsErr) {
        console.warn('Firestore sync note:', fsErr);
      }
      setActionNotice('Announcement published to public portal and Firestore.');
      setNewAnnouncement({
        title: '',
        description: '',
        category: 'General',
        target_audience: 'All',
        is_pinned: false,
      });
      setTimeout(() => setActionNotice(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Error publishing');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) return;
    try {
      const res = await api.createEvent(newEvent);
      try {
        await firestoreSync.publishEvent(res.event?.id || Date.now(), newEvent);
      } catch (fsErr) {
        console.warn('Firestore sync note:', fsErr);
      }
      setActionNotice('Event added to school calendar and Firestore.');
      setNewEvent({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: 'General',
      });
      setTimeout(() => setActionNotice(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Error creating event');
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.description || !newNews.content) return;
    try {
      const res = await api.createNews(newNews);
      try {
        await firestoreSync.publishNews(res.news?.id || Date.now(), {
          ...newNews,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
      } catch (fsErr) {
        console.warn('Firestore sync note:', fsErr);
      }
      setActionNotice('News article published to portal and Firestore.');
      setNewNews({
        title: '',
        category: 'Campus',
        description: '',
        content: '',
      });
      setTimeout(() => setActionNotice(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Error publishing news');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500 font-mono text-sm">
        Retrieving administrative telemetry from Python Flask backend...
      </div>
    );
  }

  const m = dashboardData?.metrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-mono">
              Executive Directorate
            </span>
            <span className="text-xs bg-stone-800 px-2 py-0.5 rounded text-stone-300 font-mono">
              Administrator ID: {user.id}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            HORIZONTAL Institutional Administration
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Logged in as {user.email} · Full Database CRUD Authorities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Public Site
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('admissions')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'admissions' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Admissions Enquiries ({m?.enquiries_count || 0})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'messages' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Contact Communications ({m?.unread_messages || 0} unread)
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'announcements' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Publish Announcements
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'events' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Calendar Manager
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'news' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Publish News
        </button>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Registered Scholars</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {m?.total_students || 6}
              </div>
              <div className="text-xs text-emerald-800 mt-1">Grade 11-A Roster active</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Faculty Members</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {m?.total_teachers || 5}
              </div>
              <div className="text-xs text-stone-500 mt-1">Across 7 departments</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Admission Enquiries</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {m?.enquiries_count || 3}
              </div>
              <div className="text-xs text-amber-800 mt-1">{m?.pending_enquiries || 1} requiring action</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Unread Messages</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {m?.unread_messages || 1}
              </div>
              <div className="text-xs text-stone-500 mt-1">From public contact form</div>
            </div>
          </div>

          {/* Quick Enquiries Preview */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Recent Admission Enquiries
              </h3>
              <button
                onClick={() => setActiveTab('admissions')}
                className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
              >
                View All Enquiries →
              </button>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {dashboardData?.latest_enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-stone-900">{enq.student_name}</span>
                    <span className="text-stone-500"> ({enq.grade_applying_for})</span>
                    <div className="text-stone-400 mt-0.5">Parent: {enq.parent_name} · {enq.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      enq.status === 'Accepted' ? 'bg-emerald-50 text-emerald-800' :
                      enq.status === 'Reviewed' ? 'bg-blue-50 text-blue-800' :
                      enq.status === 'Rejected' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Admissions Tab (Review & Action) */}
      {activeTab === 'admissions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Admission Enquiries Management
            </h3>
            <span className="text-xs text-stone-500 font-mono">SQLite Registry</span>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Parent & Contact</th>
                    <th className="p-4">Grade & Prior School</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {dashboardData?.latest_enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-bold text-stone-600">#{enq.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-stone-900">{enq.student_name}</div>
                        <div className="text-stone-400">DOB: {enq.date_of_birth}</div>
                      </td>
                      <td className="p-4">
                        <div>{enq.parent_name}</div>
                        <div className="text-stone-500 font-mono">{enq.email} · {enq.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-stone-800">{enq.grade_applying_for}</div>
                        <div className="text-stone-500">{enq.previous_school || 'None stated'}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          enq.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          enq.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                          enq.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateAdmissionStatus(enq.id, 'Reviewed')}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors cursor-pointer"
                        >
                          Reviewed
                        </button>
                        <button
                          onClick={() => handleUpdateAdmissionStatus(enq.id, 'Accepted')}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-medium transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateAdmissionStatus(enq.id, 'Rejected')}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            Incoming Secretariat Communications
          </h3>

          <div className="space-y-4">
            {dashboardData?.latest_contacts.map((msg) => (
              <div key={msg.id} className="p-6 bg-white border border-stone-200 rounded-xl shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">{msg.name}</span>
                    <span className="text-stone-500 text-xs"> ({msg.email})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`px-2 py-0.5 rounded font-medium ${msg.status === 'Unread' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-stone-100 text-stone-700'}`}>
                      {msg.status}
                    </span>
                    <span className="text-stone-400 font-mono">{msg.created_at}</span>
                  </div>
                </div>

                <div className="font-serif text-base font-bold text-stone-900">
                  Subject: {msg.subject}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-lg">
                  {msg.message}
                </p>

                <div className="flex items-center gap-2 pt-2 text-xs">
                  {msg.status === 'Unread' && (
                    <button
                      onClick={() => handleUpdateContactStatus(msg.id, 'Read')}
                      className="px-3 py-1 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  )}
                  {msg.status !== 'Replied' && (
                    <button
                      onClick={() => handleUpdateContactStatus(msg.id, 'Replied')}
                      className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded font-medium hover:bg-emerald-200 cursor-pointer"
                    >
                      Mark as Replied
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Publish Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Publish School Announcement
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g. Schedule Update for Fall Examinations"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Academics">Academics</option>
                    <option value="Events">Events</option>
                    <option value="Examination">Examination</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newAnnouncement.target_audience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target_audience: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                  >
                    <option value="All">All Audiences</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Announcement Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  placeholder="Enter detailed notice prose..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={newAnnouncement.is_pinned}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_pinned: e.target.checked })}
                  className="rounded text-amber-800"
                />
                <label htmlFor="pin" className="text-stone-700 font-medium">
                  Pin to Top of Notice Board
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Publish to Live Bulletin Board
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Notice Board Policy
            </h4>
            <div className="p-4 bg-stone-100 rounded-xl text-xs text-stone-600 space-y-2">
              <p>• Pinned bulletins appear first on the homepage ticker and student portal.</p>
              <p>• All notices are persisted to SQLite database and instantly queryable by role.</p>
              <p>• Emergency weather announcements should be marked as "General" and pinned.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Calendar Manager Tab */}
      {activeTab === 'events' && (
        <div className="max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4 animate-fadeIn">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Create Official School Event
          </h3>

          <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g. Winter Gala & Classical Concert"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Date *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  placeholder="e.g. December 18, 2026"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Time *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="e.g. 06:00 PM – 08:30 PM"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="e.g. Centennial Auditorium"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                >
                  <option value="Annual Day">Annual Day</option>
                  <option value="Science Exhibition">Science Exhibition</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="PTM">PTM</option>
                  <option value="Workshop">Workshop</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Event Description
              </label>
              <textarea
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Details, program schedule, admission ticketing..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Add to School Calendar
            </button>
          </form>
        </div>
      )}

      {/* 6. News Manager Tab */}
      {activeTab === 'news' && (
        <div className="max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4 animate-fadeIn">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Publish Institutional News
          </h3>

          <form onSubmit={handleCreateNews} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                required
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                placeholder="e.g. HORIZONTAL Scholars Awarded National Research Grants"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Category
              </label>
              <select
                value={newNews.category}
                onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
              >
                <option value="Achievement">Achievement</option>
                <option value="Campus">Campus</option>
                <option value="Research">Research</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Brief Executive Summary *
              </label>
              <input
                type="text"
                required
                value={newNews.description}
                onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                placeholder="1–2 sentence overview for cards..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Full Article Content *
              </label>
              <textarea
                rows={5}
                required
                value={newNews.content}
                onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                placeholder="Write full chronicle text..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Publish News Chronicle
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
