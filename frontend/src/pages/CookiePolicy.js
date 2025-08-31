import React from 'react';
import { Cookie, Settings, BarChart, Target, Shield, Mail, Phone } from 'lucide-react';

const CookiePolicy = () => {
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
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">Cookie Policy</h1>
              <p className="text-yellow-200 text-xl font-medium">EpicEdge Creative</p>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
            This policy explains how we use cookies and similar technologies to provide and improve our services.
          </p>
          <p className="text-sm text-yellow-200/80 mt-6 font-medium">Last updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100/50 p-10 space-y-10">
          
          {/* What Are Cookies */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">What Are Cookies?</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They help websites remember information about your visit, such as your preferred language and other settings.
              </p>
              <p>
                We use cookies and similar technologies (such as web beacons, pixels, and local storage) to enhance your 
                experience on our website and provide you with relevant content and services.
              </p>
            </div>
          </section>

          {/* Types of Cookies */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Types of Cookies We Use</h2>
            </div>
            <div className="space-y-6 text-gray-700">
              
              {/* Essential Cookies */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Essential Cookies
                </h3>
                <p className="mb-2">These cookies are necessary for our website to function properly and cannot be turned off.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Authentication and security cookies</li>
                  <li>Session management cookies</li>
                  <li>Load balancing cookies</li>
                  <li>Form submission cookies</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <BarChart className="w-4 h-4 text-white" />
                  </div>
                  Analytics Cookies
                </h3>
                <p className="mb-2">These cookies help us understand how visitors interact with our website.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Google Analytics cookies</li>
                  <li>Page view tracking</li>
                  <li>User behavior analysis</li>
                  <li>Performance monitoring</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2 italic">You can opt out of these cookies without affecting website functionality.</p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Functional Cookies
                </h3>
                <p className="mb-2">These cookies enable enhanced functionality and personalization.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Language preferences</li>
                  <li>Theme settings (dark/light mode)</li>
                  <li>Form auto-fill preferences</li>
                  <li>Chat widget settings</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Marketing Cookies
                </h3>
                <p className="mb-2">These cookies help us show you relevant content and measure campaign effectiveness.</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Social media integration</li>
                  <li>Conversion tracking</li>
                  <li>Retargeting pixels</li>
                  <li>Email campaign tracking</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2 italic">You can opt out of these cookies in your browser settings.</p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Third-Party Cookies</h2>
              <p>
                Some cookies are set by third-party services that appear on our pages. We use the following third-party services:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Google Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">Website traffic and user behavior analysis</p>
                  <a href="https://policies.google.com/privacy" className="text-amber-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                    Google Privacy Policy
                  </a>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Social Media Platforms</h4>
                  <p className="text-sm text-gray-600 mt-1">Social sharing and integration features</p>
                  <p className="text-amber-600 text-sm">Various privacy policies apply</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Payment Processors</h4>
                  <p className="text-sm text-gray-600 mt-1">Secure payment processing and fraud prevention</p>
                  <p className="text-amber-600 text-sm">Processor-specific policies apply</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">Customer Support Tools</h4>
                  <p className="text-sm text-gray-600 mt-1">Live chat and help desk functionality</p>
                  <p className="text-amber-600 text-sm">Tool-specific policies apply</p>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Managing Your Cookie Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Browser Settings</h3>
                  <p>You can control cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-xl border border-yellow-300">
                  <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Important Note
                  </h3>
                  <p>
                    Disabling certain cookies may affect the functionality of our website. Essential cookies cannot be 
                    disabled as they are necessary for the website to function properly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-amber-700 border-l-4 border-amber-400 pl-4">Opt-Out Options</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">Browser Opt-out Add-on</a></li>
                    <li>Marketing cookies: Use your browser's privacy settings</li>
                    <li>Social media cookies: Adjust settings on respective platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Lifespan */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Cookie Lifespan</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-amber-800">Session Cookies</h4>
                  <p className="text-sm text-gray-600">Deleted when you close your browser</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-amber-800">Persistent Cookies</h4>
                  <p className="text-sm text-gray-600">Remain until expiry date or manual deletion</p>
                </div>
              </div>
              <p>
                Most of our cookies expire within 1-2 years, but some essential cookies may last longer to maintain 
                security and functionality.
              </p>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <div className="space-y-4 text-gray-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-700 bg-clip-text text-transparent">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                We will post any updates on this page and update the "Last updated" date.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent mb-6">Questions About Cookies?</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
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
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
