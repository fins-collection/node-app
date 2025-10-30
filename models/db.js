// const mongoose = require('mongoose');
// // Allow Promises
// mongoose.Promise = global.Promise;
// // Connection
// mongoose.connect('mongodb://0.0.0.0:27017/db_test', { useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false  });
// // Validation
// mongoose.connection
//   .once('open', () => console.log('Connected to the database!'))
//   .on('error', err => console.log('Error with the database!', err));
const mongoose = require('mongoose');

// Allow Promises
mongoose.Promise = global.Promise;

// Get MongoDB URI from environment variable (use default for local development)
// const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/db_test';
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/db_test';


// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true  // Recommended in some MongoDB versions for backward compatibility
})
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Error with the database!', err);
  });

// Validation
mongoose.connection
  .once('open', () => console.log('MongoDB connection established successfully!'))
  .on('error', (err) => console.log('Error connecting to MongoDB:', err));
