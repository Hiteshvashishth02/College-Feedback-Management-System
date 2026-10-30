import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Star, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { collegesAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AddReview = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch college details
  const { data: collegeData, isLoading: collegeLoading } = useQuery(
    ['college', collegeId],
    () => collegesAPI.get(`/${collegeId}`),
    {
      enabled: !!collegeId,
    }
  );

  // Create review mutation
  const createReviewMutation = useMutation(
    (reviewData) => reviewsAPI.post('/', reviewData),
    {
      onSuccess: (response) => {
        toast.success('Review submitted successfully!');
        queryClient.invalidateQueries(['collegeReviews', collegeId]);
        queryClient.invalidateQueries(['colleges']);
        navigate(`/colleges/${collegeId}`);
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to submit review';
        toast.error(message);
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const college = collegeData?.data?.data;

  const onSubmit = (data) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    createReviewMutation.mutate({
      college: collegeId,
      rating,
      title: data.title,
      comment: data.comment,
      pros: data.pros,
      cons: data.cons,
    });
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

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

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h1>
          <p className="text-gray-600 mb-4">The college you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/colleges/${collegeId}`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {college.name}
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
          <p className="text-gray-600">
            Share your experience at {college.name} to help other students make informed decisions.
          </p>
        </div>

        {/* Review Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <h3 className="font-medium mb-2">Review Guidelines</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Be honest and constructive in your feedback</li>
                <li>Focus on your personal experience</li>
                <li>Avoid offensive language or personal attacks</li>
                <li>Provide specific examples to support your rating</li>
                <li>One review per college per student</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => handleRatingHover(value)}
                      onMouseLeave={handleRatingLeave}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          value <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {rating === 0 ? 'Select a rating' : `${rating} star${rating > 1 ? 's' : ''}`}
                </span>
              </div>
              {rating === 0 && (
                <p className="mt-1 text-sm text-red-600">Please select a rating</p>
              )}
            </div>

            {/* Review Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', {
                  required: 'Review title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters',
                  },
                })}
                type="text"
                id="title"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Summarize your experience in one sentence"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Review Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('comment', {
                  required: 'Review comment is required',
                  minLength: {
                    value: 20,
                    message: 'Please provide at least 20 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Review cannot exceed 1000 characters',
                  },
                })}
                id="comment"
                rows={6}
                className={`textarea ${errors.comment ? 'border-red-500' : ''}`}
                placeholder="Share your detailed experience at this college. What did you like? What could be improved?"
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>

            {/* Pros */}
            <div>
              <label htmlFor="pros" className="block text-sm font-medium text-gray-700 mb-2">
                What did you like? (Pros)
              </label>
              <textarea
                {...register('pros', {
                  maxLength: {
                    value: 500,
                    message: 'Pros cannot exceed 500 characters',
                  },
                })}
                id="pros"
                rows={3}
                className={`textarea ${errors.pros ? 'border-red-500' : ''}`}
                placeholder="Tell us about the positive aspects of your experience..."
              />
              {errors.pros && (
                <p className="mt-1 text-sm text-red-600">{errors.pros.message}</p>
              )}
            </div>

            {/* Cons */}
            <div>
              <label htmlFor="cons" className="block text-sm font-medium text-gray-700 mb-2">
                What could be improved? (Cons)
              </label>
              <textarea
                {...register('cons', {
                  maxLength: {
                    value: 500,
                    message: 'Cons cannot exceed 500 characters',
                  },
                })}
                id="cons"
                rows={3}
                className={`textarea ${errors.cons ? 'border-red-500' : ''}`}
                placeholder="Share areas where the college could improve..."
              />
              {errors.cons && (
                <p className="mt-1 text-sm text-red-600">{errors.cons.message}</p>
              )}
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5 mr-3" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Submission Agreement</p>
                  <p>By submitting this review, you confirm that it reflects your genuine experience 
                  and agree to our review guidelines. Your review will be visible to other students 
                  and may be moderated for quality assurance.</p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createReviewMutation.isLoading}
                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createReviewMutation.isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Review...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/colleges/${collegeId}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
