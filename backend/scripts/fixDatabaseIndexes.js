const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Fix database indexes
const fixDatabaseIndexes = async () => {
  try {
    console.log('Fixing database indexes...');
    
    const db = mongoose.connection.db;
    
    // Drop all indexes on colleges collection
    try {
      await db.collection('colleges').dropIndexes();
      console.log('Dropped all indexes on colleges collection');
    } catch (error) {
      console.log('No indexes to drop or error dropping indexes:', error.message);
    }
    
    // Recreate proper indexes
    await db.collection('colleges').createIndex({ name: 1 }, { unique: true });
    console.log('Created unique index on name field');
    
    await db.collection('colleges').createIndex({ 
      name: 'text', 
      location: 'text', 
      description: 'text' 
    });
    console.log('Created text index for search functionality');
    
    await db.collection('colleges').createIndex({ isActive: 1 });
    console.log('Created index on isActive field');
    
    console.log('Database indexes fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
fixDatabaseIndexes();
