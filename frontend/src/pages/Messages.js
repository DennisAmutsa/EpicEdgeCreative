import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  Send, 
  Search,
  Plus,
  User,
  Clock,
  Paperclip,
  Eye,
  CheckCircle,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Messages = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch client's sent messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery(
    'client-messages',
    () => axios.get('/api/messages').then(res => res.data.data),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch projects for context
  const { data: projects, isLoading: projectsLoading } = useQuery(
    'projects-messages',
    () => axios.get('/api/projects').then(res => res.data.data.projects),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    (messageData) => axios.post('/api/messages', messageData),
    {
      onSuccess: () => {
        toast.success('Message sent to team successfully!');
        setNewMessage('');
        setMessageSubject('');
        setSelectedProject('');
        queryClient.invalidateQueries('client-messages');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send message');
      }
    }
  );

  // Get client's sent messages
  const clientMessages = messagesData?.messages || [];
  
  const filteredMessages = clientMessages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.projectId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageData = {
      content: newMessage.trim(),
      subject: messageSubject.trim() || 'Message from client',
      projectId: selectedProject && !['new-project', 'support', 'billing', 'meeting', 'feedback'].includes(selectedProject) ? selectedProject : undefined
    };

    sendMessageMutation.mutate(messageData);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (messagesLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Messages - EpicEdge Creative"
        description="Communicate with your project team and track all project-related conversations."
        url="/messages"
      />
      
      {/* Clean Header Section */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Team Communication Hub
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Connect instantly with our creative team. Share ideas, get project updates, and collaborate seamlessly.
          </p>
          
          {/* Stats or Features */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Real-time responses</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Project-linked conversations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Message Composer */}
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 via-orange-600/80 to-yellow-600/80"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                    <Send className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  Start a Conversation
                </h2>
                <p className="text-white/90 text-xs sm:text-sm mt-1">Let's bring your ideas to life together</p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <form onSubmit={handleSendMessage} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="group">
                  <label htmlFor="subject" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mr-2"></div>
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium shadow-lg group-hover:shadow-xl"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="project" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mr-2"></div>
                    Message Category
                  </label>
                  <div className="relative">
                    <select
                      id="project"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-lg group-hover:shadow-xl appearance-none cursor-pointer"
                    >
                      <option value="">💬 General Inquiry</option>
                      <option value="new-project">🚀 New Project Request</option>
                      <option value="support">🛠️ Technical Support</option>
                      <option value="billing">💰 Billing Question</option>
                      <option value="meeting">📅 Schedule Meeting</option>
                      <option value="feedback">⭐ Feedback & Suggestions</option>
                      {projects && projects.length > 0 && (
                        <>
                          <option disabled>──── Existing Projects ────</option>
                          {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                              📁 {project.title}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="message" className="flex items-center text-sm font-bold text-gray-800 mb-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                  Your Message *
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share your thoughts, questions, or ideas with us..."
                    rows={6}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none font-medium shadow-lg group-hover:shadow-xl"
                    required
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {newMessage.length}/1000
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></div>
                  <p className="text-xs text-gray-600 font-medium">
                    💡 The more details you share, the better we can help you
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors font-medium"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm">Attach files</span>
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !messageSubject.trim() || sendMessageMutation.isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {sendMessageMutation.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Message History
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Track your conversations with the team
                </p>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm w-64 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div key={message._id} className="p-6 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'Y'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            message.status === 'read' ? 'bg-blue-100 text-blue-700' :
                            message.status === 'replied' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {message.status === 'replied' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {message.status === 'read' && <Eye className="w-3 h-3 mr-1" />}
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                        <p className="text-gray-900 leading-relaxed font-medium">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {message.projectId && (
                          <div className="flex items-center text-amber-600">
                            <FolderOpen className="w-4 h-4 mr-1" />
                            <span className="font-medium">Project: {message.projectId.title}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          <span>Sent by you</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm ? 'No messages match your search. Try different keywords.' : 'Start your first conversation with the EpicEdge Creative team using the form above.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips and Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Communication Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about your questions or requests</li>
                <li>• Include relevant project details when applicable</li>
                <li>• We typically respond within 24 hours during business days</li>
                <li>• For urgent matters, mention "URGENT" in your subject line</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
