import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { getOnlineStatus } from '../../utils/onlineStatus';

const OnlineStatusBar = () => {
  const [status, setStatus] = useState(getOnlineStatus());

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getOnlineStatus());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm">
        {/* Online Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status.statusDot} animate-pulse`}></div>
          <span className={`font-medium ${status.statusColor}`}>
            {status.status}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-300">
            Response time: {status.responseTime}
          </span>
        </div>

        {/* Nairobi Time */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Globe className="w-4 h-4" />
          <span>{status.nairobiTime}</span>
        </div>
      </div>
    </div>
  );
};

export default OnlineStatusBar;
