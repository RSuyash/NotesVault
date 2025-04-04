import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// import InteractiveBackground from './components/ui/InteractiveBackground'; // Remove global background

// Page Components
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage'; // Import new page
import SignupPage from './pages/SignupPage'; // Import new page
import AboutPage from './pages/AboutPage'; // Import new page
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CopyrightPolicyPage from './pages/CopyrightPolicyPage'; // Import new page
import TermsOfServicePage from './pages/TermsOfServicePage'; // Import new page

function App() {
  return (
    // Use a fragment or a div that doesn't interfere with body styles
    <>
      {/* <InteractiveBackground /> */} {/* Remove global background component */}
      <Navbar />
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
          {/* Add routes for Dashboard etc. later */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
