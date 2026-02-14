import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/survey_widget.dart';
import 'roadmaps_screen.dart'; // We'll create this next

class SurveyScreen extends StatefulWidget {
  const SurveyScreen({super.key});

  @override
  State<SurveyScreen> createState() => _SurveyScreenState();
}

class _SurveyScreenState extends State<SurveyScreen> {
  final _formKey = GlobalKey<FormState>();

  // Credentials strictly preserved
  String? ageRange, locationType, qualification, fieldOfStudy;
  String? previousRole, experienceYears, industry, breakDuration;
  String? availableHours, confidenceLevel, skillLevel, desiredField, jobType, goalType;

  // Submit survey function
  Future<void> _submitSurvey() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please fill all required fields"),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      // Get current user ID
      final userId = 'user_${DateTime.now().millisecondsSinceEpoch}';

      // Show loading indicator
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(
            color: Color(0xFF6B7FD7),
          ),
        ),
      );

      // Save survey data to Firebase
      await FirebaseFirestore.instance
          .collection('users')
          .doc(userId)
          .collection('survey')
          .doc('responses')
          .set({
        'ageRange': ageRange,
        'locationType': locationType,
        'qualification': qualification,
        'fieldOfStudy': fieldOfStudy,
        'previousRole': previousRole,
        'experienceYears': experienceYears,
        'industry': industry,
        'breakDuration': breakDuration,
        'availableHours': availableHours,
        'confidenceLevel': confidenceLevel,
        'skillLevel': skillLevel,
        'desiredField': desiredField,
        'jobType': jobType,
        'goalType': goalType,
        'timestamp': FieldValue.serverTimestamp(),
      });

      print('Survey data saved to Firebase');

      // Call your backend to generate roadmaps
      // CHANGE THIS URL based on your setup:
      // - Android Emulator: http://10.0.2.2:3000/generate-roadmaps
      // - iOS Simulator: http://localhost:3000/generate-roadmaps
      // - Physical Device: http://YOUR_COMPUTER_IP:3000/generate-roadmaps
      
      final response = await http.post(
        Uri.parse('http://172.31.104.254:3000/generate-roadmaps'), // Android Emulator
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userId': userId}),
      );

      // Close loading dialog
      if (mounted) Navigator.pop(context);

      print('API Response Status: ${response.statusCode}');
      print('API Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Roadmaps generated successfully!"),
              backgroundColor: Color(0xFF6B7FD7),
              behavior: SnackBarBehavior.floating,
            ),
          );

          // Navigate to roadmaps screen
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => RoadmapsScreen(
                roadmaps: data['roadmaps'],
              ),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Error: ${response.body}"),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      // Close loading dialog if still open
      if (mounted) Navigator.pop(context);
      
      print('Error in _submitSurvey: $e');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: $e"),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF6B7FD7);
    const backgroundColor = Color(0xFFF8F9FF);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Header Section
              const SurveyHeader(),

              // Form Content
              Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8),

                      // SECTION 1: CORE PROFILE
                      SurveyWidgets.buildSectionCard(
                        icon: Icons.person_outline_rounded,
                        title: "CORE PROFILE",
                        children: [
                          SurveyWidgets.buildFieldLabel("Age Bracket"),
                          SurveyWidgets.buildDropdown(
                            ["18-25", "26-35", "36-45", "45+"],
                            (v) => setState(() => ageRange = v),
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Location Type"),
                          SurveyWidgets.buildDropdown(
                            ["Urban", "Rural"],
                            (v) => setState(() => locationType = v),
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Academic Qualification"),
                          SurveyWidgets.buildTextField(
                            "e.g. Bachelor of Science",
                            (v) => qualification = v,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Specialization"),
                          SurveyWidgets.buildTextField(
                            "e.g. Computer Science",
                            (v) => fieldOfStudy = v,
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // SECTION 2: EXPERIENCE PORTFOLIO
                      SurveyWidgets.buildSectionCard(
                        icon: Icons.work_outline_rounded,
                        title: "EXPERIENCE PORTFOLIO",
                        children: [
                          SurveyWidgets.buildFieldLabel("Recent Professional Role"),
                          SurveyWidgets.buildTextField(
                            "e.g. Senior Project Manager",
                            (v) => previousRole = v,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Total Years of Experience"),
                          SurveyWidgets.buildTextField(
                            "0",
                            (v) => experienceYears = v,
                            type: TextInputType.number,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Industry Domain"),
                          SurveyWidgets.buildTextField(
                            "e.g. FinTech / Healthcare",
                            (v) => industry = v,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Career Break (Months)"),
                          SurveyWidgets.buildTextField(
                            "0",
                            (v) => breakDuration = v,
                            type: TextInputType.number,
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // SECTION 3: STRATEGIC INTENT
                      SurveyWidgets.buildSectionCard(
                        icon: Icons.flag_outlined,
                        title: "STRATEGIC INTENT",
                        children: [
                          SurveyWidgets.buildFieldLabel("Weekly Availability (Hours)"),
                          SurveyWidgets.buildTextField(
                            "40",
                            (v) => availableHours = v,
                            type: TextInputType.number,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Self-Assessed Confidence"),
                          SurveyWidgets.buildDropdown(
                            ["Low", "Medium", "High"],
                            (v) => setState(() => confidenceLevel = v),
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Technical Proficiency"),
                          SurveyWidgets.buildDropdown(
                            ["Beginner", "Intermediate", "Advanced"],
                            (v) => setState(() => skillLevel = v),
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Target Professional Field"),
                          SurveyWidgets.buildTextField(
                            "e.g. Data Analytics",
                            (v) => desiredField = v,
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Engagement Model"),
                          SurveyWidgets.buildDropdown(
                            ["Remote", "Hybrid", "Onsite"],
                            (v) => setState(() => jobType = v),
                          ),
                          const SizedBox(height: 20),
                          SurveyWidgets.buildFieldLabel("Primary Objective"),
                          SurveyWidgets.buildDropdown(
                            ["Job", "Internship", "Freelance", "Upskill"],
                            (v) => setState(() => goalType = v),
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      // SUBMIT BUTTON - Updated to call _submitSurvey
                      Container(
                        width: double.infinity,
                        height: 58,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6B7FD7), Color(0xFF8B9FE7)],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: primaryColor.withOpacity(0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          onPressed: _submitSurvey, // Call the submit function
                          child: const Text(
                            "GENERATE ANALYSIS",
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.2,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}