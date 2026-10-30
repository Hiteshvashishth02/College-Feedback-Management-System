const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import College model
const College = require('../models/College');

// Additional colleges to add (avoiding the problematic ones)
const additionalColleges = [
  {
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai, Maharashtra, India",
    description: "IIT Bombay is one of India's premier engineering institutions known for its excellence in technical education, research, and innovation. It offers undergraduate, postgraduate, and doctoral programs in various engineering and science disciplines.",
    type: "institute",
    website: "https://www.iitb.ac.in",
    phone: "+91-22-2576-7111",
    email: "admissions@iitb.ac.in"
  },
  {
    name: "University of Delhi",
    location: "New Delhi, India",
    description: "University of Delhi is a premier central university known for its high academic standards, research facilities, and diverse range of programs across arts, science, commerce, and professional studies.",
    type: "university",
    website: "https://www.du.ac.in",
    phone: "+91-11-2766-7777",
    email: "admission@du.ac.in"
  },
  {
    name: "Jawaharlal Nehru University",
    location: "New Delhi, India",
    description: "JNU is a premier central university known for its focus on research and postgraduate education across humanities, social sciences, and sciences. It's recognized for its academic excellence and diverse student community.",
    type: "university",
    website: "https://www.jnu.ac.in",
    phone: "+91-11-2670-4321",
    email: "admissions@jnu.ac.in"
  },
  {
    name: "Birla Institute of Technology and Science",
    location: "Pilani, Rajasthan, India",
    description: "BITS Pilani is a premier private university known for its excellence in engineering and science education. It offers undergraduate, postgraduate, and doctoral programs with a strong focus on research and innovation.",
    type: "institute",
    website: "https://www.bits-pilani.ac.in",
    phone: "+91-1596-255-555",
    email: "admissions@bits-pilani.ac.in"
  },
  {
    name: "Vellore Institute of Technology",
    location: "Vellore, Tamil Nadu, India",
    description: "VIT is a premier private university known for its excellence in engineering education and research. It offers undergraduate, postgraduate, and doctoral programs across various disciplines with state-of-the-art facilities.",
    type: "institute",
    website: "https://www.vit.ac.in",
    phone: "+91-416-224-3091",
    email: "admissions@vit.ac.in"
  }
];

// Add more colleges function
const addMoreColleges = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Adding more colleges...');
    
    // Add additional colleges
    for (const college of additionalColleges) {
      try {
        const newCollege = new College(college);
        await newCollege.save();
        console.log(`Added: ${college.name}`);
      } catch (error) {
        console.error(`Error adding ${college.name}:`, error.message);
      }
    }
    
    // Verify colleges were added
    const count = await College.countDocuments();
    console.log(`\nTotal colleges in database: ${count}`);
    
    // Test the API endpoint
    console.log('\nTesting colleges API...');
    const colleges = await College.find().limit(10);
    console.log('All colleges in database:');
    colleges.forEach(college => {
      console.log(`- ${college.name} (${college.location})`);
    });
    
    console.log('\nCollege database setup completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
addMoreColleges();
