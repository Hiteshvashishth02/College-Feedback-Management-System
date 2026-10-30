import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format date to relative time (e.g., "2 days ago")
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

// Truncate text to specified length
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

// Generate star rating display
export function generateStarRating(rating, maxRating = 5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full', value: i + 1 });
  }

  // Half star
  if (hasHalfStar) {
    stars.push({ type: 'half', value: fullStars + 1 });
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ type: 'empty', value: fullStars + (hasHalfStar ? 1 : 0) + i + 1 });
  }

  return stars;
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 0,
      requirements: {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      }
    };
  }

  const requirements = {
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);
  const strength = Object.values(requirements).filter(Boolean).length;

  return { isValid, strength, requirements };
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Capitalize first letter of each word
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Get initials from name
export function getInitials(name, maxLength = 2) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

// Generate random color for avatar
export function generateAvatarColor(name) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Format number with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate average rating from reviews
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
}

// Get rating distribution
export function getRatingDistribution(reviews) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    if (distribution[review.rating] !== undefined) {
      distribution[review.rating]++;
    }
  });
  
  return distribution;
}

// Search filter for colleges
export function filterColleges(colleges, searchTerm, filters = {}) {
  return colleges.filter(college => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = !filters.type || filters.type === 'all' || college.type === filters.type;
    
    // Rating filter
    const matchesRating = !filters.minRating || college.averageRating >= filters.minRating;
    
    return matchesSearch && matchesType && matchesRating;
  });
}

// Sort colleges
export function sortColleges(colleges, sortBy) {
  const sorted = [...colleges];
  
  switch (sortBy) {
    case 'rating-high':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'rating-low':
      return sorted.sort((a, b) => a.averageRating - b.averageRating);
    case 'reviews-high':
      return sorted.sort((a, b) => b.totalReviews - a.totalReviews);
    case 'reviews-low':
      return sorted.sort((a, b) => a.totalReviews - b.totalReviews);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}
