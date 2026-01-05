import React from 'react';
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, UserCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
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

        <h1 className="text-3xl font-bold text-white mb-2">Community Guidelines & Rules</h1>
        <p className="text-white/80 mb-8">
          To ensure a safe and positive experience for everyone, please adhere to the following rules.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
            
            {/* Safety First */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/15">
                <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-purple-300 mr-2" />
                    <h2 className="text-lg font-bold text-white">Safety & Security</h2>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                    <li>• <strong>Strictly 18+:</strong> You must be 18 years or older to use this platform.</li>
                    <li>• <strong>No Fake Profiles:</strong> Impersonation is not tolerated.</li>
                    <li>• <strong>Verify Your Profile:</strong> We encourage all users to verify their profiles for a safer community.</li>
                </ul>
            </div>

            {/* Respect */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/15">
                <div className="flex items-center mb-4">
                    <Heart className="w-6 h-6 text-blue-300 mr-2" />
                    <h2 className="text-lg font-bold text-white">Respect & Kindness</h2>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                    <li>• <strong>Be Respectful:</strong> Treat others with kindness and respect.</li>
                    <li>• <strong>No Harassment:</strong> Bullying, stalking, or harassment of any kind will result in an immediate ban.</li>
                    <li>• <strong>Consent Matters:</strong> Always respect personal boundaries.</li>
                </ul>
            </div>

            {/* Prohibited Content */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/15">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-300 mr-2" />
                    <h2 className="text-lg font-bold text-white">Prohibited Content (Zero Tolerance)</h2>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                    <li>• <strong>No Adult Content:</strong> Nudity, pornography, and sexually explicit content are strictly prohibited.</li>
                    <li>• <strong>No Solicitation:</strong> Escorting, prostitution, or transactional relationships are not allowed.</li>
                    <li>• <strong>No Illegal Activities:</strong> Promotion of illegal acts or substances is banned.</li>
                </ul>
            </div>

            {/* Reporting */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/15">
                <div className="flex items-center mb-4">
                    <UserCheck className="w-6 h-6 text-green-300 mr-2" />
                    <h2 className="text-lg font-bold text-white">Reporting & Enforcement</h2>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                    <li>• <strong>Report Violations:</strong> Use the in-app reporting feature to flag inappropriate behavior.</li>
                    <li>• <strong>Account Suspension:</strong> Violating these rules may lead to temporary or permanent account suspension.</li>
                    <li>• <strong>Cooperation:</strong> We cooperate with law enforcement for any illegal activities.</li>
                </ul>
            </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
             <p className="text-center text-white/70 text-sm">
                By using Campus Connection, you agree to abide by these rules. We want to build a genuine community for students to connect, network, and find friends.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
