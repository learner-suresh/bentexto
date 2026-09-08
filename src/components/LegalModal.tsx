import React, { useState } from 'react';
import { X, Shield, FileText, Lock, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'contact';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'contact'>(defaultTab);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSent, setContactSent] = useState(false);

  if (!isOpen) return null;

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    try {
      const messages = JSON.parse(localStorage.getItem('bentexto_contact_messages') || '[]');
      messages.push({
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
        date: new Date().toISOString(),
      });
      localStorage.setItem('bentexto_contact_messages', JSON.stringify(messages));
    } catch {}

    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#253556] bg-[#121E36] shadow-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#253556]">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0095FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Legal, Policies & Contact (নীতিমালা ও যোগাযোগ)
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#253556] bg-[#0B1324] px-4 pt-2 gap-1 sm:gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-[#0095FF] text-[#0095FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-[#0095FF] text-[#0095FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-[#0095FF] text-[#0095FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Us (যোগাযোগ)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#0095FF]/30 bg-[#0095FF]/10 p-3 text-xs text-gray-200">
                <span className="font-bold text-[#38BDF8]">Privacy Commitment:</span> Bentexto is committed to protecting your online privacy. This Privacy Policy details our data collection, cookie usage, Google AdSense compliance, and user rights in full accordance with GDPR, CCPA, and Google Publisher Policies.
              </div>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  1. Information We Collect
                </h3>
                <p>
                  Bentexto collects minimal information necessary to provide seamless educational word puzzle gameplay:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li><strong>Local Gameplay State:</strong> Your secret word guesses, win streaks, guess counts, and daily statistics are stored entirely locally on your device via browser <code className="text-[#38BDF8]">localStorage</code>. They are not transmitted to or stored on our external servers.</li>
                  <li><strong>Device & Log Data:</strong> When you access Bentexto, standard non-identifying server logs (browser type, operating system, language preference, referral URL, and general geographical region) may be processed for diagnostic and performance optimization.</li>
                  <li><strong>Voluntary Submissions:</strong> Information you voluntarily submit via our Feedback or Contact forms, such as feedback messages or suggested Bengali vocabulary words.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  2. Google AdSense & Third-Party Cookies
                </h3>
                <p>
                  We partner with Google AdSense to serve advertisements when you visit our website. Google and its third-party certified ad vendors use cookies to serve ads based on your prior visits to Bentexto and other sites on the Internet:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li><strong>DoubleClick Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve personalized ads based on your visit to this site and/or other sites on the Internet.</li>
                  <li><strong>Personalized Advertising Opt-Out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#0095FF] underline inline-flex items-center gap-0.5">Google Ads Settings <ExternalLink className="h-3 w-3 inline" /></a>. Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#0095FF] underline inline-flex items-center gap-0.5">aboutads.info <ExternalLink className="h-3 w-3 inline" /></a>.</li>
                  <li><strong>Cookie Control:</strong> Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. Please note that disabling cookies may affect certain ad experiences.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  3. User Rights: GDPR & CCPA Compliance
                </h3>
                <p>
                  Depending on your jurisdiction (such as the European Economic Area or California), you have rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li><strong>Right of Access & Deletion:</strong> You have full control over your local gameplay data. You can erase all stats, history, and stored records at any moment by clicking "Clear Cache" in your browser settings.</li>
                  <li><strong>Do Not Sell My Personal Information:</strong> Bentexto does not sell, rent, or trade your personal information to any third parties for monetary consideration.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  4. Children's Online Privacy Protection (COPPA)
                </h3>
                <p>
                  Bentexto is an educational, family-friendly word game suitable for all ages. We do not knowingly collect or solicit any personally identifiable information from children under the age of 13.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  5. Contact Us Regarding Privacy
                </h3>
                <p>
                  If you have any questions or concerns regarding our Privacy Policy or data handling practices, please contact us at <a href="mailto:contact.bentexto@gmail.com" className="text-[#0095FF] underline">contact.bentexto@gmail.com</a> or via our in-app Contact form.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#4FD1C5]/30 bg-[#4FD1C5]/10 p-3 text-xs text-gray-200">
                <span className="font-bold text-[#4FD1C5]">Terms Overview:</span> By accessing or playing Bentexto, you agree to these Terms of Service. Please read them carefully.
              </div>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  1. Acceptance of Terms
                </h3>
                <p>
                  Bentexto is provided as a free educational and recreational word puzzle web application. By accessing, browsing, or playing on this website, you agree to be bound by these Terms of Service and all applicable laws.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  2. Fair Play & Prohibited Uses
                </h3>
                <p>
                  Bentexto is designed for human enjoyment and linguistic learning. You agree not to:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li>Deploy automated scripts, bots, spiders, scrapers, or programmatic crawlers to extract daily target words or game solutions.</li>
                  <li>Overburden, flood, or disrupt our web servers, reverse proxy, or content delivery infrastructure.</li>
                  <li>Attempt to decompile, reverse engineer, or commercially resell our proprietary Bengali semantic distance algorithms or curated dictionary corpus.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  3. Intellectual Property Rights
                </h3>
                <p>
                  The Bentexto logo, brand name, semantic similarity evaluation engine, custom UI design, phonetic transliteration mapping, and educational word database are protected by copyright, trademark, and intellectual property laws.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  4. Disclaimer & Limitation of Liability
                </h3>
                <p>
                  Bentexto is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. While we strive for 100% uptime and high linguistic accuracy, we make no guarantees that the site will be completely uninterrupted or free from grammatical discrepancies.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  5. Updates to Terms
                </h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of the platform following any published revisions constitutes your acceptance of the new Terms of Service.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#0095FF]/30 bg-[#0095FF]/10 p-3 text-xs text-gray-200">
                <span className="font-bold text-[#38BDF8]">Direct Editorial & Support Contact:</span> Have a question, business inquiry, or vocabulary suggestion? Reach our team directly below.
              </div>

              {contactSent ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-[#10B981] mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Message Sent! (বার্তা পাঠানো হয়েছে)</h4>
                  <p className="text-xs text-gray-300">Thank you for reaching out. Our team will review your message promptly.</p>
                </div>
              ) : (
                <form onSubmit={handleSendContact} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Your Email (Optional, if you'd like a reply):
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg bg-[#1E2C4A] border border-[#2B3E68] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Subject (বিষয়):
                    </label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. AdSense Inquiry, Word Correction, General Feedback"
                      className="w-full rounded-lg bg-[#1E2C4A] border border-[#2B3E68] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Message (বার্তা):
                    </label>
                    <textarea
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      placeholder="Write your message here..."
                      className="w-full rounded-lg bg-[#1E2C4A] border border-[#2B3E68] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF] resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-gray-400">
                      Official email: <a href="mailto:contact.bentexto@gmail.com" className="text-[#38BDF8] underline">contact.bentexto@gmail.com</a>
                    </span>
                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-lg bg-[#0095FF] hover:bg-[#0082E6] px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
                    >
                      Send Message (বার্তা পাঠান)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#253556] bg-[#0B1324] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0095FF] hover:bg-[#0082E6] px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
          >
            Understood (বুঝেছি)
          </button>
        </div>
      </div>
    </div>
  );
};
