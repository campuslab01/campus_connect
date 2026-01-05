import React from 'react';
import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            className="flex items-center text-white/80 hover:text-white transition-colors"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Open in new tab
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Contact & Support</h1>
        <p className="text-white/80 mb-8">
          Campus Connection is a student-first platform to discover friends and build genuine connections. Reach us anytime using the contact below.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white/10 p-6 rounded-xl border border-white/15">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-300 mr-2" />
              <h2 className="text-lg font-bold text-white">Official Contact</h2>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                Email: <a href="mailto:support@campusconnect.co" className="text-blue-300 hover:underline">support@campusconnect.co</a>
              </li>
              <li>Support Hours: 10:00–18:00 IST, Mon–Sat</li>
            </ul>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/15">
            <div className="flex items-center mb-4">
              <ShieldCheck className="w-6 h-6 text-purple-300 mr-2" />
              <h2 className="text-lg font-bold text-white">Grievance & Redressal</h2>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Grievance Officer: Campus Connection – Grievance Officer</li>
              <li>Email: <a href="mailto:grievance@campusconnect.co" className="text-purple-300 hover:underline">grievance@campusconnect.co</a></li>
              <li>Acknowledgment within 24 hours; typical resolution within 72 hours</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-center text-white/70 text-sm">
            For legal terms, see <a href="/terms" className="text-blue-300 hover:underline">Terms</a>, <a href="/privacy" className="text-blue-300 hover:underline">Privacy</a>, and <a href="/rules" className="text-blue-300 hover:underline">Rules</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
