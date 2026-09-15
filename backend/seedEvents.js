import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';
import Event from './models/Event.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/racapitals';

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events.');

    // Get some companies to link to the events
    const companies = await Company.find().limit(3);
    
    const eventsToInsert = [
      {
        title: "Successfully filed Draft Red Herring Prospectus (DRHP)",
        description: "The company has filed its DRHP with SEBI, moving one step closer to its highly anticipated initial public offering.",
        eventType: "DRHP",
        eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        company: companies[0]?._id
      },
      {
        title: "Secured Series C Funding of $50M",
        description: "Raised $50 million in a Series C funding round led by top-tier venture capital firms to accelerate growth and market expansion.",
        eventType: "Funding",
        eventDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        company: companies[1]?._id
      },
      {
        title: "Appointed New Chief Executive Officer",
        description: "Announced the appointment of a veteran industry executive as the new CEO to lead the next phase of strategic growth.",
        eventType: "Leadership Change",
        eventDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        company: companies[2]?._id
      },
      {
        title: "Launched Revolutionary New Product Line",
        description: "Unveiled a new suite of innovative products expected to disrupt the market and significantly boost Q4 revenue.",
        eventType: "Other",
        eventDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
        company: companies[0]?._id
      }
    ];

    // Remove any events where company is undefined (in case you have less than 3 companies in the DB)
    const validEvents = eventsToInsert.filter(e => e.company);

    if (validEvents.length === 0) {
       console.log("No companies found in the database. Please add companies first.");
    } else {
       await Event.insertMany(validEvents);
       console.log(`Successfully seeded ${validEvents.length} events!`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
