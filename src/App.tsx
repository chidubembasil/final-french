import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./index.css";

import Header from "./components/header";
import Footer from "./components/footer";
import CookieConsent from "./components/CookieConsent";

// ✅ Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Resources = lazy(() => import("./pages/Resources"));
const Gallery = lazy(() => import("./pages/Gallery"));
const News = lazy(() => import("./pages/News"));
const BAC = lazy(() => import("./pages/Bac"));
const Activites = lazy(() => import("./pages/Activity"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />

      {/* ✅ Suspense wraps ONLY the routes */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/resource" element={<Resources />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news&blog" element={<News />} />
          <Route path="/bac" element={<BAC />} />
          <Route path="/activities" element={<Activites />} />
        </Routes>
      </Suspense>

      <Footer />
      <CookieConsent />
    </BrowserRouter>
  );
};

export default App;
