// Run this script to add sample contact data
// node backend/seedContacts.js

const mongoose = require("mongoose");
require("dotenv").config();

const contactSchema = new mongoose.Schema({
  category: String,
  name: String,
  designation: String,
  department: String,
  email: String,
  phone: String,
  officeLocation: String,
  officeHours: String,
  website: String,
  socialMedia: Object,
  description: String,
  priority: Number,
  isActive: Boolean,
});

const Contact = mongoose.model("Contact", contactSchema);

const sampleContacts = [
  {
    category: "Emergency",
    name: "Campus Security",
    phone: "+91-20-1234-5678",
    email: "security@mitadt.ac.in",
    description: "24/7 campus security and emergency response",
    priority: 100,
    isActive: true,
  },
  {
    category: "Emergency",
    name: "Medical Emergency",
    phone: "+91-20-1234-5679",
    email: "medical@mitadt.ac.in",
    description: "Campus medical center and ambulance services",
    priority: 99,
    isActive: true,
  },
  {
    category: "Department",
    name: "Computer Science Department",
    department: "Computer Science",
    email: "cs.dept@mitadt.ac.in",
    phone: "+91-20-1234-5680",
    officeLocation: "Block A, 3rd Floor",
    officeHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    description: "Department of Computer Science and Engineering",
    priority: 10,
    isActive: true,
  },
  {
    category: "Faculty",
    name: "Dr. Rajesh Kumar",
    designation: "Professor & HOD",
    department: "Computer Science",
    email: "rajesh.kumar@mitadt.ac.in",
    phone: "+91-20-1234-5681",
    officeLocation: "Block A, Room 301",
    officeHours: "Mon-Fri: 10:00 AM - 4:00 PM",
    website: "https://mitadt.ac.in/faculty/rajesh-kumar",
    description: "Specialization in AI and Machine Learning",
    priority: 8,
    isActive: true,
  },
  {
    category: "Administrative",
    name: "Admissions Office",
    designation: "Admissions & Registration",
    email: "admissions@mitadt.ac.in",
    phone: "+91-20-1234-5682",
    officeLocation: "Main Building, Ground Floor",
    officeHours: "Mon-Sat: 9:00 AM - 6:00 PM",
    website: "https://mitadt.ac.in/admissions",
    description: "Student admissions, registration, and documentation",
    priority: 9,
    isActive: true,
  },
  {
    category: "Student Services",
    name: "Library Services",
    email: "library@mitadt.ac.in",
    phone: "+91-20-1234-5683",
    officeLocation: "Central Library Building",
    officeHours: "Mon-Sun: 8:00 AM - 10:00 PM",
    description:
      "Library resources, book issue/return, and research assistance",
    priority: 7,
    isActive: true,
  },
  {
    category: "Student Services",
    name: "Student Counseling Center",
    email: "counseling@mitadt.ac.in",
    phone: "+91-20-1234-5684",
    officeLocation: "Student Welfare Building",
    officeHours: "Mon-Fri: 10:00 AM - 6:00 PM",
    description: "Mental health support and academic counseling",
    priority: 8,
    isActive: true,
  },
  {
    category: "Administrative",
    name: "Examination Cell",
    email: "exams@mitadt.ac.in",
    phone: "+91-20-1234-5685",
    officeLocation: "Block B, 1st Floor",
    officeHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    description: "Examination schedules, hall tickets, and result queries",
    priority: 9,
    isActive: true,
  },
  {
    category: "Department",
    name: "Mechanical Engineering Department",
    department: "Mechanical Engineering",
    email: "mech.dept@mitadt.ac.in",
    phone: "+91-20-1234-5686",
    officeLocation: "Block C, 2nd Floor",
    officeHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    description: "Department of Mechanical Engineering",
    priority: 10,
    isActive: true,
  },
  {
    category: "Student Services",
    name: "Hostel Office",
    email: "hostel@mitadt.ac.in",
    phone: "+91-20-1234-5687",
    officeLocation: "Hostel Block",
    officeHours: "24/7",
    description: "Hostel accommodation, complaints, and services",
    priority: 7,
    isActive: true,
  },
];

async function seedContacts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing contacts
    await Contact.deleteMany({});
    console.log("Cleared existing contacts");

    // Insert sample contacts
    await Contact.insertMany(sampleContacts);
    console.log(`Added ${sampleContacts.length} sample contacts`);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding contacts:", error);
    process.exit(1);
  }
}

seedContacts();
