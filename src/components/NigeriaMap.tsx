import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Info, Loader2, Search, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types
type Level = 'gold' | 'silver';
interface School { name: string; level: Level; }
interface SchoolData { [key: string]: School[]; }

const SCHOOL_DATA: SchoolData = {
  'Ondo': [{ name: 'Achievers University, Ondo', level: 'silver' }],
  'Kaduna': [{ name: 'Amadu Bello University, Kaduna', level: 'silver' }, { name: 'Kaduna State University', level: 'gold' }],
  'Ebonyi': [{ name: 'Ebonyi State University', level: 'silver' }],
  'Lagos': [{ name: 'Lagos State University', level: 'gold' }, { name: 'The French Language Village', level: 'gold' }],
  'Oyo': [{ name: 'Lead City University, Ibadan', level: 'gold' }, { name: 'University of Ibadan', level: 'silver' }],
  'Kano': [{ name: 'Maryam Abacha American University, Kano', level: 'gold' }],
  'Abia': [{ name: 'Michael Okpara University of Agric, Abia', level: 'gold' }],
  'Anambra': [{ name: 'Nnamdi Azikiwe University, Awka', level: 'gold' }],
  'Osun': [{ name: 'Obafemi Awolowo University, Ile-Ife', level: 'gold' }],
  'Ogun': [{ name: 'Olabisi Onabanjo University, Ogun', level: 'silver' }],
  'Rivers': [{ name: 'Rivers State University', level: 'gold' }, { name: 'University of Port Harcourt', level: 'silver' }],
  'Federal Capital Territory': [{ name: 'University of Abuja', level: 'gold' }],
  'Cross River': [{ name: 'University of Calabar Technology', level: 'silver' }],
  'Kwara': [{ name: 'University of Ilorin, Kwara', level: 'gold' }],
  'Borno': [{ name: 'University of Maiduguri, Borno', level: 'gold' }],
  'Enugu': [{ name: 'University of Nigeria, Enugu', level: 'silver' }],
  'Sokoto': [{ name: 'Usmanu Danfodiyo University, Sokoto', level: 'silver' }]
};

const HIGHLIGHTED_STATES = Object.keys(SCHOOL_DATA);

const MapController = ({ geoData, searchQuery }: { geoData: any, searchQuery: string }) => {
  const map = useMap();

  useEffect(() => {
    if (geoData) {
      const group = L.geoJSON(geoData);
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [geoData, map]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const stateMatch = Object.keys(SCHOOL_DATA).find(state => 
        SCHOOL_DATA[state].some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (stateMatch && geoData) {
        const layers = L.geoJSON(geoData).getLayers();
        const layer = layers.find((l: any) => 
          l.feature.properties.adm1_name === stateMatch
        ) as L.Polyline;
        
        if (layer) {
          map.flyToBounds(layer.getBounds(), { maxZoom: 8 });
        }
      }
    }
  }, [searchQuery, map, geoData]);

  return null;
};

const NigeriaMap: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/nga_admin1.geojson') 
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Map Load Error:", err);
        setIsLoading(false);
      });
  }, []);

  const stateStyle = useCallback((feature: any) => {
    const isHighlighted = HIGHLIGHTED_STATES.includes(feature.properties.adm1_name);
    return {
      fillColor: isHighlighted ? '#4169E1' : '#ffffff',
      weight: 1.2,
      opacity: 1,
      color: '#CBD5E1', 
      fillOpacity: isHighlighted ? 0.7 : 1,
    };
  }, []);

  // FIX: Wrapped in useCallback and used e.target._map to avoid the scope error
  const onEachState = useCallback((feature: any, layer: L.Layer) => {
    const stateName = feature.properties.adm1_name;
    const schools = SCHOOL_DATA[stateName];

    if (schools) {
      const tooltipContent = `
        <div class="p-3 font-sans">
          <div class="text-blue-700 font-bold border-b border-gray-100 pb-2 mb-2 text-sm">${stateName}</div>
          <div class="space-y-2">
            ${schools.map(s => `
              <div class="flex items-start gap-2">
                <span class="w-2 h-2 mt-1 rounded-full shrink-0 ${s.level === 'gold' ? 'bg-amber-500' : 'bg-slate-400'}"></span>
                <span class="text-[11px] leading-tight text-slate-700 font-medium">${s.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      layer.bindTooltip(tooltipContent, { sticky: true, className: 'rounded-xl border-none shadow-2xl bg-white p-0 overflow-hidden' });
    }

    layer.on({
      mouseover: (e) => { 
        e.target.setStyle({ fillOpacity: 0.9, weight: 2, color: '#4169E1' }); 
      },
      mouseout: (e) => { 
        e.target.setStyle(stateStyle(feature)); 
      },
      click: (e) => { 
        // Accessing the map instance directly from the event target
        const mapInstance = e.target._map;
        if (mapInstance) {
          mapInstance.fitBounds(e.target.getBounds());
        }
      }
    });
  }, [stateStyle]);

  if (isLoading) return (
    <div className="h-[500px] w-full flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="mt-3 text-slate-500 text-sm font-medium">Loading Map...</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <div className="flex-1 h-[500px] lg:h-[600px] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner relative group">
        <div className="absolute top-4 left-4 z-[1000] w-64 md:w-80">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search for a university..."
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <MapContainer center={[9.082, 8.675]} zoom={6} className="h-full w-full outline-none">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={stateStyle} 
              onEachFeature={onEachState} 
            />
          )}
          <MapController geoData={geoData} searchQuery={search} />
        </MapContainer>
      </div>

      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <MapPin size={14} className="text-blue-600" /> Map Key
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-white font-bold text-xs italic">G</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Gold Level</p>
                <p className="text-[11px] text-slate-400 italic font-medium leading-none">Primary Partnership</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-2xl bg-slate-400 shadow-lg shadow-slate-400/20 flex items-center justify-center text-white font-bold text-xs italic">S</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Silver Level</p>
                <p className="text-[11px] text-slate-400 italic font-medium leading-none">Associate Partners</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-xs font-medium text-slate-600">Participating States</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full border border-slate-300 bg-white"></div>
                  <span className="text-xs font-medium text-slate-600">Other States</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-xl shadow-blue-600/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <Info size={20} className="mb-3 opacity-80" />
            <h4 className="text-sm font-bold mb-1 italic">Quick Guide</h4>
            <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
              Click on a state to center the view. Hover to reveal the list of institutions supported by the BAC project.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NigeriaMap;