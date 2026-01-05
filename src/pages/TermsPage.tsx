import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
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

        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/20 pb-4">Terms and Conditions</h1>

        <div className="max-w-none text-white/80 space-y-6">
          <p className="text-sm text-white/60">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to Campus Connection. These Terms and Conditions ("Terms") govern your use of our website and mobile application (collectively, the "Platform"). 
              By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use the Platform.
            </p>
            <p className="mt-2">
              The Platform is operated in India and these Terms are governed by the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use this Platform. By using the Platform, you represent and warrant that you are at least 18 years old. 
              We strictly prohibit the use of our services by anyone under the age of 18.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration and Security</h2>
            <p>
              To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. User Conduct and Content</h2>
          <p>
            Campus Connection is a social discovery and networking platform. We maintain a strict zero-tolerance policy towards illegal, explicit, or harmful content.
          </p>
          <p className="font-semibold mt-2">Prohibited Activities:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
            <li>Posting or sharing sexually explicit, pornographic, or obscene content.</li>
            <li>Engaging in solicitation, prostitution, or escort services.</li>
            <li>Harassing, bullying, defaming, or threatening other users.</li>
            <li>Promoting illegal activities or hate speech.</li>
            <li>Creating fake profiles or impersonating others.</li>
          </ul>
          <p className="mt-2">
            The platform does not arrange, facilitate, or guarantee physical meetings. All interactions are voluntary and at users&apos; discretion.
          </p>
          <p className="mt-2">
            We reserve the right to terminate or suspend your account immediately if you violate these rules.
          </p>
        </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Content Moderation</h2>
            <p>
              We employ both automated and manual moderation tools to ensure compliance with our community guidelines. 
              We reserve the right to remove any content that violates these Terms or is deemed inappropriate, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Payments and Refunds</h2>
            <p>
              Certain features of the Platform may be subject to a fee. All payments are processed through secure third-party payment gateways (e.g., Instamojo, Razorpay).
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li><strong>Refund Policy:</strong> Purchases are generally non-refundable unless otherwise required by law or specified in a particular offer.</li>
              <li><strong>Cancellations:</strong> You may cancel your subscription at any time, but you will not be refunded for the current billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Indian law, Campus Connection shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms 
              shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@campusconnect.co.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Grievance Redressal (India)</h2>
          <p>
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have appointed a Grievance Officer to address user complaints, content takedown requests, and data/privacy concerns.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
            <li><strong>Grievance Officer:</strong> Campus Connection – Grievance Officer</li>
            <li><strong>Email:</strong> grievance@campusconnect.co</li>
            <li><strong>Response Time:</strong> We acknowledge complaints within 24 hours and aim to resolve them within 72 hours, subject to complexity.</li>
            <li><strong>Scope:</strong> User complaints, content moderation appeals, privacy/data requests, and legal notices.</li>
          </ul>
        </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
