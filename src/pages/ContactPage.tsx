import React, { useState } from 'react';
import { api } from '../services/api';
import { firestoreSync } from '../services/firestoreSync';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{ message: string; message_id: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessResponse(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in your name, email, subject, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContactMessage(formData);
      setSuccessResponse(res);
      // Synchronize with Firestore
      try {
        await firestoreSync.submitContactMessage(res.message_id || Date.now(), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'Unread',
        });
      } catch (fsErr) {
        console.warn('Firestore sync note:', fsErr);
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deliver message. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Connect with HORIZONTAL
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Whether you are an inquiring parent, prospective student, visiting scholar, or community partner, we welcome your correspondence.
        </p>
      </div>

      {/* 2. Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Campus Address</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            100 Horizon Boulevard, Centennial Quad<br />
            Cambridge Academic Corridor<br />
            MA 02138, United States
          </p>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
            <Phone className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Telephone Lines</h3>
          <div className="text-xs text-stone-600 space-y-1">
            <div>General: +1 (555) 749-3000</div>
            <div>Admissions: +1 (555) 749-3012</div>
            <div>Registrar: +1 (555) 749-3025</div>
          </div>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
            <Mail className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Electronic Mail</h3>
          <div className="text-xs text-stone-600 space-y-1">
            <div>Admissions: admissions@horizontal.edu</div>
            <div>Administration: info@horizontal.edu</div>
            <div>Principal: principal@horizontal.edu</div>
          </div>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-800" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Office Hours</h3>
          <div className="text-xs text-stone-600 space-y-1">
            <div>Monday – Friday: 08:00 – 16:30</div>
            <div>Saturday: 09:00 – 13:00 (Admissions)</div>
            <div>Sunday: Closed for Observance</div>
          </div>
        </div>

      </div>

      {/* 3. Real Contact Form & Campus Transit Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Real Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Send a Verified Message
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Your inquiry is directly recorded into our administrative database for triage.
            </p>
          </div>

          {successResponse ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-950">
                Message Received by Secretariat
              </h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {successResponse.message}
              </p>
              <div className="text-xs font-mono text-emerald-700 bg-white p-2 rounded border border-emerald-200 inline-block">
                Reference ID: MSG-2026-00{successResponse.message_id}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Communication
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Katherine Vance"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="katherine@domain.org"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Campus Tour Inquiry or Faculty Collaboration"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide detailed context regarding your communication..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Recording message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Secretariat</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Transit & Campus Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Visiting Protocols
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Campus Access & Security
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              All visitors must report to Security Gate 1 on Horizon Boulevard with valid state or federal identification. Visitor badges are issued at the Welcome Pavilion.
            </p>
            <div className="space-y-2 pt-2 border-t border-stone-200 text-xs text-stone-700">
              <div>🚗 <strong>Parking:</strong> North Visitor Quad parking bays (complimentary 3-hour permit provided).</div>
              <div>🚆 <strong>Metro Transit:</strong> 6-minute walk from Centennial Academic Station (Line 2).</div>
              <div>♿ <strong>Accessibility:</strong> Full elevator and motorized ramp accessibility across all 64 campus buildings.</div>
            </div>
          </div>

          <div className="p-6 bg-amber-950 text-white rounded-2xl space-y-3">
            <h4 className="font-serif text-lg font-bold text-white">Emergency Campus Line</h4>
            <p className="text-xs text-amber-100 leading-relaxed">
              For immediate campus security or emergency dispatch, 24 hours a day, 7 days a week:
            </p>
            <div className="text-base font-mono font-bold text-amber-300">
              +1 (555) 749-9911
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
