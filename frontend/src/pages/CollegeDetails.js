import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Star, 
  MapPin, 
  Globe, 
  Phone, 
  ThumbsUp,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Users,
  Calendar,
  Mail
} from 'lucide-react';
import { collegesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  generateStarRating, 
  formatRelativeTime, 
  getInitials,
  generateAvatarColor 
} from '../utils/helpers';

const CollegeDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch college details
  const { data: collegeData, isLoading: collegeLoading, error: collegeError } = useQuery(
    ['college', id],
    () => collegesAPI.get(`/${id}`),
    {
      enabled: !!id,
    }
  );

  // Fetch college reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    ['collegeReviews', id],
    () => collegesAPI.get(`/${id}/reviews`),
    {
      enabled: !!id,
    }
  );

  const college = collegeData?.data?.data;
  const reviews = reviewsData?.data?.data || [];

  if (collegeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading college information...</p>
        </div>
      </div>
    );
  }

  if (collegeError || !college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h1>
          <p className="text-gray-600 mb-4">The college you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const stars = generateStarRating(college.averageRating);
  const hasReviewed = reviews.some(review => review.user._id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Colleges
          </Link>
        </div>
      </div>

      {/* College Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {college.type}
                </span>
                {college.isActive && (
                  <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm font-medium">
                    Active
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{college.name}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{college.location}</span>
                </div>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Website
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {stars.map((star, index) => (
                      <Star
                        key={index}
                        className={`w-6 h-6 ${
                          star.type === 'full' ? 'text-yellow-400 fill-current' :
                          star.type === 'half' ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-2xl font-bold">{college.averageRating.toFixed(1)}</span>
                    <span className="text-primary-200 ml-2">({college.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {isAuthenticated && !hasReviewed && (
                    <Link
                      to={`/add-review/${college._id}`}
                      className="block w-full text-center bg-white text-primary-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Write a Review
                    </Link>
                  )}
                  {isAuthenticated && hasReviewed && (
                    <div className="block w-full text-center bg-green-500 text-white py-3 px-4 rounded-lg font-medium">
                      You've Reviewed This College
                    </div>
                  )}
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="block w-full text-center bg-white text-primary-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Sign In to Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {['overview', 'reviews', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">{college.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Student Population</p>
                            <p className="font-medium">Large</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Founded</p>
                            <p className="font-medium">Established Institution</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Programs</p>
                            <p className="font-medium">Multiple Programs</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Star className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="font-medium">{college.averageRating.toFixed(1)}/5.0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Student Reviews ({reviews.length})
                      </h3>
                      {isAuthenticated && !hasReviewed && (
                        <Link
                          to={`/add-review/${college._id}`}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Add Review
                        </Link>
                      )}
                    </div>

                    {reviewsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading reviews...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-start space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${generateAvatarColor(review.user.name)}`}>
                                {getInitials(review.user.name)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                                    <p className="text-sm text-gray-500">{formatRelativeTime(review.createdAt)}</p>
                                  </div>
                                  <div className="flex items-center">
                                    {generateStarRating(review.rating).map((star, index) => (
                                      <Star
                                        key={index}
                                        className={`w-4 h-4 ${
                                          star.type === 'full' ? 'text-yellow-400 fill-current' :
                                          star.type === 'half' ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                                <p className="text-gray-600 mb-3">{review.comment}</p>
                                
                                {(review.pros || review.cons) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    {review.pros && (
                                      <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-green-800 mb-1">Pros</p>
                                        <p className="text-sm text-green-700">{review.pros}</p>
                                      </div>
                                    )}
                                    {review.cons && (
                                      <div className="bg-red-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-red-800 mb-1">Cons</p>
                                        <p className="text-sm text-red-700">{review.cons}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <button className="flex items-center space-x-1 hover:text-primary-600">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpfulCount})</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        {college.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">{college.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {college.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{college.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {college.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{college.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {college.website && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <a
                                href={college.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary-600 hover:text-primary-700"
                              >
                                {college.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p className="text-gray-600">Saturday - Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-3">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Colleges</h3>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  More colleges like this will be shown here based on your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
