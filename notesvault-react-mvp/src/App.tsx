// Minor change again to trigger push
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
// import InteractiveBackground from './components/ui/InteractiveBackground'; // Remove global background
import DashboardLayout from './components/layout/DashboardLayout.js';

// Page Components
import HomePage from './pages/HomePage.js';
import FeaturesPage from './pages/FeaturesPage.js';
import LoginPage from './pages/LoginPage.js'; // Import new page
import SignupPage from './pages/SignupPage.js'; // Import new page
import AboutPage from './pages/AboutPage.js'; // Import new page
import ContactPage from './pages/ContactPage.js';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.js';
import CopyrightPolicyPage from './pages/CopyrightPolicyPage.js'; // Import new page
import TermsOfServicePage from './pages/TermsOfServicePage.js'; // Import new page
import PricingPage from './pages/PricingPage.js'; // Import new page
import BlogPage from './pages/BlogPage.js'; // Import new page
import DashboardPage from './pages/DashboardPage.tsx'; // Correcting import extension
import ProtectedRoute from './components/auth/ProtectedRoute.js'; // Import ProtectedRoute
import ProfilePage from './pages/ProfilePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import NotesPage from './pages/NotesPage.tsx';
import DocsPage from './pages/DocsPage.tsx';
import StudyGroupsPage from './pages/StudyGroupsPage.tsx';
import FlashcardsPage from './pages/FlashcardsPage.tsx';
import LeaderboardPage from './pages/LeaderboardPage.tsx';
import MindHackDocsPage from './pages/MindHackDocsPage.tsx';
import StudyBoardPage from './pages/StudyBoardPage';

function App() {
  const location = useLocation(); // Get current location
  const isDashboardRoute = location.pathname.startsWith('/dashboard'); // Check if it's a dashboard route

  return (
    // Use a fragment or a div that doesn't interfere with body styles
    <>
      {/* <InteractiveBackground /> */} {/* Remove global background component */}
      {!isDashboardRoute && <Navbar />} {/* Conditionally render Navbar */}
      <main> {/* Keep main for semantic structure */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/copyright" element={<CopyrightPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Define Dashboard Layout Route */}
          <Route
            path="/dashboard" // Base path for dashboard layout
            element={
              <ProtectedRoute>
                <DashboardLayout /> {/* Render the layout */}
              </ProtectedRoute>
            }
          >
            {/* Nested Dashboard Routes - Rendered via Outlet in DashboardLayout */}
            <Route index element={<DashboardPage />} /> {/* Default dashboard page at /dashboard */}
            <Route path="profile" element={<ProfilePage />} /> {/* Profile page at /dashboard/profile */}
            <Route path="notes" element={<NotesPage />} />
            <Route path="studygroups" element={<StudyGroupsPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="mindhackdocs" element={<MindHackDocsPage />} />
            {/* Re-nest StudyBoardPage under /dashboard */}
            <Route path="studyboard" element={<StudyBoardPage />} />
          </Route>
          {/* Add other top-level protected routes lsater if needed */}
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />} {/* Conditionally render Footer */}
    </>
  );
}

export default App;

