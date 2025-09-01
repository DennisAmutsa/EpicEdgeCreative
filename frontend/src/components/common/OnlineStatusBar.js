import React, { useState, useEffect } from 'react';
import { Clock, Globe, Users, Zap, AlertCircle, Bug } from 'lucide-react';
import { getOnlineStatus, getNextBusinessDay, testTimeCalculations } from '../../utils/onlineStatus';

const OnlineStatusBar = () => {
  const [status, setStatus] = useState(getOnlineStatus());
  const [nextBusinessDay, setNextBusinessDay] = useState(getNextBusinessDay());

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getOnlineStatus());
      setNextBusinessDay(getNextBusinessDay());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleTestTime = () => {
    testTimeCalculations();
  };

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

        {/* Business Hours */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Clock className="w-4 h-4" />
          <span>{status.businessHours}</span>
        </div>

        {/* Projects Completed */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Users className="w-4 h-4" />
          <span>100+ Projects</span>
        </div>

        {/* Years of Experience */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Zap className="w-4 h-4" />
          <span>4+ Years</span>
        </div>

        {/* Status Change Info */}
        <div className="flex items-center space-x-2 text-gray-300">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">
            {status.isOnline ? (
              <span className="text-yellow-300">{status.timeUntilNextChange}</span>
            ) : (
              <span className="text-blue-300">
                Back online {nextBusinessDay} at 9:00 AM
              </span>
            )}
          </span>
        </div>

        {/* Temporary Test Button - Remove after debugging */}
        <button
          onClick={handleTestTime}
          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
          title="Test Time Calculations"
        >
          <Bug className="w-3 h-3" />
          <span>Test</span>
        </button>
      </div>
    </div>
  );
};

export default OnlineStatusBar;
