import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Function to send web vitals to analytics (you can integrate with Google Analytics, etc.)
function sendToAnalytics(metric) {
  // Replace with your analytics tracking code
  console.log('Web Vital:', metric);
  
  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Track and report all web vitals
export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

export default reportWebVitals;
