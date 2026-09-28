import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Assignment, AttendanceRecord } from '../types';
import { BookOpen, UserCheck, Plus, Check, AlertCircle, Clock, Users, Send } from 'lucide-react';

interface TeacherPortalProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'roster' | 'assignments' | 'attendance'>('roster');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    teacher: any;
    assigned_classes: Array<{ grade: string; subject: string; students_count: number; room: string }>;
    students: any[];
    assignments: Assignment[];
    recent_attendance: AttendanceRecord[];
  } | null>(null);

  // New Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subject: 'Advanced Mathematics',
    grade: 'Grade 11-A',
    due_date: '',
    description: '',
    max_score: 100,
  });
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);

  // Attendance marking feedback
  const [attendanceMessage, setAttendanceMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getTeacherDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.title || !assignmentForm.due_date || !assignmentForm.description) return;

    setAssignmentSubmitting(true);
    setAssignmentSuccess(null);
    try {
      const res = await api.createTeacherAssignment(assignmentForm);
      setAssignmentSuccess(res.message);
      setAssignmentForm({
        title: '',
        subject: 'Advanced Mathematics',
        grade: 'Grade 11-A',
        due_date: '',
        description: '',
        max_score: 100,
      });
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Error creating assignment');
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const handleMarkAttendance = async (studentId: number, status: string) => {
    try {
      const res = await api.markTeacherAttendance({
        student_id: studentId,
        status,
        date: new Date().toISOString().split('T')[0],
        remarks: `Marked by ${dashboardData?.teacher?.full_name || 'Faculty Member'}`,
      });
      setAttendanceMessage(res.message);
      setTimeout(() => setAttendanceMessage(null), 3000);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update attendance');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500 font-mono text-sm">
        Retrieving faculty records from Python Flask server...
      </div>
    );
  }

  const teacher = dashboardData?.teacher || user.profile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-stone-800">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-emerald-400">
            {teacher?.full_name ? teacher.full_name.charAt(0) : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-mono">
                Faculty Portal
              </span>
              <span className="text-xs bg-stone-800 px-2 py-0.5 rounded text-stone-300 font-mono">
                {teacher?.employee_id || 'HOR-FAC-104'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              {teacher?.full_name || 'Prof. Sarah Jenkins'}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              {teacher?.department} · {teacher?.office_room}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('roster')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'roster' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Class Roster & Attendance
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'assignments' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Assignments Manager
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'classes' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Assigned Sections
        </button>
      </div>

      {attendanceMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{attendanceMessage}</span>
        </div>
      )}

      {/* 1. Class Roster & 1-Click Attendance */}
      {activeTab === 'roster' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Grade 11-A Student Roster
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Mark daily attendance with instant real-time recording to SQLite database.
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
              Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Roll</th>
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Term Standing</th>
                    <th className="p-4">Guardian Contact</th>
                    <th className="p-4 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {dashboardData?.students.map((student) => (
                    <tr key={student.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-semibold text-stone-900">{student.roll_no}</td>
                      <td className="p-4 font-mono text-stone-500">{student.student_id}</td>
                      <td className="p-4 font-semibold text-stone-900">{student.full_name}</td>
                      <td className="p-4 tabular-nums">
                        <span className="font-medium text-emerald-800">{student.attendance_percentage}%</span>
                      </td>
                      <td className="p-4 text-stone-500">
                        {student.parent_name} ({student.parent_phone})
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'Present')}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'Late')}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'Absent')}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Absent
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

      {/* 2. Assignments Manager */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* Create Assignment Form */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Post New Assignment
            </h3>

            {assignmentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{assignmentSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  placeholder="e.g. Stokes Theorem & Vector Calculus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={assignmentForm.subject}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Instructions & Criteria *
                </label>
                <textarea
                  rows={3}
                  required
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  placeholder="Provide step-by-step submission expectations and grading rubrics..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={assignmentSubmitting}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{assignmentSubmitting ? 'Publishing...' : 'Assign to Class'}</span>
              </button>
            </form>
          </div>

          {/* Existing Assignments List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Active Assigned Coursework
            </h3>
            <div className="space-y-3">
              {dashboardData?.assignments.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-800">{item.subject} · {item.grade}</span>
                    <span className="font-mono text-stone-500">Due: {item.due_date}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900">{item.title}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. Assigned Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {dashboardData?.assigned_classes.map((cls, idx) => (
            <div key={idx} className="p-6 bg-white border border-stone-200 rounded-xl shadow-xs space-y-3">
              <span className="text-xs font-mono text-amber-800 font-semibold">{cls.room}</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">{cls.grade}</h3>
              <p className="text-sm text-stone-600 font-medium">{cls.subject}</p>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Enrolled: {cls.students_count} scholars</span>
                <span className="font-medium text-emerald-800">Active Term-I</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
