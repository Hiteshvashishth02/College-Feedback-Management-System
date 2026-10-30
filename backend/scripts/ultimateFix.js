const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import College model
const College = require('../models/College');

// Ultimate fix with proper database handling
const ultimateFix = async () => {
  try {
    console.log('Starting ultimate fix...');
    
    // Connect to database with proper error handling
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Drop the entire collection to remove all problematic indexes
    try {
      await College.collection.drop();
      console.log('Dropped colleges collection');
    } catch (error) {
      console.log('Collection might not exist, continuing...');
    }
    
    // Colleges to add
    const collegesToAdd = [
      {
        name: "Chandigarh University",
        location: "Mohali, Punjab, India",
        description: "Chandigarh University is a private university located in Mohali, Punjab. It offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including engineering, management, pharmacy, law, and more. The university is known for its modern infrastructure, experienced faculty, and strong industry connections providing excellent placement opportunities.",
        type: "university",
        website: "https://www.cuchd.in",
        phone: "+91-172-3984200",
        email: "admissions@cuchd.in"
      },
      {
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi, India",
        description: "IIT Delhi is one of the premier engineering institutions in India, known for its excellence in technical education, research, and innovation. It offers undergraduate, postgraduate, and doctoral programs in various engineering and science disciplines.",
        type: "institute",
        website: "https://www.iitd.ac.in",
        phone: "+91-11-26582171",
        email: "admissions@iitd.ac.in"
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
        name: "University of California, Berkeley",
        location: "Berkeley, California",
        description: "UC Berkeley is a public research university and the flagship institution of the University of California system. It's known for its academic excellence, research, and social activism.",
        type: "university",
        website: "https://www.berkeley.edu",
        phone: "+1 510-642-6000",
        email: "admissions@berkeley.edu"
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
      }
    ];
    
    // Add colleges one by one with error handling
    let successCount = 0;
    for (const college of collegesToAdd) {
      try {
        const newCollege = new College(college);
        await newCollege.save();
        console.log(`Added: ${college.name}`);
        successCount++;
      } catch (error) {
        console.error(`Error adding ${college.name}:`, error.message);
        // Continue with next college
      }
    }
    
    console.log(`\nSuccessfully added ${successCount} colleges`);
    
    // Verify the database
    const totalCount = await College.countDocuments();
    console.log(`Total colleges in database: ${totalCount}`);
    
    // Test the API
    console.log('\nTesting colleges API...');
    const colleges = await College.find().sort({ name: 1 });
    console.log('All colleges in database:');
    colleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name} (${college.location})`);
    });
    
    // Test search functionality
    console.log('\nTesting search functionality...');
    const searchResults = await College.find({
      $text: { $search: "engineering" }
    });
    console.log(`Found ${searchResults.length} colleges matching "engineering"`);
    
    // Test the actual API endpoint
    console.log('\nTesting actual API endpoint...');
    const response = await fetch('http://localhost:5000/api/colleges');
    if (response.ok) {
      const data = await response.json();
      console.log(`API Response: ${data.success}, Count: ${data.count}`);
    } else {
      console.log('API endpoint test failed');
    }
    
    console.log('\nUltimate fix completed successfully!');
    
  } catch (error) {
    console.error('Error in ultimate fix:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the ultimate fix
ultimateFix();
