import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

// Define the structure of your GeoJSON properties to avoid "any"
interface NigeriaStateProperties {
    adm1_name: string;
    [key: string]: unknown;
}

// 1. Data mapping from your HTML/README
const schoolData: Record<string, { name: string; level: string }[]> = {
    'Abia': [
        { name: 'Michael Okpara University of Agriculture, Umudike', level: 'Gold' }
    ],
    'Anambra': [
        { name: 'Nnamdi Azikiwe University, Awka', level: 'Gold' }
    ],
    'Borno': [
        { name: 'University of Maiduguri', level: 'Gold' }
    ],
    'Cross River': [
        { name: 'University of Calabar', level: 'Silver' }
    ],
    'Ebonyi': [
        { name: 'Ebonyi State University', level: 'Silver' }
    ],
    'Enugu': [
        { name: 'University of Nigeria, Nsukka', level: 'Silver' }
    ],
    'FCT': [
        { name: 'University of Abuja', level: 'Gold' }
    ],
    'Kaduna': [
        { name: 'Kaduna State University', level: 'Gold' },
        { name: 'Ahmadu Bello University, Zaria', level: 'Silver' }
    ],
    'Kano': [
        { name: 'Maryam Abacha American University', level: 'Gold' }
    ],
    'Kwara': [
        { name: 'University of Ilorin', level: 'Gold' }
    ],
    'Lagos': [
        { name: 'Lagos State University', level: 'Gold' },
        { name: 'University of Lagos', level: 'Silver' }
    ],
    'Ogun': [
        { name: 'Olabisi Onabanjo University', level: 'Silver' }
    ],
    'Ondo': [
        { name: 'Achievers University, Owo', level: 'Silver' }
    ],
    'Osun': [
        { name: 'Obafemi Awolowo University, Ile-Ife', level: 'Gold' }
    ],
    'Oyo': [
        { name: 'Lead City University, Ibadan', level: 'Gold' },
        { name: 'University of Ibadan', level: 'Silver' }
    ],
    'Rivers': [
        { name: 'Rivers State University, Port Harcourt', level: 'Gold' },
        { name: 'University of Port Harcourt', level: 'Silver' }
    ],
    'Sokoto': [
        { name: 'Usmanu Danfodiyo University, Sokoto', level: 'Silver' }
    ]
};

const highlightedStates = Object.keys(schoolData);

const NigeriaMap = () => {
    const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        fetch('/nga_admin1.geojson')
            .then(res => res.json())
            .then(data => setGeojsonData(data));
    }, []);

    const getStyle = (feature: Feature<Geometry, NigeriaStateProperties> | undefined): L.PathOptions => {
        const stateName = feature?.properties?.adm1_name || "";
        const isHighlighted = highlightedStates.includes(stateName);
        return {
            fillColor: isHighlighted ? '#4169E1' : '#ffffff',
            weight: 2,
            opacity: 1,
            color: '#DC143C',
            fillOpacity: isHighlighted ? 0.7 : 0.2,
        };
    };

    const onEachFeature = (feature: Feature<Geometry, NigeriaStateProperties>, layer: L.Layer) => {
        const stateName = feature.properties?.adm1_name || "";
        const schools = schoolData[stateName] || [];

        if (schools.length > 0) {
            const listItems = schools.map(s => `<li>${s.name} <strong>(${s.level})</strong></li>`).join('');
            layer.bindTooltip(
                `<div style="font-family: sans-serif;">
                    <b style="font-size: 14px;">${stateName}</b>
                    <ul style="margin-top: 5px; padding-left: 15px; font-size: 12px;">${listItems}</ul>
                </div>`, 
                { sticky: true }
            );
        }

        layer.on({
            mouseover: (e) => {
                const target = e.target as L.Path;
                target.setStyle({ fillOpacity: 0.9, weight: 3, color: '#333' });
            },
            mouseout: (e) => {
                const target = e.target as L.Path;
                target.setStyle(getStyle(feature));
            },
            click: (e) => {
                // ✅ FIXED: Cast to L.Polyline (which has getBounds) instead of just L.Path
                const target = e.target as L.Polyline & { _map: L.Map };
                const map = target._map;
                
                if (target.getBounds && typeof target.getBounds === 'function') {
                    map.fitBounds(target.getBounds());
                }
            }
        });
    };

    if (!geojsonData) return <div className="p-10 text-center font-bold">Loading Map Data...</div>;

    return (
        <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden">
            <MapContainer 
                center={[9.082, 8.675]} 
                zoom={6} 
                className="h-full w-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON 
                    data={geojsonData} 
                    // ✅ FIXED: Used explicit Leaflet types instead of 'any'
                    style={getStyle as L.StyleFunction<NigeriaStateProperties>} 
                    onEachFeature={onEachFeature as (feature: Feature<Geometry, NigeriaStateProperties>, layer: L.Layer) => void} 
                />
            </MapContainer>
        </div>
    );
};

export default NigeriaMap;