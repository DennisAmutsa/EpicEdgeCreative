import React from 'react';
import { ShieldCheck, Database, Lock, Eye, Globe, FileText, Mail, Phone } from 'lucide-react';

const DataProtection = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-500 text-white py-20 relative overflow-hidden">
        {/* Hero background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-x-32 translate-y-32"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Data Protection</h1>
              <p className="text-yellow-200 text-xl font-medium">EpicEdge Creative</p>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            We are committed to protecting your personal data and respecting your privacy rights under applicable data protection laws.
          </p>
          <p className="text-sm text-yellow-200/80 mt-6 font-medium">Last updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100/50 p-10 space-y-10">
          
          {/* Our Commitment */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Our Commitment to Data Protection</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                At EpicEdge Creative, we recognize that your personal data is valuable and deserves protection. 
                We are committed to processing your personal data lawfully, fairly, and transparently in accordance 
                with applicable data protection regulations.
              </p>
              <p>
                This Data Protection policy outlines how we collect, use, store, and protect your personal information, 
                and explains your rights regarding your data.
              </p>
            </div>
          </section>

          {/* Legal Basis */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Legal Basis for Processing</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We process your personal data under the following legal bases:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contractual Necessity</h4>
                  <p className="text-sm text-gray-600">
                    Processing necessary to perform our contract with you or take steps to enter into a contract.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legitimate Interests</h4>
                  <p className="text-sm text-gray-600">
                    Processing for our legitimate business interests, balanced against your rights and interests.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Consent</h4>
                  <p className="text-sm text-gray-600">
                    Processing based on your freely given, specific, and informed consent.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Obligation</h4>
                  <p className="text-sm text-gray-600">
                    Processing necessary to comply with legal obligations to which we are subject.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data We Collect */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Personal Data We Collect</h2>
            </div>
            <div className="space-y-6 text-gray-700">
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Identity Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Full name</li>
                  <li>Job title and company</li>
                  <li>Professional credentials</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Contact Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Email addresses</li>
                  <li>Phone numbers</li>
                  <li>Postal addresses</li>
                  <li>Social media profiles</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Technical Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>IP addresses and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Website usage analytics</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Project Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Project requirements and specifications</li>
                  <li>Communication history</li>
                  <li>File uploads and shared documents</li>
                  <li>Feedback and reviews</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">How We Protect Your Data</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We implement comprehensive security measures to protect your personal data:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4 mb-4">Technical Safeguards</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>End-to-end encryption for data transmission</li>
                    <li>AES-256 encryption for data at rest</li>
                    <li>Multi-factor authentication</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Automated backup and disaster recovery</li>
                    <li>Secure hosting infrastructure</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4 mb-4">Organizational Measures</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Staff training on data protection</li>
                    <li>Access controls and role-based permissions</li>
                    <li>Regular security awareness programs</li>
                    <li>Incident response procedures</li>
                    <li>Vendor security assessments</li>
                    <li>Privacy by design principles</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Your Data Protection Rights</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Under data protection law, you have several rights regarding your personal data:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-amber-800">Right of Access</h4>
                  <p className="text-sm text-gray-600">Request copies of your personal data we hold</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-amber-800">Right to Rectification</h4>
                  <p className="text-sm text-gray-600">Request correction of inaccurate or incomplete data</p>
                </div>
                
                <div className="border-l-4 border-amber-600 pl-4">
                  <h4 className="font-semibold text-amber-800">Right to Erasure</h4>
                  <p className="text-sm text-gray-600">Request deletion of your personal data (right to be forgotten)</p>
                </div>
                
                <div className="border-l-4 border-yellow-600 pl-4">
                  <h4 className="font-semibold text-amber-800">Right to Restrict Processing</h4>
                  <p className="text-sm text-gray-600">Request limitation of how we process your data</p>
                </div>
                
                <div className="border-l-4 border-amber-700 pl-4">
                  <h4 className="font-semibold text-amber-800">Right to Data Portability</h4>
                  <p className="text-sm text-gray-600">Request transfer of your data to another organization</p>
                </div>
                
                <div className="border-l-4 border-yellow-700 pl-4">
                  <h4 className="font-semibold text-amber-800">Right to Object</h4>
                  <p className="text-sm text-gray-600">Object to processing based on legitimate interests or direct marketing</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-xl border border-yellow-300 mt-8">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  Response Time
                </h4>
                <p className="text-sm text-gray-700">
                  We will respond to your requests within 30 days. If your request is complex or we receive multiple requests, 
                  we may extend this period by up to 60 days, and we will inform you of any such extension.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Data Retention</h2>
              <p>We retain your personal data only for as long as necessary for the purposes outlined in our Privacy Policy:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Account Data</h4>
                  <p className="text-sm text-gray-600 mt-1">Retained for the duration of your account plus 7 years for legal compliance</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Project Data</h4>
                  <p className="text-sm text-gray-600 mt-1">Retained for 7 years after project completion for warranty and legal purposes</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Marketing Data</h4>
                  <p className="text-sm text-gray-600 mt-1">Retained until you withdraw consent or request deletion</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Analytics Data</h4>
                  <p className="text-sm text-gray-600 mt-1">Anonymized data retained for up to 26 months for business insights</p>
                </div>
              </div>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">International Data Transfers</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We may transfer your personal data to countries outside of Kenya for processing and storage. 
                When we do so, we ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Adequacy decisions by relevant authorities</li>
                <li>Standard contractual clauses approved by supervisory authorities</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Binding corporate rules for intra-group transfers</li>
              </ul>
            </div>
          </section>

          {/* Data Breach Response */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Data Breach Response</h2>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  In Case of a Data Breach
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>We will notify supervisory authorities within 72 hours</li>
                  <li>Affected individuals will be notified without undue delay if high risk is likely</li>
                  <li>We will provide clear information about the nature of the breach</li>
                  <li>We will recommend steps you can take to protect yourself</li>
                  <li>We will implement measures to address the breach and prevent future occurrences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent mb-6">Data Protection Contact</h2>
            <p className="text-gray-700 mb-4">
              For any questions about data protection, to exercise your rights, or to report concerns:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>epicedgecreative@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+254787205456</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You also have the right to lodge a complaint with your local data protection supervisory authority.
            </p>
          </section>

          {/* Updates */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent mb-4">Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Data Protection policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. We will post any updates on this page and 
              notify you of significant changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
