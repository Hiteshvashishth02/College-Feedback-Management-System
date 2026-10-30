const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import models
const College = require('../models/College');
const Review = require('../models/Review');
const User = require('../models/User');

// Add sample reviews
const addSampleReviews = async () => {
  try {
    console.log('Adding sample reviews...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Get colleges and users
    const colleges = await College.find();
    const users = await User.find({ role: 'student' });
    
    if (colleges.length === 0) {
      console.log('No colleges found. Please add colleges first.');
      return;
    }
    
    if (users.length === 0) {
      console.log('No student users found. Creating sample student...');
      const sampleUser = new User({
        name: 'Sample Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
      await sampleUser.save();
      users.push(sampleUser);
    }
    
    // Sample reviews
    const sampleReviews = [
      {
        college: colleges[0]._id, // Chandigarh University
        user: users[0]._id,
        title: "Great infrastructure and faculty",
        rating: 5,
        comment: "Chandigarh University has excellent infrastructure with modern classrooms and labs. The faculty is very supportive and knowledgeable. The campus life is vibrant with lots of extracurricular activities.",
        pros: "Modern infrastructure, experienced faculty, good placement opportunities, diverse student community",
        cons: "Location is a bit far from the city, hostel fees are quite high",
        isApproved: true
      },
      {
        college: colleges[1]._id, // IIT Delhi
        user: users[0]._id,
        title: "Prestigious institution with great opportunities",
        rating: 4,
        comment: "IIT Delhi is truly a prestigious institution with excellent academic standards. The research opportunities are amazing, but the curriculum can be quite demanding.",
        pros: "Excellent faculty, great research opportunities, strong alumni network, prestigious degree",
        cons: "Very competitive environment, high academic pressure, limited social life",
        isApproved: true
      },
      {
        college: colleges[2]._id, // Stanford University
        user: users[0]._id,
        title: "Outstanding academic environment",
        rating: 5,
        comment: "Stanford provides an outstanding academic environment with world-class faculty and resources. The entrepreneurial culture is amazing.",
        pros: "World-class faculty, excellent research facilities, strong industry connections, beautiful campus",
        cons: "Very expensive, high cost of living in the area",
        isApproved: true
      },
      {
        college: colleges[3]._id, // Harvard University
        user: users[0]._id,
        title: "Life-changing experience",
        rating: 5,
        comment: "Harvard exceeded all my expectations. The academic rigor is challenging but rewarding. The network and opportunities are unparalleled.",
        pros: "Prestigious degree, excellent faculty, amazing alumni network, diverse student body",
        cons: "Extremely competitive, high stress levels, expensive",
        isApproved: true
      },
      {
        college: colleges[0]._id, // Chandigarh University - another review
        user: users[0]._id,
        title: "Good value for money",
        rating: 4,
        comment: "Overall a good university with decent placement records. The infrastructure is good but could be better in some departments.",
        pros: "Affordable compared to other private universities, good placement support, modern campus",
        cons: "Some departments need better faculty, campus location is remote",
        isApproved: true
      }
    ];
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Add sample reviews
    let successCount = 0;
    for (const review of sampleReviews) {
      try {
        const newReview = new Review(review);
        await newReview.save();
        console.log(`Added review for: ${colleges.find(c => c._id.toString() === review.college.toString())?.name}`);
        successCount++;
      } catch (error) {
        console.error(`Error adding review:`, error.message);
      }
    }
    
    console.log(`\nSuccessfully added ${successCount} reviews`);
    
    // Update college ratings
    for (const college of colleges) {
      const reviews = await Review.find({ college: college._id, isApproved: true });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await College.findByIdAndUpdate(college._id, {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length
        });
        console.log(`Updated ${college.name} rating: ${avgRating.toFixed(1)} (${reviews.length} reviews)`);
      }
    }
    
    // Test the reviews API
    console.log('\nTesting reviews API...');
    const collegeReviews = await Review.find({ isApproved: true }).populate('college', 'name').populate('user', 'name');
    console.log(`Total approved reviews: ${collegeReviews.length}`);
    
    collegeReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.college.name} - ${review.title} (${review.rating}/5)`);
    });
    
    console.log('\nSample reviews added successfully!');
    
  } catch (error) {
    console.error('Error adding sample reviews:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
addSampleReviews();
