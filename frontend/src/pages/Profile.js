import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  MessageSquare,
  Star,
  TrendingUp,
  Save,
  X,
  Edit2
} from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { 
  formatDate, 
  formatRelativeTime, 
  generateStarRating,
  truncateText,
  getInitials,
  generateAvatarColor 
} from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateDetails, updatePassword } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch user's reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    'userReviews',
    () => reviewsAPI.get('/user/me'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const reviews = reviewsData?.data?.data || [];

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data) => updateDetails(data),
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        setIsEditingProfile(false);
        queryClient.invalidateQueries('user');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update profile';
        toast.error(message);
      },
    }
  );

  // Update password mutation
  const updatePasswordMutation = useMutation(
    (data) => updatePassword(data),
    {
      onSuccess: () => {
        toast.success('Password updated successfully!');
        resetPassword();
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update password';
        toast.error(message);
      },
    }
  );

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    updatePasswordMutation.mutate(data);
  };

  const handleEditProfile = () => {
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    resetProfile({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditingProfile(false);
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const totalHelpful = reviews.reduce((sum, review) => sum + review.helpfulCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and review history</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-medium text-3xl ${generateAvatarColor(user?.name)}`}>
                {getInitials(user?.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={handleEditProfile}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['profile', 'reviews', 'security'].map((tab) => (
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
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...registerProfile('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      type="text"
                      id="name"
                      className={`input ${profileErrors.name ? 'border-red-500' : ''}`}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...registerProfile('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email',
                        },
                      })}
                      type="email"
                      id="email"
                      className={`input ${profileErrors.email ? 'border-red-500' : ''}`}
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateProfileMutation.isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <p className="text-gray-900 capitalize">{user?.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <p className="text-gray-900">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Reviews</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Total: {totalReviews}</span>
                  <span>Avg Rating: {averageRating}</span>
                  <span>Helpful: {totalHelpful}</span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your college experiences to help other students.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Browse Colleges
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
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
                                star.type === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {truncateText(review.comment, 200)}
                      </p>
                      
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
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {review.helpfulCount} helpful
                        </span>
                        <a
                          href={`/colleges/${review.college?._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View Full Review
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
              
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required',
                      })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      className={`input pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      className={`input pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === newPassword || 'Passwords do not match',
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className={`input pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={updatePasswordMutation.isLoading}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatePasswordMutation.isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Password...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
