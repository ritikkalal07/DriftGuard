/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Get drift status color
 */
export const getDriftStatusColor = (status) => {
  // Handle snake_case from backend
  const normalizedStatus = status?.replace(/_/g, '_');
  const colors = {
    none: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    no_drift: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    possible: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    possible_drift: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    high: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    high_drift: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    missing: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    missing_docs: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  };
  return colors[status] || colors.possible;
};

/**
 * Get drift status icon
 */
export const getDriftStatusIcon = (status) => {
  const icons = {
    none: '✓',
    no_drift: '✓',
    possible: '⚠️',
    possible_drift: '⚠️',
    high: '🚨',
    high_drift: '🚨',
    missing: '📝',
    missing_docs: '📝',
  };
  return icons[status] || '•';
};

/**
 * Get severity color based on score
 */
export const getSeverityColor = (score) => {
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-orange-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
};

/**
 * Truncate text
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Download text as file
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'badge bg-gray-100 text-gray-800',
    processing: 'badge bg-blue-100 text-blue-800',
    completed: 'badge bg-green-100 text-green-800',
    failed: 'badge bg-red-100 text-red-800',
    unresolved: 'badge bg-yellow-100 text-yellow-800',
    approved: 'badge bg-green-100 text-green-800',
    rejected: 'badge bg-red-100 text-red-800',
    ignored: 'badge bg-gray-100 text-gray-800',
  };
  return classes[status] || classes.pending;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Made with Bob
