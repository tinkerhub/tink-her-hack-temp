<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

PROJECT: Postpartum Recovery Risk Analyzer

A React + Vite healthcare app integrated with Supabase for tracking postpartum recovery with:
- Daily health logging (mood, sleep, bleeding, pain, iron intake, support)
- Automatic recovery score calculation (0-100 scale)
- Risk classification and context-aware navigation:
  * High Risk (0-40) → Specialist consultation
  * Moderate Risk (41-70) → Nutritionist guidance
  * Stable (71-100) → Recovery tips
- Trend visualization with Recharts (last 5 days)
- Specialist directory with doctors, nutritionists, psychologists
- Recovery tips for stable users

TECH STACK: React 19.2, Vite 8, Supabase Auth + PostgreSQL, Recharts, React Router 7

KEY FILES:
- src/App.jsx - Routing and session management
- src/components/Dashboard.jsx - Main dashboard with form and score
- src/components/Specialists.jsx - Specialist directory
- src/components/Tips.jsx - Recovery tips
- src/components/HealthForm.jsx - Daily health form
- src/components/GraphSection.jsx - Trend charts

SUPABASE SETUP:
- Table: daily_records (with all required columns)
- RLS enabled with SELECT/INSERT policies for authenticated users
- Email auth enabled without confirmation (auto-confirm on signup)

All RLS policies configured. Users see only their own data.
Specialist directory and recovery tips are demo data—replace with real content.
Alerts guide users to appropriate resources based on recovery level.

Setup complete. Run 'npm run dev' to start development server.
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [x] Ensure Documentation is Complete
