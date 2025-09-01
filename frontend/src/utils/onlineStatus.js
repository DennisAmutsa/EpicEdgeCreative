// Utility function to determine online/offline status based on Nairobi time
export const getOnlineStatus = () => {
  // Get current time in Nairobi (UTC+3)
  const nairobiTime = new Date();
  nairobiTime.setUTCHours(nairobiTime.getUTCHours() + 3);
  
  const currentHour = nairobiTime.getHours();
  const currentMinute = nairobiTime.getMinutes();
  
  // Business hours: 9:00 AM to 6:00 PM (Nairobi time)
  const businessStart = 9; // 9:00 AM
  const businessEnd = 18;  // 6:00 PM
  
  // Check if current time is within business hours
  // Note: 18:00 (6:00 PM) is considered offline
  const isOnline = currentHour >= businessStart && currentHour < businessEnd;
  
  // Calculate time until next status change
  let timeUntilNextChange = '';
  let nextStatus = '';
  
  if (isOnline) {
    // Currently online, calculate time until offline (6:00 PM)
    const hoursUntilOffline = businessEnd - currentHour;
    const minutesUntilOffline = 60 - currentMinute;
    
    if (hoursUntilOffline > 1) {
      timeUntilNextChange = `${hoursUntilOffline - 1}h ${minutesUntilOffline}m until offline`;
    } else if (hoursUntilOffline === 1) {
      timeUntilNextChange = `${minutesUntilOffline}m until offline`;
    } else {
      timeUntilNextChange = 'Going offline soon';
    }
    nextStatus = 'offline';
  } else {
    // Currently offline, calculate time until online (9:00 AM)
    let hoursUntilOnline = 0;
    let minutesUntilOnline = 0;
    
    if (currentHour >= businessEnd) {
      // After 6 PM, calculate until next day 9 AM
      hoursUntilOnline = (24 - currentHour) + businessStart;
    } else {
      // Before 9 AM, calculate until 9 AM today
      hoursUntilOnline = businessStart - currentHour;
    }
    
    minutesUntilOnline = 60 - currentMinute;
    
    if (hoursUntilOnline > 1) {
      timeUntilNextChange = `${hoursUntilOnline - 1}h ${minutesUntilOnline}m until online`;
    } else if (hoursUntilOnline === 1) {
      timeUntilNextChange = `${minutesUntilOnline}m until online`;
    } else {
      timeUntilNextChange = 'Coming online soon';
    }
    nextStatus = 'online';
  }
  
  // Get current Nairobi time string
  const nairobiTimeString = nairobiTime.toLocaleTimeString('en-US', {
    timeZone: 'Africa/Nairobi',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Get response time based on status
  const responseTime = isOnline ? '2-4 hours' : 'Next business day';
  
  // Debug logging
  console.log('🕐 Nairobi Time Debug:', {
    currentHour,
    currentMinute,
    businessStart,
    businessEnd,
    isOnline,
    nairobiTimeString
  });
  
  return {
    isOnline,
    status: isOnline ? 'Online Now' : 'Offline',
    statusColor: isOnline ? 'text-green-600' : 'text-red-600',
    statusDot: isOnline ? 'bg-green-500' : 'bg-red-500',
    responseTime,
    nairobiTime: `Nairobi Time: ${nairobiTimeString}`,
    timeUntilNextChange,
    nextStatus,
    businessHours: '9:00 AM - 6:00 PM (Nairobi Time)'
  };
};

// Function to format time difference
export const formatTimeDifference = (hours, minutes) => {
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Function to get next business day
export const getNextBusinessDay = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Skip weekends (Saturday = 6, Sunday = 0)
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  
  return tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

// Test function to verify time calculations
export const testTimeCalculations = () => {
  console.log('🧪 Testing Time Calculations:');
  
  // Test different times
  const testTimes = [
    { hour: 8, minute: 30, expected: 'offline' },   // 8:30 AM - should be offline
    { hour: 9, minute: 0, expected: 'online' },     // 9:00 AM - should be online
    { hour: 12, minute: 0, expected: 'online' },    // 12:00 PM - should be online
    { hour: 17, minute: 59, expected: 'online' },   // 5:59 PM - should be online
    { hour: 18, minute: 0, expected: 'offline' },   // 6:00 PM - should be offline
    { hour: 18, minute: 30, expected: 'offline' },  // 6:30 PM - should be offline
    { hour: 23, minute: 0, expected: 'offline' },   // 11:00 PM - should be offline
  ];
  
  testTimes.forEach(test => {
    const testDate = new Date();
    testDate.setHours(test.hour, test.minute, 0, 0);
    
    // Simulate Nairobi time
    const nairobiTime = new Date(testDate);
    nairobiTime.setUTCHours(nairobiTime.getUTCHours() + 3);
    
    const currentHour = nairobiTime.getHours();
    const businessStart = 9;
    const businessEnd = 18;
    const isOnline = currentHour >= businessStart && currentHour < businessEnd;
    
    const status = isOnline ? 'online' : 'offline';
    const passed = status === test.expected;
    
    console.log(`${test.hour.toString().padStart(2, '0')}:${test.minute.toString().padStart(2, '0')} → ${status} ${passed ? '✅' : '❌'} (expected: ${test.expected})`);
  });
  
  // Test current time
  const currentStatus = getOnlineStatus();
  console.log('🕐 Current Status:', currentStatus);
};
