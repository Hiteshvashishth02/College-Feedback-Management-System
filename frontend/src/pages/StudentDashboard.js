import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  BookOpen, 
  Star, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Award,
  User
} from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  formatRelativeTime, 
  generateStarRating,
  truncateText,
  generateAvatarColor,
  getInitials
} from '../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Fetch user's reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    'userReviews',
    () => reviewsAPI.get('/user/me'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const reviews = reviewsData?.data?.data || [];

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const totalHelpful = reviews.reduce((sum, review) => sum + review.helpfulCount, 0);

  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your reviews and track your college feedback activity</p>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-2xl ${generateAvatarColor(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
              <p className="text-primary-100">Here's an overview of your college review activity</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Helpful Votes</p>
                <p className="text-2xl font-bold text-gray-900">{totalHelpful}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReviews < 5 ? 'Beginner' : totalReviews < 15 ? 'Intermediate' : 'Expert'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Your Recent Reviews</h3>
                  {totalReviews > 0 && (
                    <Link
                      to="/profile"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your reviews...</p>
                  </div>
                ) : recentReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start sharing your college experiences to help other students make informed decisions.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Colleges
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentReviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.title}</h4>
                            <p className="text-sm text-gray-600">
                              {review.college?.name} · {formatRelativeTime(review.createdAt)}
                            </p>
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
                        
                        <p className="text-gray-600 mb-3">
                          {truncateText(review.comment, 150)}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {review.helpfulCount} helpful
                          </span>
                          <Link
                            to={`/colleges/${review.college?._id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            View Full Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Browse Colleges
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 ${totalReviews >= 1 ? '' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    totalReviews >= 1 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${totalReviews >= 1 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">First Review</p>
                    <p className="text-sm text-gray-600">
                      {totalReviews >= 1 ? 'Unlocked!' : 'Write your first review'}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-3 ${totalReviews >= 5 ? '' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    totalReviews >= 5 ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Star className={`w-5 h-5 ${totalReviews >= 5 ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Active Reviewer</p>
                    <p className="text-sm text-gray-600">
                      {totalReviews >= 5 ? '5+ reviews!' : `${5 - totalReviews} to go`}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-3 ${totalReviews >= 15 ? '' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    totalReviews >= 15 ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Award className={`w-5 h-5 ${totalReviews >= 15 ? 'text-purple-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Expert Reviewer</p>
                    <p className="text-sm text-gray-600">
                      {totalReviews >= 15 ? '15+ reviews!' : `${15 - totalReviews} to go`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Great Reviews</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">·</span>
                  Be specific and detailed in your feedback
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">·</span>
                  Include both pros and cons for balanced reviews
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">·</span>
                  Update your reviews if your experience changes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">·</span>
                  Help others by marking helpful reviews
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
