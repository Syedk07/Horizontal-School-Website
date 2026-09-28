import React, { useState } from 'react';
import { api } from '../services/api';
import { firestoreSync } from '../services/firestoreSync';
import { CheckCircle2, AlertCircle, Send, FileText, UserCheck, CalendarCheck, HelpCircle } from 'lucide-react';

interface AdmissionsPageProps {
  onNavigate: (tab: string) => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    grade_applying_for: 'Grade 9 - Secondary School',
    previous_school: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; enquiry_id: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gradeOptions = [
    'Grade 1 - Primary School',
    'Grade 2 - Primary School',
    'Grade 3 - Primary School',
    'Grade 4 - Primary School',
    'Grade 5 - Primary School',
    'Grade 6 - Middle School',
    'Grade 7 - Middle School',
    'Grade 8 - Middle School',
    'Grade 9 - Secondary School',
    'Grade 10 - Secondary School',
    'Grade 11 - Senior Secondary (STEM & Computing)',
    'Grade 11 - Senior Secondary (Humanities & Law)',
    'Grade 11 - Senior Secondary (Commerce & Economics)',
    'Grade 12 - Senior Secondary (Collegiate Transfer)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessResponse(null);

    // Validation
    if (!formData.student_name.trim() || !formData.parent_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.date_of_birth.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitAdmissionEnquiry(formData);
      setSuccessResponse(res);
      // Synchronize with Firestore
      try {
        await firestoreSync.submitAdmissionEnquiry(res.enquiry_id || Date.now(), {
          student_name: formData.student_name,
          parent_name: formData.parent_name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          grade_applying_for: formData.grade_applying_for,
          previous_school: formData.previous_school,
          message: formData.message,
          status: 'Pending',
        });
      } catch (fsErr) {
        console.warn('Firestore sync note:', fsErr);
      }
      setFormData({
        student_name: '',
        parent_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        grade_applying_for: 'Grade 9 - Secondary School',
        previous_school: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your enquiry. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Submit Online Enquiry',
      desc: 'Complete the verified enquiry form below. Our admissions council logs every submission into the student information registry.',
    },
    {
      num: '02',
      title: 'Campus Tour & Assessment',
      desc: 'Attend a personalized campus walkthrough and interactive student baseline assessment in mathematical logic and language expression.',
    },
    {
      num: '03',
      title: 'Document Verification',
      desc: 'Submit official transcripts from prior academic institutions, medical immunizations, and letters of academic recommendation.',
    },
    {
      num: '04',
      title: 'Head of School Dialogue',
      desc: 'An intimate 30-minute dialogue with the Admissions Director and faculty advisors to align family expectations and student ambitions.',
    },
    {
      num: '05',
      title: 'Admission Confirmation',
      desc: 'Formal offer letter dispatched, house assignment issued, and onboarding portal credentials generated for the student.',
    },
  ];

  const faqs = [
    {
      q: 'What is the student-to-teacher ratio at HORIZONTAL?',
      a: 'We maintain a strict 12:1 student-to-teacher ratio across all classrooms and a maximum of 24 scholars per seminar.',
    },
    {
      q: 'Are merit and financial scholarships available?',
      a: 'Yes. HORIZONTAL awards Dean\'s Academic Scholarships and Need-Blind Financial Aid to approximately 18% of enrolled students annually.',
    },
    {
      q: 'Does HORIZONTAL accept mid-year transfers?',
      a: 'Mid-year admissions are reviewed on a rolling basis subject to seat availability in the desired grade and strong academic standing.',
    },
    {
      q: 'What transport facilities are provided?',
      a: 'Our school maintains a fleet of GPS-tracked, air-conditioned buses covering 18 regional routes with trained safety escorts.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Admissions 2026–2027
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Join the Scholarly Community of HORIZONTAL
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          We welcome intellectually curious, energetic students eager to embrace academic challenge, artistic expression, and ethical leadership.
        </p>
      </div>

      {/* 2. Admission Process Steps */}
      <section className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            The Journey
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Five-Step Admission Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-stone-200 rounded-xl relative space-y-3 hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-amber-800 block mb-2">
                  {st.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {st.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {st.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-xs text-stone-400 font-mono">
                Step {idx + 1} of 5
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Real Working Admission Enquiry Form (Connected to Flask + SQLite) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="enquiry-form">
        
        {/* Form Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Direct Application
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Submit an Admission Enquiry
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Please complete this formal inquiry. Upon submission, your application details are securely validated and registered into our database. Our Admissions Secretariat will contact you to schedule testing.
          </p>

          <div className="p-6 bg-stone-100 border border-stone-200 rounded-xl space-y-4 text-xs text-stone-700">
            <div className="font-semibold text-stone-900 text-sm">
              Key Dates for 2026–2027 Admissions:
            </div>
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span>Early Application Deadline</span>
              <span className="font-mono font-medium">November 15, 2026</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span>Diagnostic Assessment Window</span>
              <span className="font-mono font-medium">December 01–15, 2026</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span>Regular Decision Notification</span>
              <span className="font-mono font-medium">January 10, 2027</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Term-I Academic Commencement</span>
              <span className="font-mono font-medium">August 24, 2027</span>
            </div>
          </div>
        </div>

        {/* Real Form Column */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          {successResponse ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-emerald-950">
                Enquiry Successfully Logged
              </h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {successResponse.message}
              </p>
              <div className="text-xs font-mono text-emerald-700 bg-white p-2 rounded border border-emerald-200 inline-block">
                Registered Application ID: #{successResponse.enquiry_id}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    placeholder="e.g. Julian Montgomery"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    placeholder="e.g. Dr. Arthur Montgomery"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Grade Applying For *
                  </label>
                  <select
                    value={formData.grade_applying_for}
                    onChange={(e) => setFormData({ ...formData, grade_applying_for: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                  >
                    {gradeOptions.map((g, idx) => (
                      <option key={idx} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Previous School / Current Institution
                </label>
                <input
                  type="text"
                  value={formData.previous_school}
                  onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                  placeholder="e.g. St. Jude Preparatory School"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Applicant Interests & Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the student's extracurricular passions, academic goals, or any questions for the Admissions Office..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering with Database...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Admission Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-stone-500">
                🔒 Data is transmitted securely to HORIZONTAL School's Python Flask backend and stored in SQLite.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Admissions Questions & Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="p-5 bg-white border border-stone-200 rounded-xl space-y-2">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{f.q}</span>
              </h3>
              <p className="text-sm text-stone-600 pl-6 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
