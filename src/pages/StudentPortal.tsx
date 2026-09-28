import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, TimetableEntry, Assignment, AttendanceRecord, Announcement, EventItem } from '../types';
import { User as UserIcon, Calendar, Clock, BookOpen, CheckCircle, Bell, MapPin, Award, AlertCircle } from 'lucide-react';

interface StudentPortalProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'assignments' | 'attendance'>('overview');
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<{
    student: any;
    timetable: TimetableEntry[];
    assignments: Assignment[];
    attendance: AttendanceRecord[];
    announcements: Announcement[];
    events: EventItem[];
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentDashboard();
      setStudentData(data);
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-stone-500 font-mono text-sm">
        Retrieving student records from Python Flask server...
      </div>
    );
  }

  const student = studentData?.student || user.profile;
  const filteredTimetable = studentData?.timetable.filter((t) => t.day_of_week === selectedDay) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-stone-800">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-700/80 text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-amber-400">
            {student?.full_name ? student.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-mono">
                Student Portal
              </span>
              <span className="text-xs bg-stone-800 px-2 py-0.5 rounded text-stone-300 font-mono">
                {student?.student_id || 'HOR-2026-081'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome back, {student?.full_name || 'Alexander Hayes'}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              {student?.grade || 'Grade 11-A'} · Roll No: {student?.roll_no || '14'} · Term-I Academic Year 2026–27
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

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'timetable' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Class Timetable
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'assignments' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Assignments ({studentData?.assignments.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'attendance' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Attendance Record
        </button>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Cumulative Attendance</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {student?.attendance_percentage || 96.4}%
              </div>
              <div className="text-xs text-emerald-700 mt-1">Excellent standing (Above 90% threshold)</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Active Assignments</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                {studentData?.assignments.length || 4}
              </div>
              <div className="text-xs text-amber-800 mt-1">Next due October 08</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Enrolled Subjects</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2 tabular-nums">
                6
              </div>
              <div className="text-xs text-stone-500 mt-1">STEM & Computing Track</div>
            </div>

            <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-xs text-stone-500 font-medium">House Association</span>
              <div className="font-serif text-3xl font-bold text-stone-900 mt-2">
                Athena House
              </div>
              <div className="text-xs text-emerald-800 mt-1">Rank 1 in Term-I points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Student Profile Card */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                Official Student Record
              </h3>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-400">Student ID</span>
                  <span className="font-mono font-semibold text-stone-900">{student?.student_id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-400">Class & Section</span>
                  <span className="font-semibold text-stone-900">{student?.grade} (Section {student?.section})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-400">Homeroom Advisor</span>
                  <span className="font-semibold text-stone-900">Prof. Sarah Jenkins</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-400">Parent / Guardian</span>
                  <span className="font-semibold text-stone-900">{student?.parent_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-400">Guardian Phone</span>
                  <span className="font-mono text-stone-900">{student?.parent_phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Residential Zone</span>
                  <span className="text-stone-900">{student?.address}</span>
                </div>
              </div>
            </div>

            {/* Recent Notices & Upcoming Events */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-800" />
                  <span>Administrative Bulletins</span>
                </h3>
                <div className="space-y-3">
                  {studentData?.announcements.slice(0, 3).map((ann) => (
                    <div key={ann.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="font-medium text-amber-800">{ann.category}</span>
                        <span>{ann.date}</span>
                      </div>
                      <div className="font-serif text-sm font-bold text-stone-900">
                        {ann.title}
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {ann.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Day Selector */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl max-w-md border border-stone-200">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedDay === day ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {selectedDay} Schedule — {student?.grade}
              </h3>
              <span className="text-xs text-stone-500 font-mono">6 Instruction Periods</span>
            </div>

            <div className="divide-y divide-stone-100">
              {filteredTimetable.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">No scheduled periods for {selectedDay}.</div>
              ) : (
                filteredTimetable.map((period) => (
                  <div key={period.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 font-mono font-bold flex items-center justify-center text-sm shrink-0">
                        P{period.period}
                      </div>
                      <div>
                        <div className="font-serif text-base font-bold text-stone-900">
                          {period.subject}
                        </div>
                        <div className="text-xs text-stone-500">
                          Instructor: {period.teacher_name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{period.time_slot}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{period.room}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Current Academic Assignments
            </h3>
            <span className="text-xs text-stone-500">Synchronized with Faculty Registry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentData?.assignments.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-800">{item.subject}</span>
                    <span className="font-mono text-stone-500">Due: {item.due_date}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Assigned by: {item.teacher_name}</span>
                  <span className="font-mono font-semibold text-stone-800">Max: {item.max_score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Attendance Registry
              </h3>
              <p className="text-xs text-stone-500 mt-1">Recorded daily during morning roll call.</p>
            </div>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                {student?.attendance_percentage || 96.4}%
              </div>
              <div className="text-xs text-stone-500">Term Attendance</div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Grade</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {studentData?.attendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono text-stone-700">{rec.date}</td>
                      <td className="p-4">{rec.grade}</td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            rec.status === 'Present'
                              ? 'text-emerald-800'
                              : rec.status === 'Late'
                              ? 'text-amber-800'
                              : 'text-red-800'
                          }`}
                        >
                          {rec.status === 'Present' ? '● Present' : rec.status === 'Late' ? '▲ Late Arrival' : '✕ Absent'}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600">{rec.remarks || 'Regular attendance recorded.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
