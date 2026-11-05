import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { PageLayout } from './components/layout/PageLayout';
import { VercelTelemetry } from './components/common/VercelTelemetry';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Collections from './pages/Collections';
import CollectionDetails from './pages/CollectionDetails';
import Locations from './pages/Locations';
import About from './pages/About';
import Contact from './pages/Contact';
import SavedProperties from './pages/SavedProperties';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <PageLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetails />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetails />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/saved" element={<SavedProperties />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <VercelTelemetry />
    </PageLayout>
  );
}
