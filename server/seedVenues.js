require('dotenv').config()
const mongoose = require('mongoose')
const Venue = require('./models/Venue') // make sure Venue model is correct
const connectDB = require('./utils/connectDB')

const venues = [
  {
    name: "The Taj Mahal Palace",
    description: "An iconic symbol of Mumbai's hospitality, offering unparalleled views of the Arabian Sea and the Gateway of India. Perfect for grand, luxurious, and heritage weddings.",
    location: { 
      address: "Apollo Bunder", 
      city: "Mumbai", 
      state: "Maharashtra", 
      zipCode: "400001", 
      country: "India",
      coordinates: { lat: 18.9217, lng: 72.8330 }
    },
    category: "Hotel", price: 1500000, capacity: 1000, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: true, outdoor: false, pool: true, dj: true },
    images: [
      { url: "https://images.unsplash.com/photo-1590076215667-875d4efbf7fb?w=1200&q=80" }, // Actual Taj Mahal Palace
      { url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80" }
    ],
    rating: { average: 4.9, count: 120 }
  },
  {
    name: "Umaid Bhawan Palace",
    description: "Set amidst 26 acres of lush gardens, this magnificent palace offers an authentic royal wedding experience in the Blue City of Jodhpur.",
    location: { 
      address: "Circuit House Rd", 
      city: "Jodhpur", 
      state: "Rajasthan", 
      zipCode: "342006", 
      country: "India",
      coordinates: { lat: 26.2807, lng: 73.0475 }
    },
    category: "Resort", price: 3500000, capacity: 1500, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: true, outdoor: true, pool: true, dj: true },
    images: [
      { url: "https://images.unsplash.com/photo-1599661559684-6592f1706b92?w=1200&q=80" }, // Rajasthan Palace vibes
      { url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80" }
    ],
    rating: { average: 5.0, count: 200 }
  },
  {
    name: "The Leela Palace",
    description: "Located on the tranquil shores of Lake Pichola, offering a spectacular view of the Aravalli Mountains. A romantic destination for fairy-tale weddings.",
    location: { 
      address: "Lake Pichola", 
      city: "Udaipur", 
      state: "Rajasthan", 
      zipCode: "313001", 
      country: "India",
      coordinates: { lat: 24.5739, lng: 73.6766 }
    },
    category: "Resort", price: 2500000, capacity: 800, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: true, outdoor: true, pool: true, dj: true },
    images: [
      { url: "https://images.unsplash.com/photo-1583037189850-1921f4bc59e0?w=1200&q=80" }, // Udaipur Lake Pichola vibes
      { url: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=1200&q=80" }
    ],
    rating: { average: 4.8, count: 85 }
  },
  {
    name: "ITC Grand Chola",
    description: "A luxury collection hotel, inspired by the legacy of the Cholas. With grand banquets and majestic architecture, it's perfect for a classic south Indian or modern royal wedding.",
    location: { 
      address: "Mount Road, Guindy", 
      city: "Chennai", 
      state: "Tamil Nadu", 
      zipCode: "600032", 
      country: "India",
      coordinates: { lat: 13.0104, lng: 80.2207 }
    },
    category: "Banquet Hall", price: 1200000, capacity: 2000, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: true, outdoor: false, pool: true, dj: true },
    images: [
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80" }, // Luxury indoor banquet
      { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80" }
    ],
    rating: { average: 4.7, count: 140 }
  },
  {
    name: "Taj Falaknuma Palace",
    description: "Once the residence of the Nizam of Hyderabad, this restored 1894 palace offers a blend of Italian and Tudor architecture. Live like royalty on your special day.",
    location: { 
      address: "Engine Bowli, Falaknuma", 
      city: "Hyderabad", 
      state: "Telangana", 
      zipCode: "500053", 
      country: "India",
      coordinates: { lat: 17.3304, lng: 78.4674 }
    },
    category: "Hotel", price: 4000000, capacity: 600, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: true, outdoor: true, pool: true, dj: false },
    images: [
      { url: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1200&q=80" }, // Heritage hotel
      { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80" }
    ],
    rating: { average: 4.9, count: 110 }
  },
  {
    name: "Kumarakom Lake Resort",
    description: "Exudes the charm of Kerala's true heritage. Offers an exotic backwater backdrop for a serene and picturesque wedding.",
    location: { 
      address: "Kavanattinkara", 
      city: "Kottayam", 
      state: "Kerala", 
      zipCode: "686563", 
      country: "India",
      coordinates: { lat: 9.6200, lng: 76.4312 }
    },
    category: "Resort", price: 800000, capacity: 350, featured: true,
    amenities: { ac: true, parking: true, catering: true, indoor: false, outdoor: true, pool: true, dj: true },
    images: [
      { url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80" }, // Kerala backwaters
      { url: "https://images.unsplash.com/photo-1522792011406-8d54c4aa6bc5?w=1200&q=80" }
    ],
    rating: { average: 4.6, count: 65 }
  }
]

const seedDB = async () => {
  try {
    await connectDB()
    console.log('Connected to DB. Clearing old venues...')
    await Venue.deleteMany({}) // clear existing
    console.log('Old venues cleared. Inserting original Indian venues...')
    
    await Venue.insertMany(venues)
    console.log('✅ Successfully seeded real Indian venues!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDB()
