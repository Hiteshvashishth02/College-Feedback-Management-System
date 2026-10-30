import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Shield,
  Users,
  BookOpen,
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react';
import { adminAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  formatDate, 
  formatRelativeTime, 
  generateStarRating,
  truncateText,
  getInitials,
  generateAvatarColor 
} from '../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterRole, setFilterRole] = useState('all');

  // Fetch dashboard stats
  const { data: statsData } = useQuery(
    'adminStats',
    () => adminAPI.get('/dashboard'),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery(
    ['adminUsers', filterRole],
    () => adminAPI.get(`/users?role=${filterRole === 'all' ? '' : filterRole}`),
    {
      enabled: activeTab === 'users',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    'adminReviews',
    () => reviewsAPI.get('/'),
    {
      enabled: activeTab === 'reviews',
      staleTime: 5 * 60 * 1000,
    }
  );

  // Toggle user status mutation
  const toggleUserMutation = useMutation(
    ({ id }) => adminAPI.put(`/users/${id}/toggle-status`),
    {
      onSuccess: () => {
        toast.success('User status updated successfully');
        queryClient.invalidateQueries('adminUsers');
        queryClient.invalidateQueries('adminStats');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update user status';
        toast.error(message);
      },
    }
  );

  // Approve review mutation
  const approveReviewMutation = useMutation(
    ({ id, isApproved }) => reviewsAPI.put(`/${id}/approve`, { isApproved }),
    {
      onSuccess: () => {
        toast.success('Review status updated successfully');
        queryClient.invalidateQueries('adminReviews');
        queryClient.invalidateQueries('adminStats');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update review status';
        toast.error(message);
      },
    }
  );

  const stats = statsData?.data?.data?.stats || {};
  const recentReviews = statsData?.data?.data?.recentReviews || [];
  const topColleges = statsData?.data?.data?.topColleges || [];
  const users = usersData?.data?.data || [];
  const reviews = reviewsData?.data?.data || [];

  const handleToggleUserStatus = (userId) => {
    if (window.confirm('Are you sure you want to toggle this user\'s status?')) {
      toggleUserMutation.mutate({ id: userId });
    }
  };

  const handleApproveReview = (reviewId, isApproved) => {
    approveReviewMutation.mutate({ id: reviewId, isApproved });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, reviews, and platform content</p>
        </div>

        {/* Admin Welcome */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-red-100">Welcome, {user?.name}. You have full administrative access.</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['overview', 'users', 'reviews', 'colleges'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Colleges</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalColleges || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Reviews */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
                  </div>
                  <div className="p-6">
                    {recentReviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No recent reviews</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentReviews.map((review) => (
                          <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{review.title}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    review.isApproved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {review.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {review.user?.name} · {review.college?.name}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {truncateText(review.comment, 100)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-4">
                                {generateStarRating(review.rating).map((star, index) => (
                                  <Star
                                    key={index}
                                    className={`w-4 h-4 ${
                                      star.type === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Colleges */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Top Rated Colleges</h3>
                  </div>
                  <div className="p-6">
                    {topColleges.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No colleges rated yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {topColleges.map((college, index) => (
                          <div key={college._id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{college.name}</h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <span className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                  {college.averageRating.toFixed(1)}
                                </span>
                                <span>·</span>
                                <span>{college.totalReviews} reviews</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Users</option>
                    <option value="student">Students</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${generateAvatarColor(user.name)}`}>
                              {getInitials(user.name)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleUserStatus(user._id)}
                            disabled={user._id === user?._id}
                            className={`text-${user.isActive ? 'red' : 'green'}-600 hover:text-${user.isActive ? 'red' : 'green'}-900 ${
                              user._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Review Management</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviewsLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading reviews...</p>
                      </td>
                    </tr>
                  ) : reviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No reviews found</p>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review._id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.title}</div>
                            <div className="text-sm text-gray-500">
                              {formatRelativeTime(review.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs ${generateAvatarColor(review.user?.name)}`}>
                              {getInitials(review.user?.name)}
                            </div>
                            <div className="ml-2 text-sm text-gray-900">{review.user?.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.college?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {generateStarRating(review.rating).map((star, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  star.type === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            review.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleApproveReview(review._id, !review.isApproved)}
                            className={`text-${review.isApproved ? 'yellow' : 'green'}-600 hover:text-${review.isApproved ? 'yellow' : 'green'}-900`}
                          >
                            {review.isApproved ? 'Reject' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Colleges Tab */}
        {activeTab === 'colleges' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">College Management</h3>
              <p className="text-gray-600 mb-4">
                College management features will be available in the next update.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Browse Colleges
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
