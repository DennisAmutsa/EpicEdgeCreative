import { useState } from 'react';
import axios from 'axios';

export const NotificationSender = ({ userId, userName }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    setSending(true);
    
    try {
      await axios.post('/api/push/send', {
        userId,
        title,
        body,
        data: { url: '/notifications' }
      });
      
      alert('Notification sent successfully!');
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
        Send Push Notification to {userName}
      </h4>
      <form onSubmit={sendNotification} className="space-y-3">
        <input
          type="text"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Notification message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
        />
        <button
          type="submit"
          disabled={sending || !title || !body}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );
};
