const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import models
const College = require('../models/College');

// Check and fix colleges
const checkAndFixColleges = async () => {
  try {
    console.log('Checking college database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Check current colleges
    const currentColleges = await College.find();
    console.log(`Current colleges in database: ${currentColleges.length}`);
    
    currentColleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name} (${college.location})`);
    });
    
    // Colleges to add (including Chandigarh University)
    const collegesToAdd = [
      {
        name: "Chandigarh University",
        location: "Mohali, Punjab, India",
        description: "Chandigarh University is a premier private university located in Mohali, Punjab. It offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including engineering, management, pharmacy, law, and more. The university is known for its modern infrastructure, experienced faculty, and strong industry connections providing excellent placement opportunities.",
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
        name: "Punjab Engineering College",
        location: "Chandigarh, Punjab, India",
        description: "Punjab Engineering College (PEC) is a premier engineering institution in Punjab. It offers undergraduate and postgraduate programs in various engineering disciplines with excellent faculty and infrastructure.",
        type: "college",
        website: "https://www.pec.ac.in",
        phone: "+91-172-278-5301",
        email: "admissions@pec.ac.in"
      },
      {
        name: "University of Petroleum and Energy Studies",
        location: "Dehradun, Uttarakhand, India",
        description: "University of Petroleum and Energy Studies (UPES) is a premier institution for petroleum and energy studies. It offers specialized programs with excellent research facilities and industry connections.",
        type: "institute",
        website: "https://www.upes.ac.in",
        phone: "+91-1358-277-4523",
        email: "admissions@upes.ac.in"
      },
      {
        name: "National Institute of Technology",
        location: "Kurukshetra, Haryana, India",
        description: "National Institute of Technology (NIT) Kurukshetra is a premier engineering college known for its academic excellence and research contributions. It offers undergraduate and postgraduate programs with modern facilities.",
        type: "institute",
        website: "https://www.nitkkr.ac.in",
        phone: "+91-1744-239-651",
        email: "admissions@nitkkr.ac.in"
      }
    ];
    
    // Add missing colleges
    let addedCount = 0;
    for (const college of collegesToAdd) {
      try {
        // Check if college already exists
        const existingCollege = currentColleges.find(c => 
          c.name.toLowerCase() === college.name.toLowerCase()
        );
        
        if (!existingCollege) {
          const newCollege = new College(college);
          await newCollege.save();
          console.log(`Added college: ${college.name}`);
          addedCount++;
        } else {
          console.log(`College already exists: ${college.name}`);
        }
      } catch (error) {
        console.error(`Error adding college ${college.name}:`, error.message);
      }
    }
    
    console.log(`\nSuccessfully added ${addedCount} new colleges`);
    
    // Verify final count
    const finalColleges = await College.find();
    console.log(`\nFinal college count: ${finalColleges.length}`);
    
    // List all colleges
    console.log('\nAll colleges in database:');
    finalColleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name} (${college.location})`);
    });
    
    console.log('\nCollege database update completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the script
checkAndFixColleges();
