const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: [true, 'College reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  pros: {
    type: String,
    trim: true,
    maxlength: [500, 'Pros cannot exceed 500 characters']
  },
  cons: {
    type: String,
    trim: true,
    maxlength: [500, 'Cons cannot exceed 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only review a college once
ReviewSchema.index({ user: 1, college: 1 }, { unique: true });

// Update college average rating when a review is saved
ReviewSchema.post('save', async function() {
  try {
    const College = mongoose.model('College');
    const college = await College.findById(this.college);
    
    if (college) {
      const reviews = await mongoose.model('Review').find({ 
        college: this.college, 
        isApproved: true 
      });
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      college.averageRating = totalRating / reviews.length;
      college.totalReviews = reviews.length;
      await college.save();
    }
  } catch (error) {
    console.error('Error updating college rating:', error);
  }
});

// Update college rating when review is removed
ReviewSchema.post('remove', async function() {
  try {
    const College = mongoose.model('College');
    const college = await College.findById(this.college);
    
    if (college) {
      const reviews = await mongoose.model('Review').find({ 
        college: this.college, 
        isApproved: true 
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        college.averageRating = totalRating / reviews.length;
        college.totalReviews = reviews.length;
      } else {
        college.averageRating = 0;
        college.totalReviews = 0;
      }
      await college.save();
    }
  } catch (error) {
    console.error('Error updating college rating after removal:', error);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
