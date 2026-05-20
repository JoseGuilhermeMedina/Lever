import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { FloatingShapes } from './components/ui/FloatingShapes';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { CategoryProvider } from './hooks/useCategoryFilter';
import { usePageTransition } from './hooks/usePageTransition';
import { Toaster } from './components/ui/toaster';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

function AppContent() {
  usePageTransition();
  
  return (
    <div className="flex flex-col min-h-screen relative">
      <FloatingShapes />
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <CategoryProvider>
      <Router>
        <SmoothScroll />
        <AppContent />
      </Router>
    </CategoryProvider>
  );
}

export default App;
