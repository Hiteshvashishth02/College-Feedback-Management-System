const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import College model
const College = require('../models/College');

// Fix search index
const fixSearchIndex = async () => {
  try {
    console.log('Fixing search index...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Create text index for search functionality
    await College.collection.createIndex({ 
      name: 'text', 
      location: 'text', 
      description: 'text' 
    });
    console.log('Created text index for search functionality');
    
    // Test search functionality
    console.log('\nTesting search functionality...');
    const searchResults = await College.find({
      $text: { $search: "engineering" }
    });
    console.log(`Found ${searchResults.length} colleges matching "engineering"`);
    
    // Test various search terms
    const searchTerms = ["university", "california", "institute", "college"];
    for (const term of searchTerms) {
      const results = await College.find({
        $text: { $search: term }
      });
      console.log(`Found ${results.length} colleges matching "${term}"`);
    }
    
    // Test the actual API endpoint
    console.log('\nTesting actual API endpoint...');
    try {
      const response = await fetch('http://localhost:5000/api/colleges');
      if (response.ok) {
        const data = await response.json();
        console.log(`API Response: ${data.success}, Count: ${data.count}`);
        console.log('API is working correctly!');
      } else {
        console.log('API endpoint test failed');
      }
    } catch (error) {
      console.log('API endpoint test error:', error.message);
    }
    
    console.log('\nSearch index fix completed successfully!');
    
  } catch (error) {
    console.error('Error fixing search index:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run the search index fix
fixSearchIndex();
