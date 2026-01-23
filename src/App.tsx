import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Components
import Header from "./components/header";
import Footer from "./components/footer";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollTop";
import { SpeechProvider } from './components/SpeechContext';

// Pages
import Home from "./pages/Home";
import Podcast from "./pages/Podcast";
import Pedagogies from "./pages/Resources";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import BAC from "./pages/Bac";
import Activites from "./pages/Activity";
import NewsDetail from "./pages/NewsDetail";

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <SpeechProvider> 
        <Header />

        {/* The TTS "speak" function scans everything inside this <main> tag */}
        <main id="main-content" className="min-h-screen">
          <Routes>          
            <Route path="/" element={<Home />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/resource" element={<Pedagogies />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news&blog" element={<News />} />
            <Route path="/bac" element={<BAC />} />
            <Route path="/activities" element={<Activites />} />
            <Route path="*" element={<Home />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
          </Routes>
        </main>

        <Footer />
        <CookieConsent />
      </SpeechProvider>
    </HashRouter>
  );
};

export default App;