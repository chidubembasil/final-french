import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Footer from "./components/footer"
import Header from "./components/header";
import Podcast from "./pages/Podcast";
import Resources from "./pages/Resources";
import Gallery from "./pages/Gallery";
import CookieConsent from "./components/CookieConsent"


function App() {

  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/resource" element={<Resources />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        <Footer />
        <CookieConsent/>
      </BrowserRouter>
    </>
  )
}

export default App
