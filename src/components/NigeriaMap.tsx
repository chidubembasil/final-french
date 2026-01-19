import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Info, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types
type Level = 'gold' | 'silver';

interface School {
  name: string;
  level: Level;
}

interface SchoolData {
  [key: string]: School[];
}

// Data constants
const SCHOOL_DATA: SchoolData = {
  'Ondo': [{ name: 'Achievers University, Ondo', level: 'silver' }],
  'Kaduna': [
    { name: 'Amadu Bello University, Kaduna', level: 'silver' },
    { name: 'Kaduna State University', level: 'gold' }
  ],
  'Ebonyi': [{ name: 'Ebonyi State University', level: 'silver' }],
  'Lagos': [
    { name: 'Lagos State University', level: 'gold' },
    { name: 'The French Language Village', level: 'gold' }
  ],
  'Oyo': [
    { name: 'Lead City University, Ibadan', level: 'gold' },
    { name: 'University of Ibadan', level: 'silver' }
  ],
  'Kano': [{ name: 'Maryam Abacha American University, Kano', level: 'gold' }],
  'Abia': [{ name: 'Michael Okpara University of Agric, Abia', level: 'gold' }],
  'Anambra': [{ name: 'Nnamdi Azikiwe University, Awka', level: 'gold' }],
  'Osun': [{ name: 'Obafemi Awolowo University, Ile-Ife', level: 'gold' }],
  'Ogun': [{ name: 'Olabisi Onabanjo University, Ogun', level: 'silver' }],
  'Rivers': [
    { name: 'Rivers State University', level: 'gold' },
    { name: 'University of Port Harcourt', level: 'silver' }
  ],
  'Federal Capital Territory': [{ name: 'University of Abuja', level: 'gold' }],
  'Cross River': [{ name: 'University of Calabar Technology', level: 'silver' }],
  'Kwara': [{ name: 'University of Ilorin, Kwara', level: 'gold' }],
  'Borno': [{ name: 'University of Maiduguri, Borno', level: 'gold' }],
  'Enugu': [{ name: 'University of Nigeria, Enugu', level: 'silver' }],
  'Sokoto': [{ name: 'Usmanu Danfodiyo University, Sokoto', level: 'silver' }]
};

const HIGHLIGHTED_STATES = Object.keys(SCHOOL_DATA);

const NigeriaMap: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure you have the nga_admin1.json in your public folder
    fetch('nga_admin1.geojson')
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Error loading map:", err));
  }, []);

  const onEachState = (feature: any, layer: L.Layer) => {
    const stateName = feature.properties.adm1_name;
    const schools = SCHOOL_DATA[stateName];

    // Tooltip Logic
    if (schools) {
      const tooltipContent = `
        <div class="p-2 min-w-[180px]">
          <div class="font-bold text-blue-600 border-b pb-1 mb-2">${stateName}</div>
          <div class="space-y-2">
            ${schools.map(s => `
              <div class="flex items-start gap-2">
                <div class="w-3 h-3 mt-1 rounded-sm flex-shrink-0 ${s.level === 'gold' ? 'bg-amber-500' : 'bg-gray-400'}"></div>
                <div class="text-xs text-gray-700 leading-tight">${s.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'top',
        className: 'bg-white rounded-lg shadow-xl border-none'
      });
    }

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ weight: 3, color: '#333', fillOpacity: 0.9 });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(stateStyle(feature));
      },
      click: (e) => {
        const map = e.target._map;
        map.fitBounds(e.target.getBounds());
      }
    });
  };

  const stateStyle = (feature: any) => {
    const isHighlighted = HIGHLIGHTED_STATES.includes(feature.properties.adm1_name);
    return {
      fillColor: isHighlighted ? '#4169E1' : '#ffffff',
      weight: 1.5,
      opacity: 1,
      color: '#DC143C',
      fillOpacity: isHighlighted ? 0.8 : 0.9,
    };
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600 font-medium">Loading Map Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="max-w-7xl mx-auto text-xl font-bold text-gray-800 tracking-tight uppercase">
          Nigeria University Map
        </h1>
      </header>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        {/* Map Section */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[500px] lg:h-[700px]">
          <MapContainer
            center={[9.082, 8.675]}
            zoom={6}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {geoData && (
              <GeoJSON 
                data={geoData} 
                style={stateStyle} 
                onEachFeature={onEachState} 
              />
            )}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 space-y-4">
          <section className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-amber-500 border border-amber-600" />
                <span className="text-sm text-gray-600">Gold Level</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gray-400 border border-gray-500" />
                <span className="text-sm text-gray-600">Silver Level</span>
              </div>
              <hr className="my-4 border-gray-100" />
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[#4169E1] border border-blue-800" />
                <span className="text-sm text-gray-600">Highlighted State</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-white border border-gray-300" />
                <span className="text-sm text-gray-600">Other States</span>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-700">
              <Info size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Instructions</h3>
            </div>
            <p className="text-sm text-blue-600/80 leading-relaxed">
              Hover over highlighted states to view university names. Click a state to center and zoom.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NigeriaMap;