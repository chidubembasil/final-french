import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. Data mapping from your HTML/README
const schoolData: Record<string, { name: string; level: string }[]> = {
    'Lagos': [{ name: 'Lagos State University', level: 'Gold' }, { name: 'The French Language Village', level: 'Gold' }],
    'Oyo': [{ name: 'Lead City University, Ibadan', level: 'Gold' }, { name: 'University of Ibadan', level: 'Silver' }],
    'Borno': [{ name: 'University of Maiduguri', level: 'Silver' }],
    'Rivers': [{ name: 'University of Port-Harcourt', level: 'Gold' }],
    'Kano': [{ name: 'Bayero University Kano', level: 'Silver' }],
    'Kaduna': [{ name: 'Amadu Bello University, Kaduna', level: 'Silver' }],
    'FCT': [{ name: 'University of Abuja', level: 'Silver' }],
    'Enugu': [{ name: 'University of Nigeria, Nsukka', level: 'Silver' }],
    'Ogun': [{ name: 'Mountain Top University, Ogun', level: 'Silver' }, { name: 'Chrisland University, Abeokuta', level: 'Silver' }, { name: 'Babcock University, Ilishan-Remo', level: 'Silver' }, { name: 'Covenant University, Ota', level: 'Silver' }, { name: 'Olusegun Obasanjo University, Ogun', level: 'Silver' }],
    'Sokoto': [{ name: 'Usmanu Danfodiyo University, Sokoto', level: 'Silver' }],
    'Kwara': [{ name: 'University of Ilorin', level: 'Silver' }],
    'Ondo': [{ name: 'Achievers University, Ondo', level: 'Silver' }],
    'Osun': [{ name: 'Obafemi Awolowo University, Ile-Ife', level: 'Silver' }],
    'Cross River': [{ name: 'University of Calabar Technology', level: 'Silver' }],
    'Ebonyi': [{ name: 'Ebonyi State University', level: 'Silver' }],
    'Anambra': [{ name: 'Nnamdi Azikiwe University, Awka', level: 'Gold' }],
    'Abia': [{ name: 'Michael Okpara University of Agric, Abia', level: 'Gold' }],
};

const highlightedStates = Object.keys(schoolData);

const NigeriaMap = () => {
    const [geojsonData, setGeojsonData] = useState<any>(null);

    useEffect(() => {
        // Fetch from public folder
        fetch('/nga_admin1.geojson')
            .then(res => res.json())
            .then(data => setGeojsonData(data));
    }, []);

    // 2. Mirroring the 'getStyle' function from your HTML
    const getStyle = (feature: any) => {
        const stateName = feature.properties.adm1_name;
        const isHighlighted = highlightedStates.includes(stateName);
        return {
            fillColor: isHighlighted ? '#4169E1' : '#ffffff', // Royal Blue or White
            weight: 2,
            opacity: 1,
            color: '#DC143C', // Red border
            fillOpacity: isHighlighted ? 0.7 : 0.2,
        };
    };

    // 3. Mirroring 'onEachFeature' (Tooltips & Hover)
    const onEachFeature = (feature: any, layer: L.Layer) => {
        const stateName = feature.properties.adm1_name;
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
                const target = e.target;
                target.setStyle({ fillOpacity: 0.9, weight: 3, color: '#333' });
            },
            mouseout: (e) => {
                const target = e.target;
                target.setStyle(getStyle(feature));
            },
            click: (e) => {
                const map = e.target._map;
                map.fitBounds(e.target.getBounds());
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
                    attribution='&copy; OpenStreetMap contributors'
                />
                <GeoJSON 
                    data={geojsonData} 
                    style={getStyle} 
                    onEachFeature={onEachFeature} 
                />
            </MapContainer>
        </div>
    );
};

export default NigeriaMap;