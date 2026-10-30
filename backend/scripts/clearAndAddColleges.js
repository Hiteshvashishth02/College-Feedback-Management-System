const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Clear and add colleges
const clearAndAddColleges = async () => {
  try {
    console.log('Clearing and adding colleges...');
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    // Drop the colleges collection completely
    try {
      await db.collection('colleges').drop();
      console.log('Dropped colleges collection');
    } catch (error) {
      console.log('Collection might not exist, continuing...');
    }
    
    // Recreate the collection with proper schema
    const collegesCollection = db.collection('colleges');
    
    // Colleges to add
    const collegesToAdd = [
      {
        name: "Chandigarh University",
        location: "Mohali, Punjab, India",
        description: "Chandigarh University is a private university located in Mohali, Punjab. It offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including engineering, management, pharmacy, law, and more. The university is known for its modern infrastructure, experienced faculty, and strong industry connections providing excellent placement opportunities.",
        type: "university",
        website: "https://www.cuchd.in",
        phone: "+91-172-3984200",
        email: "admissions@cuchd.in",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi, India",
        description: "IIT Delhi is one of the premier engineering institutions in India, known for its excellence in technical education, research, and innovation. It offers undergraduate, postgraduate, and doctoral programs in various engineering and science disciplines.",
        type: "institute",
        website: "https://www.iitd.ac.in",
        phone: "+91-11-26582171",
        email: "admissions@iitd.ac.in",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Stanford University",
        location: "Stanford, California",
        description: "Stanford University is a private research university known for its academic excellence, research contributions, and beautiful campus. It offers strong programs across disciplines and fosters entrepreneurship.",
        type: "university",
        website: "https://www.stanford.edu",
        phone: "+1 650-723-2300",
        email: "admissions@stanford.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Harvard University",
        location: "Cambridge, Massachusetts",
        description: "Harvard University is a private Ivy League research university and the oldest institution of higher education in the United States. It's renowned for its academic excellence and influential alumni.",
        type: "university",
        website: "https://www.harvard.edu",
        phone: "+1 617-495-1000",
        email: "admissions@harvard.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "University of California, Berkeley",
        location: "Berkeley, California",
        description: "UC Berkeley is a public research university and the flagship institution of the University of California system. It's known for its academic excellence, research, and social activism.",
        type: "university",
        website: "https://www.berkeley.edu",
        phone: "+1 510-642-6000",
        email: "admissions@berkeley.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "California Institute of Technology",
        location: "Pasadena, California",
        description: "Caltech is a private research university known for its strong programs in engineering and natural sciences. The institute maintains a low student-to-faculty ratio and emphasizes research.",
        type: "institute",
        website: "https://www.caltech.edu",
        phone: "+1 626-395-6811",
        email: "admissions@caltech.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Yale University",
        location: "New Haven, Connecticut",
        description: "Yale University is a private Ivy League research university known for its excellent undergraduate programs, professional schools, and beautiful Gothic architecture.",
        type: "university",
        website: "https://www.yale.edu",
        phone: "+1 203-432-4771",
        email: "admissions@yale.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Princeton University",
        location: "Princeton, New Jersey",
        description: "Princeton University is a private Ivy League research university known for its strong undergraduate focus, beautiful campus, and commitment to research and public service.",
        type: "university",
        website: "https://www.princeton.edu",
        phone: "+1 609-258-3000",
        email: "admissions@princeton.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Columbia University",
        location: "New York City, New York",
        description: "Columbia University is a private Ivy League research university located in New York City. It's known for its rigorous academics, research opportunities, and urban location.",
        type: "university",
        website: "https://www.columbia.edu",
        phone: "+1 212-854-1754",
        email: "admissions@columbia.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "University of Chicago",
        location: "Chicago, Illinois",
        description: "The University of Chicago is a private research university known for its rigorous academics, intellectual rigor, and influential contributions to various academic fields.",
        type: "university",
        website: "https://www.uchicago.edu",
        phone: "+1 773-702-1234",
        email: "admissions@uchicago.edu",
        averageRating: 0,
        totalReviews: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert all colleges
    const result = await collegesCollection.insertMany(collegesToAdd);
    console.log(`Successfully added ${result.insertedCount} colleges`);
    
    // Create text index for search functionality
    await collegesCollection.createIndex({ 
      name: 'text', 
      location: 'text', 
      description: 'text' 
    });
    console.log('Created text index for search functionality');
    
    // Show sample colleges
    const sampleColleges = await collegesCollection.find().limit(5).toArray();
    console.log('\nSample colleges added:');
    sampleColleges.forEach(college => {
      console.log(`- ${college.name} (${college.location})`);
    });
    
    console.log('\nCollege database setup completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
clearAndAddColleges();
