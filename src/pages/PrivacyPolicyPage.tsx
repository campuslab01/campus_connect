import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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

        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/20 pb-4">Privacy Policy</h1>

        <div className="max-w-none text-white/80 space-y-6">
          <p className="text-sm text-white/60">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Campus Connection ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application (the "Platform").
              This policy is drafted in accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDP Act) of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you register on the Platform.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li><strong>Personal Data:</strong> Name, email address, age, gender, college/university details.</li>
              <li><strong>Profile Data:</strong> Photographs, bio, interests, and preferences.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with the Platform, such as likes, matches, and messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li>Create and manage your account.</li>
              <li>Provide matching services and connect you with other students.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Ensure the safety and security of our Platform (e.g., age verification, content moderation).</li>
              <li>Communicate with you regarding updates, offers, and customer service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li><strong>Service Providers:</strong> We may share your information with third-party vendors who perform services for us, such as payment processing (e.g., Instamojo), data analysis, and email delivery.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Storage and Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. 
              However, please be aware that no electronic transmission over the Internet or information storage technology is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to request correction of inaccurate personal data.</li>
              <li>The right to request deletion of your account and personal data.</li>
            </ul>
          </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Third-Party Websites</h2>
          <p>
            The Platform may contain links to third-party websites. We are not responsible for the safety or privacy practices of such third parties. 
            We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
        </section>

         <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Grievance Officer & Redressal Mechanism (India)</h2>
          <p>
            In line with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have designated a Grievance Officer to handle user complaints, content takedown requests, and data/privacy related issues.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Grievance Officer:</strong> Campus Connection – Grievance Officer</li>
            <li><strong>Email:</strong> grievance@campusconnect.co</li>
            <li><strong>Response Time:</strong> Complaints are acknowledged within 24 hours and typically resolved within 72 hours.</li>
            <li><strong>Scope:</strong> User complaints, privacy requests (access/correction/deletion), content moderation appeals, and legal notices.</li>
          </ul>
        </section>
 
         <section>
           <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
           <p>
             If you have questions or comments about this Privacy Policy, please contact us at support@campusconnect.co.
           </p>
         </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
