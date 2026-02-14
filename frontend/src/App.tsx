import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Splash from './pages/Splash';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SavedPlans from './pages/SavedPlans';
import "./App.css"

function App() {
  return (
    <Routes>
      {/* Standalone Route for Auth (No Header/Footer) */}
      <Route path="auth" element={<Auth />} />

      <Route path="/" element={<Layout />}>
        {/* Splash screen at root, redirect handled within Splash component */}
        <Route index element={<Splash />} />

        <Route path="landing" element={<Landing />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="saved" element={<SavedPlans />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
