const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import models
const College = require('../models/College');
const Review = require('../models/Review');
const User = require('../models/User');

// Additional colleges including Chandigarh University and more
const additionalColleges = [
  {
    name: "Chandigarh University",
    location: "Chandigarh, Punjab, India",
    description: "Chandigarh University is a premier private university located in Chandigarh, Punjab. It offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including engineering, management, pharmacy, law, and more. The university is known for its modern infrastructure, experienced faculty, and strong industry connections providing excellent placement opportunities.",
    type: "university",
    website: "https://www.cuchd.in",
    phone: "+91-172-3984200",
    email: "admissions@cuchd.in"
  },
  {
    name: "Thapar University",
    location: "Patiala, Punjab, India",
    description: "Thapar University is a private university known for its engineering and technology programs. It offers quality education with modern infrastructure and experienced faculty. The campus provides excellent learning environment with good placement opportunities.",
    type: "university",
    website: "https://www.thapar.edu",
    phone: "+91-176-239-3021",
    email: "admissions@thapar.edu"
  },
  {
    name: "Lovely Professional University",
    location: "Phagwara, Punjab, India",
    description: "Lovely Professional University is a private university offering various programs in engineering, management, pharmacy, and applied sciences. It focuses on practical learning and industry-relevant skills development.",
    type: "university",
    website: "https://www.lpu.in",
    phone: "+91-1824-504-9000",
    email: "admissions@lpu.in"
  },
  {
    name: "Punjab University",
    location: "Chandigarh, Punjab, India",
    description: "Punjab University is one of the oldest and most prestigious universities in India. It offers excellent academic programs across various disciplines with strong research focus and experienced faculty.",
    type: "university",
    website: "https://www.puchd.ac.in",
    phone: "+91-172-253-4866",
    email: "admissions@puchd.ac.in"
  },
  {
    name: "Guru Nanak Dev University",
    location: "Amritsar, Punjab, India",
    description: "Guru Nanak Dev University is a private university known for its spiritual and academic excellence. It offers programs in various disciplines with emphasis on values and holistic development.",
    type: "university",
    website: "https://www.gndu.ac.in",
    phone: "+91-183-225-7000",
    email: "admissions@gndu.ac.in"
  },
  {
    name: "Panjab University",
    location: "Patiala, Punjab, India",
    description: "Panjab University is a state university known for its agricultural sciences and engineering programs. It provides quality education with modern facilities and experienced faculty.",
    type: "university",
    website: "https://www.pbi.ac.in",
    phone: "+91-175-500-2000",
    email: "admissions@pbi.ac.in"
  },
  {
    name: "Delhi Technological University",
    location: "Delhi, India",
    description: "Delhi Technological University is a premier engineering institution known for its technical education, research, and innovation. It offers undergraduate and postgraduate programs in various engineering disciplines.",
    type: "university",
    website: "https://www.dtu.ac.in",
    phone: "+91-11-2787-1000",
    email: "admissions@dtu.ac.in"
  },
  {
    name: "Bharati Vidyapeeth",
    location: "Delhi, India",
    description: "Bharati Vidyapeeth is a public university of technology and one of the largest engineering institutions in India. It offers quality technical education with excellent research facilities.",
    type: "institute",
    website: "https://www.bvcoedu.com",
    phone: "+91-11-2658-2113",
    email: "admissions@bvcoedu.com"
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu, India",
    description: "SRM Institute of Science and Technology is a private deemed university known for its engineering and technology programs. It offers excellent infrastructure and strong industry connections.",
    type: "institute",
    website: "https://www.srmist.edu.in",
    phone: "+91-44-274-7000",
    email: "admissions@srmist.edu.in"
  },
  {
    name: "VIT University",
    location: "Vellore, Tamil Nadu, India",
    description: "VIT University is a private university known for its engineering and technology programs. It offers quality education with modern infrastructure and excellent placement opportunities.",
    type: "university",
    website: "https://vit.ac.in",
    phone: "+91-416-224-3091",
    email: "admissions@vit.ac.in"
  },
  {
    name: "Manipal University",
    location: "Jaipur, Rajasthan, India",
    description: "Manipal University is a private university known for its engineering, management, and medical programs. It offers quality education with modern infrastructure and experienced faculty.",
    type: "university",
    website: "https://www.manipal.edu",
    phone: "+91-141-271-2414",
    email: "admissions@manipal.edu"
  }
];

// Sample reviews for all colleges
const sampleReviews = [
  {
    title: "Excellent infrastructure and faculty",
    rating: 5,
    comment: "The university has excellent infrastructure with modern classrooms and labs. The faculty is very supportive and knowledgeable. Great placement opportunities!",
    pros: "Modern infrastructure, experienced faculty, good placement opportunities, diverse student community",
    cons: "Location is a bit far from city, hostel fees are quite high",
    isApproved: true
  },
  {
    title: "Great academic environment",
    rating: 4,
    comment: "Strong academic programs with good research opportunities. The curriculum is challenging but rewarding.",
    pros: "Excellent faculty, great research opportunities, strong alumni network, prestigious degree",
    cons: "Very competitive environment, high academic pressure, limited social life",
    isApproved: true
  },
  {
    title: "Good value for money",
    rating: 4,
    comment: "Affordable education with decent placement records. The infrastructure is good but could be better in some departments.",
    pros: "Affordable compared to other universities, good placement support, modern campus",
    cons: "Some departments need better faculty, campus location is remote",
    isApproved: true
  },
  {
    title: "Outstanding research facilities",
    rating: 5,
    comment: "World-class research facilities and excellent faculty. The entrepreneurial culture is amazing!",
    pros: "World-class faculty, excellent research facilities, strong industry connections, beautiful campus",
    cons: "Very expensive, high cost of living in the area",
    isApproved: true
  },
  {
    title: "Life-changing experience",
    rating: 5,
    comment: "Exceeded all expectations! The academic rigor is challenging but rewarding. Amazing network and opportunities.",
    pros: "Prestigious degree, excellent faculty, amazing alumni network, diverse student body",
    cons: "Extremely competitive, high stress levels, expensive",
    isApproved: true
  },
  {
    title: "Great practical learning",
    rating: 4,
    comment: "Focus on practical skills and industry relevance. Good hands-on training approach.",
    pros: "Practical learning approach, industry-relevant curriculum, good internship opportunities",
    cons: "Limited research focus, some theoretical courses need improvement",
    isApproved: true
  },
  {
    title: "Strong placement record",
    rating: 4,
    comment: "Excellent placement opportunities with good industry connections. Most students get placed in good companies.",
    pros: "Excellent placement record, strong industry connections, good training programs",
    cons: "High competition for placements, some departments lack modern infrastructure",
    isApproved: true
  }
];

// Add more colleges and reviews
const addMoreCollegesAndReviews = async () => {
  try {
    console.log('Adding more colleges and reviews...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Get existing colleges
    const existingColleges = await College.find();
    console.log(`Existing colleges: ${existingColleges.length}`);
    
    // Add new colleges
    let addedColleges = 0;
    for (const college of additionalColleges) {
      try {
        // Check if college already exists
        const existingCollege = existingColleges.find(c => 
          c.name.toLowerCase() === college.name.toLowerCase()
        );
        
        if (!existingCollege) {
          const newCollege = new College(college);
          await newCollege.save();
          console.log(`Added college: ${college.name}`);
          addedColleges++;
        } else {
          console.log(`College already exists: ${college.name}`);
        }
      } catch (error) {
        console.error(`Error adding college ${college.name}:`, error.message);
      }
    }
    
    console.log(`Successfully added ${addedColleges} new colleges`);
    
    // Get all colleges for review assignment
    const allColleges = await College.find();
    
    // Get or create a sample user for reviews
    let sampleUser = await User.findOne({ email: 'student@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'Sample Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
      await sampleUser.save();
      console.log('Created sample student user');
    }
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Add sample reviews for all colleges
    let addedReviews = 0;
    for (const college of allColleges) {
      // Assign 2-3 random reviews to each college
      const numReviews = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numReviews; i++) {
        try {
          const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
          const review = new Review({
            college: college._id,
            user: sampleUser._id,
            title: randomReview.title,
            rating: randomReview.rating,
            comment: randomReview.comment,
            pros: randomReview.pros,
            cons: randomReview.cons,
            isApproved: true
          });
          
          await review.save();
          addedReviews++;
        } catch (error) {
          console.error(`Error adding review to ${college.name}:`, error.message);
        }
      }
      
      // Update college rating
      const collegeReviews = await Review.find({ 
        college: college._id, 
        isApproved: true 
      });
      
      if (collegeReviews.length > 0) {
        const avgRating = collegeReviews.reduce((sum, review) => sum + review.rating, 0) / collegeReviews.length;
        await College.findByIdAndUpdate(college._id, {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: collegeReviews.length
        });
        console.log(`Updated ${college.name} rating: ${avgRating.toFixed(1)} (${collegeReviews.length} reviews)`);
      }
    }
    
    console.log(`Successfully added ${addedReviews} reviews`);
    
    // Verify results
    const finalColleges = await College.find();
    const finalReviews = await Review.find({ isApproved: true });
    
    console.log('\nFinal Results:');
    console.log(`Total colleges: ${finalColleges.length}`);
    console.log(`Total reviews: ${finalReviews.length}`);
    
    // Show sample colleges
    console.log('\nColleges added:');
    finalColleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name} (${college.location})`);
    });
    
    console.log('\nReview summary:');
    finalColleges.forEach((college) => {
      const reviews = finalReviews.filter(r => r.college.toString() === college._id.toString());
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;
      console.log(`${college.name}: ${reviews.length} reviews, avg rating: ${avgRating.toFixed(1)}`);
    });
    
    console.log('\nColleges and reviews added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
addMoreCollegesAndReviews();
