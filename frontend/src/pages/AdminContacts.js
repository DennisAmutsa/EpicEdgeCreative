import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  Search,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Clock,
  MessageSquare,
  Building
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchContacts();
  }, [filter, pagination.currentPage]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page: pagination.currentPage,
        limit: 10
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await axios.get('http://localhost:5000/api/contact', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setContacts(response.data.data.contacts);
        setPagination({
          currentPage: response.data.data.currentPage,
          totalPages: response.data.data.totalPages,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:5000/api/contact/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Message marked as ${status}`);
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update message status');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`http://localhost:5000/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Message deleted successfully');
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete message');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'web-development':
        return '🌐';
      case 'virtual-assistance':
        return '💼';
      case 'educational-support':
        return '🎓';
      case 'pricing':
        return '💰';
      case 'partnership':
        return '🤝';
      case 'callback-request':
        return '📞';
      default:
        return '💬';
    }
  };

  // Helper function to extract email from callback request messages
  const getReplyEmail = (contact) => {
    // For callback requests, try to extract email from message content
    if (contact.subject === 'callback-request' && contact.message) {
      const emailMatch = contact.message.match(/Email:\s*([^\s\n]+@[^\s\n]+)/);
      if (emailMatch) {
        return emailMatch[1];
      }
    }
    // Fallback to contact.email
    return contact.email;
  };

  // Helper function to get the contact name for callback requests
  const getContactName = (contact) => {
    // For callback requests, try to extract name from message content
    if (contact.subject === 'callback-request' && contact.message) {
      const nameMatch = contact.message.match(/Name:\s*([^\n]+)/);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }
    // Fallback to contact.fullName
    return contact.fullName;
  };

  // Function to handle email reply with proper Gmail integration
  const handleEmailReply = (contact) => {
    const email = getReplyEmail(contact);
    const name = getContactName(contact);
    
    let subject, body;
    
    if (contact.subject === 'callback-request') {
      subject = `Re: Your Callback Request - ${name}`;
      body = `Hello ${name},

Thank you for your callback request. I received your inquiry and would be happy to discuss your project requirements with you.

I'll be calling you at your preferred time, but I wanted to reach out via email first to confirm the details and see if you have any specific questions or requirements you'd like to discuss.

Please feel free to reply to this email with any additional information about your project, and I'll make sure to address everything during our call.

Looking forward to speaking with you soon!

Best regards,
EpicEdge Creative Team
Phone: +254 787 205 456
Email: epicedgecreative@gmail.com`;
    } else {
      subject = `Re: ${contact.subject.replace('-', ' ')}`;
      body = `Hello ${name},

Thank you for contacting EpicEdge Creative. I received your message and would be happy to help you with your inquiry.

Best regards,
EpicEdge Creative Team`;
    }

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open Gmail first, fallback to mailto
    const newWindow = window.open(gmailUrl, '_blank');
    
    // If popup was blocked or failed, fallback to mailto
    if (!newWindow) {
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchFields = [
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.company,
      contact.message
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Contact Messages</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-lg font-bold text-red-600">
                    {contacts.filter(c => c.status === 'unread').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {contacts.filter(c => c.status === 'read').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Replied</p>
                  <p className="text-lg font-bold text-green-600">
                    {contacts.filter(c => c.status === 'replied').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Callbacks</p>
                  <p className="text-lg font-bold text-amber-600">
                    {contacts.filter(c => c.subject === 'callback-request').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-amber-600" />
              </div>
              <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                  className="border-2 border-amber-200 rounded-xl px-4 py-3 text-gray-900 bg-white font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer min-w-[160px]"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="all" className="text-gray-900 bg-white">📋 All Messages</option>
                  <option value="unread" className="text-gray-900 bg-white">🔴 Unread</option>
                  <option value="read" className="text-gray-900 bg-white">👁️ Read</option>
                  <option value="replied" className="text-gray-900 bg-white">✅ Replied</option>
              </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-amber-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, company or message..."
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium placeholder-gray-500 shadow-sm hover:shadow-md transition-all"
              />
            </div>
            
            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-3 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Enhanced Stats */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">Total: <span className="font-bold text-amber-600">{pagination.total}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Showing: <span className="font-bold text-blue-600">{filteredContacts.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Page: <span className="font-bold text-green-600">{pagination.currentPage} of {pagination.totalPages}</span></span>
            </div>
          </div>
        </div>

        {/* Contact Messages */}
        <div className="space-y-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {getContactName(contact).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                    <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {getContactName(contact)}
                        </h3>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(contact.status)} shadow-sm`}>
                            {contact.status === 'unread' ? '🔴 New' : contact.status === 'read' ? '👁️ Read' : '✅ Replied'}
                        </span>
                      </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <Mail className="w-4 h-4 text-amber-600" />
                          <span className="text-gray-700 font-medium">{getReplyEmail(contact)}</span>
                        </div>
                        {contact.company && (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <Building className="w-4 h-4 text-amber-600" />
                            <span className="text-gray-700 font-medium">{contact.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-gray-700 font-medium">
                            {new Date(contact.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl px-4 py-2 border border-amber-200">
                      <span className="text-2xl">{getSubjectIcon(contact.subject)}</span>
                      <div>
                        <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Subject</p>
                        <p className="font-bold text-amber-800 capitalize">
                      {contact.subject.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-4 border-l-4 border-amber-400">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Message</p>
                        <p className="text-gray-800 leading-relaxed font-medium">{contact.message}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                  {contact.status === 'unread' && (
                    <button
                      onClick={() => updateContactStatus(contact._id, 'read')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      Mark Read
                    </button>
                  )}
                  
                  {contact.status === 'read' && (
                    <button
                      onClick={() => updateContactStatus(contact._id, 'replied')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Replied
                    </button>
                  )}

                  <button
                    onClick={() => handleEmailReply(contact)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    <Mail className="w-4 h-4" />
                    Reply Email
                  </button>

                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredContacts.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No messages found</h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm ? 'Try adjusting your search criteria or clearing filters' : 'No contact messages yet - when customers reach out, they\'ll appear here'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-amber-100 p-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      page === pagination.currentPage
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 text-white hover:bg-amber-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
