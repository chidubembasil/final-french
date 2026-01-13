import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Header from "./components/header";
import Footer from "./components/footer";
import CookieConsent from "./components/CookieConsent";

// Standard imports
import Home from "./pages/Home";
import Podcast from "./pages/Podcast";
import Pedagogies from "./pages/Resources";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import BAC from "./pages/Bac";
import Activites from "./pages/Activity";

const App: React.FC = () => {
  return (
    // ✅ Switched to HashRouter to prevent "disappearing" pages on live servers
    <HashRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/resource" element={<Pedagogies />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news&blog" element={<News />} />
          <Route path="/bac" element={<BAC />} />
          <Route path="/activities" element={<Activites />} />
          {/* ✅ Catch-all route: if a path doesn't exist, go Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <CookieConsent />
    </HashRouter>
  );
};

export default App;