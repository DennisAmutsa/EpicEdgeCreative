import React from 'react';
import { FileText, Users, DollarSign, AlertTriangle, Scale, Mail, Phone } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Terms of Service</h1>
              <p className="text-yellow-200 text-xl font-medium">EpicEdge Creative</p>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            These terms govern your use of our services and establish the legal relationship between you and EpicEdge Creative.
          </p>
          <p className="text-sm text-yellow-200/80 mt-6 font-medium">Last updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100/50 p-10 space-y-10">
          
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                By accessing and using EpicEdge Creative's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and EpicEdge Creative ("Company", "we", "us", or "our") concerning your access to and use of our services.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Our Services</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>EpicEdge Creative provides the following services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom web application development</li>
                <li>Mobile application development</li>
                <li>Database design and integration</li>
                <li>Software consulting and architecture</li>
                <li>Virtual assistance services</li>
                <li>Educational support and mentorship</li>
                <li>Digital transformation solutions</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">User Responsibilities</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>As a user of our services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use our services in compliance with applicable laws</li>
                <li>Not engage in any unauthorized or harmful activities</li>
                <li>Respect intellectual property rights</li>
                <li>Communicate professionally and respectfully</li>
                <li>Provide timely feedback and approvals as requested</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Payment Terms</h2>
            </div>
            <div className="space-y-4 text-gray-700">
                              <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Pricing and Billing</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Project costs are determined based on scope, complexity, and timeline</li>
                <li>Payment schedules are outlined in individual project agreements</li>
                <li>Invoices are typically due within 30 days of issuance</li>
                <li>Late payments may incur additional fees</li>
                <li>All prices are in USD unless otherwise specified</li>
              </ul>
              
                              <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4 mt-8">Refund Policy</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refunds are considered on a case-by-case basis</li>
                <li>Work completed cannot be refunded</li>
                <li>Cancellations must be made in writing</li>
                <li>Refund requests must be submitted within 30 days</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Client Ownership</h3>
                  <p>Upon full payment, clients retain ownership of:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Custom code developed specifically for their project</li>
                    <li>Design assets created for their brand</li>
                    <li>Business-specific content and data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Company Ownership</h3>
                  <p>EpicEdge Creative retains ownership of:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>General methodologies and frameworks</li>
                    <li>Pre-existing code libraries and tools</li>
                    <li>Company branding and marketing materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Confidentiality */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Confidentiality</h2>
              <p>
                We understand the importance of protecting your confidential information. We commit to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keeping all client information strictly confidential</li>
                <li>Using information only for the purpose of providing services</li>
                <li>Implementing appropriate security measures</li>
                <li>Not disclosing information to third parties without consent</li>
                <li>Returning or destroying confidential materials upon request</li>
              </ul>
            </div>
          </section>

          {/* Service Limitations */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Service Limitations and Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Services are provided "as is" without warranties</li>
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Project timelines are estimates and may be subject to change</li>
                <li>We are not liable for third-party service interruptions</li>
                <li>Liability is limited to the amount paid for services</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Termination</h2>
              <p>Either party may terminate the service agreement:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With 30 days written notice for ongoing services</li>
                <li>Immediately for breach of contract</li>
                <li>Upon completion of project deliverables</li>
                <li>By mutual agreement</li>
              </ul>
              <p className="mt-4">
                Upon termination, you will pay for all services performed up to the termination date.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of Kenya. 
                Any disputes arising from these terms will be resolved through arbitration or in the courts of Kenya.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us:
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

          {/* Changes to Terms */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent mb-4">Changes to These Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
