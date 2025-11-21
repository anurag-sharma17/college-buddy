// Smart Chatbot - Works immediately with intelligent keyword responses!
// No external API needed - 100% reliable and FREE!

// Chat with AI
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Processing chat request:", message.substring(0, 50) + "...");

    // Smart keyword-based response system
    const lowerMsg = message.toLowerCase();
    let responseText = "";

    // Study Groups
    if (
      lowerMsg.includes("study group") ||
      lowerMsg.includes("group study") ||
      lowerMsg.includes("peer study")
    ) {
      responseText =
        "📚 **Study Groups**\n\nYou can view and join existing study groups, or create your own! Study groups are organized by:\n• Subject (Math, Programming, Physics, etc.)\n• Year (First Year, Second Year, etc.)\n• Meeting schedule\n\nGo to the **Study Groups page** to browse all available groups and join one that fits your schedule!";
    }
    // Teacher related
    else if (
      lowerMsg.includes("teacher") ||
      lowerMsg.includes("professor") ||
      lowerMsg.includes("faculty") ||
      lowerMsg.includes("instructor")
    ) {
      if (
        lowerMsg.includes("available") ||
        lowerMsg.includes("schedule") ||
        lowerMsg.includes("when")
      ) {
        responseText =
          "👨‍🏫 **Teacher Availability**\n\nCheck the **Teacher Availability page** to see:\n• Office hours for each teacher\n• Best times to consult\n• Contact methods (email/office)\n\nYou can also see which teachers are available right now!";
      } else if (
        lowerMsg.includes("seat") ||
        lowerMsg.includes("office") ||
        lowerMsg.includes("where") ||
        lowerMsg.includes("location")
      ) {
        responseText =
          "📍 **Teacher Seating**\n\nVisit the **Teacher Seating page** to find:\n• Teacher office locations\n• Department-wise seating arrangement\n• Floor and room numbers\n\nThis helps you quickly locate any teacher's office!";
      } else {
        responseText =
          "👨‍🏫 **Teacher Information**\n\nI can help you with:\n• **Teacher Availability** - Check office hours and consultation times\n• **Teacher Seating** - Find teacher office locations\n\nWhat specific information do you need?";
      }
    }
    // Clubs
    else if (
      lowerMsg.includes("club") ||
      lowerMsg.includes("activity") ||
      lowerMsg.includes("activities") ||
      lowerMsg.includes("extracurricular")
    ) {
      responseText =
        "🎭 **College Clubs**\n\nWe have many active clubs! Visit the **Clubs page** to discover:\n• Tech clubs (Coding, Robotics, AI)\n• Cultural clubs (Music, Dance, Drama)\n• Sports clubs\n• Social service clubs\n\nEach club page shows activities, meeting times, and how to join!";
    }
    // Transport
    else if (
      lowerMsg.includes("transport") ||
      lowerMsg.includes("bus") ||
      lowerMsg.includes("shuttle") ||
      lowerMsg.includes("commute")
    ) {
      responseText =
        "🚌 **Transport Information**\n\nCheck the **Transport page** for:\n• Bus schedules and timings\n• Route information\n• Pickup/drop points\n• Campus shuttle services\n\nYou'll find all transportation options to reach campus!";
    }
    // Alumni
    else if (
      lowerMsg.includes("alumni") ||
      lowerMsg.includes("graduate") ||
      lowerMsg.includes("network") ||
      lowerMsg.includes("mentor")
    ) {
      responseText =
        "🎓 **Alumni Connect**\n\nThe **Alumni Connect page** helps you:\n• Connect with graduates from your department\n• Find mentors in your field\n• Get career guidance\n• Network for internships and jobs\n\nGreat for building professional connections!";
    }
    // Contacts
    else if (
      lowerMsg.includes("contact") ||
      lowerMsg.includes("phone") ||
      lowerMsg.includes("email") ||
      lowerMsg.includes("call") ||
      lowerMsg.includes("reach")
    ) {
      responseText =
        "📞 **Important Contacts**\n\nVisit the **Contacts page** for:\n• Department phone numbers\n• Administration emails\n• Student services contacts\n• Emergency contacts\n• Faculty contact information\n\nAll organized by department and category!";
    }
    // Resources/Academic
    else if (
      lowerMsg.includes("resource") ||
      lowerMsg.includes("material") ||
      lowerMsg.includes("note") ||
      lowerMsg.includes("book")
    ) {
      responseText =
        "📖 **Academic Resources**\n\nExplore:\n• **First Year** - Core subjects and foundation courses\n• **Second Year** - Advanced topics\n• **Specializations** - Branch-specific resources\n\nYou can also join **Study Groups** to share notes and resources!";
    }
    // First Year
    else if (
      lowerMsg.includes("first year") ||
      lowerMsg.includes("freshman") ||
      lowerMsg.includes("fy")
    ) {
      responseText =
        "🎒 **First Year Information**\n\nCheck the **First Year page** for:\n• Core subjects and syllabus\n• Important dates\n• Study materials\n• Tips for new students\n\nDon't forget to join first-year study groups!";
    }
    // Second Year
    else if (
      lowerMsg.includes("second year") ||
      lowerMsg.includes("sophomore") ||
      lowerMsg.includes("sy")
    ) {
      responseText =
        "📚 **Second Year Information**\n\nVisit the **Second Year page** for:\n• Advanced course materials\n• Branch-specific content\n• Project guidelines\n• Internship information";
    }
    // Specializations
    else if (
      lowerMsg.includes("specialization") ||
      lowerMsg.includes("branch") ||
      lowerMsg.includes("major") ||
      lowerMsg.includes("department")
    ) {
      responseText =
        "🎯 **Specializations**\n\nExplore the **Specializations page** to learn about:\n• Different engineering branches\n• Computer Science streams\n• Career paths\n• Department-specific resources\n\nChoose your path wisely!";
    }
    // Greetings
    else if (
      lowerMsg.match(
        /^(hello|hi|hey|greetings|good morning|good afternoon|good evening)/
      )
    ) {
      const greetings = ["Hello", "Hi there", "Hey", "Greetings"];
      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];
      responseText = `${randomGreeting}! 👋 I'm your college assistant.\n\nI can help you with:\n• 📚 Study groups\n• 👨‍🏫 Teacher information\n• 🎭 College clubs\n• 🚌 Transport schedules\n• 🎓 Alumni connections\n• 📞 Important contacts\n\nWhat would you like to know?`;
    }
    // Help/What can you do
    else if (
      lowerMsg.includes("help") ||
      lowerMsg.includes("what can you") ||
      lowerMsg.includes("how can you") ||
      lowerMsg.includes("assist")
    ) {
      responseText =
        "🤖 **I'm here to help!**\n\nI can assist you with:\n\n📚 **Academics**\n• Study groups and peer learning\n• Academic resources and materials\n\n👨‍🏫 **Teachers**\n• Teacher availability and schedules\n• Office locations\n\n🎯 **Campus Life**\n• College clubs and activities\n• Transport and commute info\n• Alumni networking\n• Important contacts\n\nJust ask me anything about these topics!";
    }
    // Thank you
    else if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
      responseText =
        "You're welcome! 😊 Feel free to ask if you need anything else. I'm here to help!";
    }
    // Default intelligent response
    else {
      responseText = `I'm here to help with college information! 🎓\n\nI can assist you with:\n• **Study Groups** - Find or create study groups\n• **Teachers** - Check availability and locations\n• **Clubs** - Discover and join clubs\n• **Transport** - Bus schedules and routes\n• **Alumni** - Connect with graduates\n• **Contacts** - Important phone numbers\n\nCould you please be more specific about what you'd like to know? Or try asking about any of the topics above!`;
    }

    console.log("✅ Response generated");

    res.json({
      success: true,
      response: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Chatbot error:", error.message);

    res.status(500).json({
      error: "Something went wrong",
      details: "Please try again",
    });
  }
};

// Health check for the chatbot
exports.healthCheck = async (req, res) => {
  try {
    res.json({
      status: "✅ Chatbot is running!",
      service: "Smart Keyword-Based Assistant",
      features: [
        "Study Groups",
        "Teacher Information",
        "College Clubs",
        "Transport",
        "Alumni Connect",
        "Important Contacts",
      ],
      reliable: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
