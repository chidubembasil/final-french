import { motion } from 'framer-motion';

// Mock imports for the images you provided
// Replace these paths with your actual local assets
import InstitutFrancais from "../assets/img/institut.jpg";
import AllianceFrancaise from "../assets/img/alliance.jpg";
import TedPrime from "../assets/img/images.png";
import UFTAN from "../assets/img/uftan.jpeg";
import UniCaen from "../assets/img/UNICAEN_logo.jpg";
import TV5Monde from "../assets/img/tv5.jpeg";
import FranceEducation from "../assets/img/fef.jpg";
import FrenchBusiness from "../assets/img/image1.png";
import logo2 from '../assets/img/img2026.jpg'

const partners = [
{ name: "France Éducation International", logo: FranceEducation },
  { name: "Institut Français Nigeria", logo: InstitutFrancais },
  { name: "Alliance Française Nigeria", logo: AllianceFrancaise },
  { name: "TedPrime Hub", logo: TedPrime },
  { name: "UFTAN Nigeria", logo: UFTAN },
  { name: "Université Caen Normandie", logo: UniCaen },
  { name: "Maison TV5 Monde Lagos", logo: TV5Monde },
  { name: "Le Français des Affaires", logo: FrenchBusiness },
];

export default function PartnersSection() {
  return (
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Our Strategic <span className="text-red-600">Partners</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            The BAC project is supported by a network of international institutional, 
            academic, and technical leaders committed to Nigerian excellence.
          </p>
        </div>

        {/* Marquee/Grid Container */}
        <div className="relative overflow-hidden group">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80 group-hover:opacity-100 transition-opacity">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="w-full flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 md:max-h-20 w-auto object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Supporting text for ToR compliance */}
        <div className="mt-16 bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shrink-0">
              Project Funders
            </div>
            <img src={logo2} alt="" />
            <p className="text-sm text-blue-900 leading-relaxed">
              This initiative is led by the <strong>Embassy of France in Nigeria</strong> and funded 
              through the <strong>French Embassy Fund (FEF)</strong> of the French Ministry for 
              Europe and Foreign Affairs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}