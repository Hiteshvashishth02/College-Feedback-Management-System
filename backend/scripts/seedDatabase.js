const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

// Import models
const User = require('../models/User');
const College = require('../models/College');
const Review = require('../models/Review');

// Sample data
const sampleColleges = [
  {
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts",
    description: "MIT is a private research university known for its cutting-edge research and innovation in science, technology, engineering, and mathematics. The institute fosters a culture of hands-on learning and problem-solving.",
    type: "university",
    website: "https://www.mit.edu",
    phone: "+1 617-253-1000",
    email: "admissions@mit.edu"
  },
  {
    name: "Stanford University",
    location: "Stanford, California",
    description: "Stanford University is a private research university known for its academic excellence, research contributions, and beautiful campus. It offers strong programs across disciplines and fosters entrepreneurship.",
    type: "university",
    website: "https://www.stanford.edu",
    phone: "+1 650-723-2300",
    email: "admissions@stanford.edu"
  },
  {
    name: "Harvard University",
    location: "Cambridge, Massachusetts",
    description: "Harvard University is a private Ivy League research university and the oldest institution of higher education in the United States. It's renowned for its academic excellence and influential alumni.",
    type: "university",
    website: "https://www.harvard.edu",
    phone: "+1 617-495-1000",
    email: "admissions@harvard.edu"
  },
  {
    name: "California Institute of Technology",
    location: "Pasadena, California",
    description: "Caltech is a private research university known for its strong programs in engineering and natural sciences. The institute maintains a low student-to-faculty ratio and emphasizes research.",
    type: "institute",
    website: "https://www.caltech.edu",
    phone: "+1 626-395-6811",
    email: "admissions@caltech.edu"
  },
  {
    name: "University of California, Berkeley",
    location: "Berkeley, California",
    description: "UC Berkeley is a public research university and the flagship institution of the University of California system. It's known for its academic excellence, research, and social activism.",
    type: "university",
    website: "https://www.berkeley.edu",
    phone: "+1 510-642-6000",
    email: "admissions@berkeley.edu"
  },
  {
    name: "Yale University",
    location: "New Haven, Connecticut",
    description: "Yale University is a private Ivy League research university known for its excellent undergraduate programs, professional schools, and beautiful Gothic architecture.",
    type: "university",
    website: "https://www.yale.edu",
    phone: "+1 203-432-4771",
    email: "admissions@yale.edu"
  },
  {
    name: "Princeton University",
    location: "Princeton, New Jersey",
    description: "Princeton University is a private Ivy League research university known for its strong undergraduate focus, beautiful campus, and commitment to research and public service.",
    type: "university",
    website: "https://www.princeton.edu",
    phone: "+1 609-258-3000",
    email: "admissions@princeton.edu"
  },
  {
    name: "Columbia University",
    location: "New York City, New York",
    description: "Columbia University is a private Ivy League research university located in New York City. It's known for its rigorous academics, research opportunities, and urban location.",
    type: "university",
    website: "https://www.columbia.edu",
    phone: "+1 212-854-1754",
    email: "admissions@columbia.edu"
  },
  {
    name: "University of Chicago",
    location: "Chicago, Illinois",
    description: "The University of Chicago is a private research university known for its rigorous academics, intellectual rigor, and influential contributions to various academic fields.",
    type: "university",
    website: "https://www.uchicago.edu",
    phone: "+1 773-702-1234",
    email: "admissions@uchicago.edu"
  },
  {
    name: "Northwestern University",
    location: "Evanston, Illinois",
    description: "Northwestern University is a private research university known for its strong programs in journalism, engineering, and performing arts. It offers a comprehensive liberal arts education.",
    type: "university",
    website: "https://www.northwestern.edu",
    phone: "+1 847-491-3741",
    email: "admissions@northwestern.edu"
  }
];

const sampleStudents = [
  { name: "Alex Johnson", email: "alex.johnson@email.com", role: "student" },
  { name: "Sarah Williams", email: "sarah.williams@email.com", role: "student" },
  { name: "Michael Chen", email: "michael.chen@email.com", role: "student" },
  { name: "Emma Davis", email: "emma.davis@email.com", role: "student" },
  { name: "James Wilson", email: "james.wilson@email.com", role: "student" },
  { name: "Olivia Brown", email: "olivia.brown@email.com", role: "student" },
  { name: "Daniel Martinez", email: "daniel.martinez@email.com", role: "student" },
  { name: "Sophia Anderson", email: "sophia.anderson@email.com", role: "student" },
  { name: "William Taylor", email: "william.taylor@email.com", role: "student" },
  { name: "Isabella Thomas", email: "isabella.thomas@email.com", role: "student" }
];

const sampleAdmins = [
  { name: "Admin User", email: "admin@collegehub.com", role: "admin" },
  { name: "System Administrator", email: "sysadmin@collegehub.com", role: "admin" }
];

const sampleReviews = [
  {
    title: "Excellent research opportunities",
    comment: "MIT provides incredible research opportunities even for undergraduates. The professors are world-class and always willing to mentor students. The workload is intense but manageable if you're passionate about your field.",
    pros: "Cutting-edge research, brilliant faculty, strong industry connections",
    cons: "Extremely competitive, high stress levels, expensive cost of living",
    rating: 5
  },
  {
    title: "Great balance of academics and social life",
    comment: "Stanford offers the perfect blend of academic excellence and vibrant campus life. The weather is amazing, and there are countless opportunities for extracurricular activities.",
    pros: "Beautiful campus, great weather, diverse opportunities",
    cons: "Very expensive, competitive atmosphere",
    rating: 4
  },
  {
    title: "Prestigious but overwhelming",
    comment: "Harvard lives up to its reputation with incredible resources and networking opportunities. However, the pressure can be overwhelming at times, and the large size can make it feel impersonal.",
    pros: "Prestigious degree, amazing resources, global network",
    cons: "High pressure, competitive, large classes",
    rating: 4
  },
  {
    title: "Intense but rewarding",
    comment: "Caltech is perfect for those who love science and engineering. The small size means you get personal attention from professors, but the workload is demanding.",
    pros: "Small class sizes, personal attention, strong STEM focus",
    cons: "Limited social life, very demanding workload",
    rating: 4
  },
  {
    title: "Public university excellence",
    comment: "UC Berkeley offers Ivy League quality education at a public university price. The diversity of perspectives and opportunities is unmatched.",
    pros: "Great value, diverse student body, excellent programs",
    cons: "Large classes, competitive environment, high cost of living",
    rating: 4
  }
];

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await College.deleteMany({});
    await Review.deleteMany({});
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [];
    
    // Create students
    for (const student of sampleStudents) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
        ...student,
        password: hashedPassword
      });
      users.push(await user.save());
    }
    
    // Create admins
    for (const admin of sampleAdmins) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const user = new User({
        ...admin,
        password: hashedPassword
      });
      users.push(await user.save());
    }
    
    console.log(`${users.length} users created successfully`);
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    return [];
  }
};

// Seed colleges
const seedColleges = async () => {
  try {
    const colleges = [];
    for (const college of sampleColleges) {
      const newCollege = new College(college);
      colleges.push(await newCollege.save());
    }
    
    console.log(`${colleges.length} colleges created successfully`);
    return colleges;
  } catch (error) {
    console.error('Error seeding colleges:', error);
    return [];
  }
};

// Seed reviews
const seedReviews = async (users, colleges) => {
  try {
    const reviews = [];
    const students = users.filter(user => user.role === 'student');
    
    for (let i = 0; i < sampleReviews.length && i < colleges.length; i++) {
      const student = students[i % students.length];
      const college = colleges[i];
      const reviewData = sampleReviews[i];
      
      const review = new Review({
        user: student._id,
        college: college._id,
        ...reviewData
      });
      
      reviews.push(await review.save());
    }
    
    console.log(`${reviews.length} reviews created successfully`);
    return reviews;
  } catch (error) {
    console.error('Error seeding reviews:', error);
    return [];
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await clearDatabase();
    
    // Seed data
    const users = await seedUsers();
    const colleges = await seedColleges();
    await seedReviews(users, colleges);
    
    console.log('Database seeding completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Students: email@domain.com / password123');
    console.log('Admins: admin@collegehub.com / admin123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedDatabase();
