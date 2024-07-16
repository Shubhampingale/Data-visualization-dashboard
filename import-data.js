import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import DataModel from './backend/models/model.js'; 

// Path to your JSON file
const jsonFilePath = 'C:/Users/Rutuja/Downloads/jsondata.json';

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/data-visualization';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the script if the connection fails
  });

try {
  // Read the JSON file
  const jsonData = readFileSync(jsonFilePath, 'utf8');

  // Parse JSON data
  const parsedData = JSON.parse(jsonData);

  // Process and sanitize data
  const sanitizedData = parsedData.map(item => ({
    end_year: item.end_year || "",
    intensity: item.intensity || 0,
    sector: item.sector || "",
    topic: item.topic || "",
    insight: item.insight || "",
    url: item.url || "",
    region: item.region || "",
    start_year: item.start_year || "",
    impact: item.impact || "",
    added: item.added || "",
    published: item.published || "",
    country: item.country || "",
    relevance: item.relevance || 0,
    pestle: item.pestle || "",
    source: item.source || "",
    title: item.title || "",
    likelihood: item.likelihood || 0
  }));

  // Insert data into MongoDB
  DataModel.insertMany(sanitizedData)
    .then(() => {
      console.log('Data imported successfully');
      mongoose.connection.close();
    })
    .catch(err => {
      console.error('Error importing data:', err);
      mongoose.connection.close();
    });

} catch (error) {
  console.error('Error reading or parsing JSON file:', error);
  mongoose.connection.close();
}
