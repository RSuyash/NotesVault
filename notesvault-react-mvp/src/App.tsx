import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation

// Layout Components
import Navbar from './components/layout/Navbar.js';
import Footer from './components/layout/Footer.js';
// import InteractiveBackground from './components/ui/InteractiveBackground'; // Remove global background

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
import DashboardPage from './pages/DashboardPage.js'; // Import Dashboard page
import ProtectedRoute from './components/auth/ProtectedRoute.js'; // Import ProtectedRoute

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
          <Route
            path="/dashboard/*" // Use /* to allow nested routes within the dashboard later
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Add other protected routes later */}
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />} {/* Conditionally render Footer */}
    </>
  );
}

export default App;
