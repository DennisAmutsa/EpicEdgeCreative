import React from 'react';
import { Shield, Eye, Database, Lock, Globe, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Privacy Policy</h1>
              <p className="text-yellow-200 text-xl font-medium">EpicEdge Creative</p>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-yellow-200/80 mt-6 font-medium">Last updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100/50 p-10 space-y-10">
          
          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Company name and business information</li>
                <li>Project requirements and specifications</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4 mt-8">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Website usage analytics</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our software development services</li>
                <li>Communicate about projects and updates</li>
                <li>Process payments and billing</li>
                <li>Send important service notifications</li>
                <li>Respond to customer support requests</li>
                <li>Analyze website usage to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Information Sharing</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist in our operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Data Security</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure hosting and data storage</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Your Rights</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. For detailed information, see our Cookie Policy.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>epicedgecreative@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+254787205456</span>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent mb-4">Policy Updates</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
