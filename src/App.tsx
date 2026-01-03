import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Header from "./components/header";
import Footer from "./components/footer";
import CookieConsent from "./components/CookieConsent";

// ✅ Standard imports (No more lazy loading)
import Home from "./pages/Home";
import Podcast from "./pages/Podcast";
import Resources from "./pages/Resources";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import BAC from "./pages/Bac";
import Activites from "./pages/Activity";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />

      {/* Suspense is no longer needed for routes since we aren't lazy loading */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/resource" element={<Resources />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news&blog" element={<News />} />
        <Route path="/bac" element={<BAC />} />
        <Route path="/activities" element={<Activites />} />
      </Routes>

      <Footer />
      <CookieConsent />
    </BrowserRouter>
  );
};

export default App;