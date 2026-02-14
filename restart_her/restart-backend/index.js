// index.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const serviceAccount = require('./serviceAccountKey.json');

dotenv.config();

// Firebase setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to generate roadmaps
app.post('/generate-roadmaps', async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch survey data from Firebase
    const surveyDoc = await db.collection('users')
                              .doc(userId)
                              .collection('survey')
                              .doc('responses')
                              .get();

    const surveyData = surveyDoc.data();
    if (!surveyData) {
      return res.status(404).send({ error: "Survey data not found" });
    }

    // Create detailed prompt for career roadmap
    const prompt = `
You are an expert career guidance counselor with deep knowledge across multiple industries.

Based on the following user profile, generate 3 distinct and personalized career roadmaps:

**User Profile:**
- Age Range: ${surveyData.ageRange || 'Not specified'}
- Location Type: ${surveyData.locationType || 'Not specified'}
- Academic Qualification: ${surveyData.qualification || 'Not specified'}
- Specialization: ${surveyData.fieldOfStudy || 'Not specified'}
- Previous Role: ${surveyData.previousRole || 'Not specified'}
- Years of Experience: ${surveyData.experienceYears || '0'}
- Industry: ${surveyData.industry || 'Not specified'}
- Career Break: ${surveyData.breakDuration || '0'} months
- Weekly Availability: ${surveyData.availableHours || 'Not specified'} hours
- Confidence Level: ${surveyData.confidenceLevel || 'Not specified'}
- Technical Proficiency: ${surveyData.skillLevel || 'Not specified'}
- Target Field: ${surveyData.desiredField || 'Not specified'}
- Work Model Preference: ${surveyData.jobType || 'Not specified'}
- Primary Goal: ${surveyData.goalType || 'Not specified'}

**Instructions:**
Generate 3 DISTINCT career roadmaps in JSON format. Each roadmap should be realistic and tailored to the user's profile.

Return ONLY valid JSON in this exact format:
{
  "roadmaps": [
    {
      "title": "Roadmap 1 Title",
      "description": "Brief overview of this career path",
      "careerPath": "Specific role progression",
      "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
      "courses": [
        {
          "name": "Course Name",
          "provider": "Platform/Institution",
          "duration": "Estimated time",
          "priority": "High/Medium/Low"
        }
      ],
      "milestones": {
        "shortTerm": ["0-6 months milestone 1", "0-6 months milestone 2"],
        "midTerm": ["6-18 months milestone 1", "6-18 months milestone 2"],
        "longTerm": ["18+ months milestone 1", "18+ months milestone 2"]
      },
      "practicalTips": ["Tip 1", "Tip 2", "Tip 3"],
      "estimatedTimeline": "Total time to achieve goals",
      "difficultyLevel": "Beginner/Intermediate/Advanced"
    }
  ]
}

Make each roadmap significantly different in approach, difficulty, and target outcomes.
`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career guidance counselor. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile", // Fast and high-quality model
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" } // Ensures JSON output
    });

    const aiOutput = completion.choices[0].message.content;
    
    // Parse the JSON response
    let roadmapsData;
    try {
      roadmapsData = JSON.parse(aiOutput);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return res.status(500).send({ 
        error: "Failed to parse AI response", 
        details: parseError.message,
        rawResponse: aiOutput 
      });
    }

    // Save AI-generated roadmaps to Firebase
    await db.collection('users')
            .doc(userId)
            .collection('roadmaps')
            .doc('options')
            .set({ 
              roadmaps: roadmapsData.roadmaps,
              generatedAt: admin.firestore.FieldValue.serverTimestamp(),
              model: "llama-3.3-70b-versatile"
            });

    // Send structured roadmaps back to Flutter
    res.send({ 
      message: "Roadmaps generated successfully", 
      roadmaps: roadmapsData.roadmaps 
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ 
      error: "Something went wrong", 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});