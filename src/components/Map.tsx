import React from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

// GeoJSON interface (simplified for states)
interface GeoProperties {
  name: string;
  [key: string]: any;
}

interface GeoFeature {
  type: string;
  id?: string | number;
  properties: GeoProperties;
  geometry: any;
}

interface GeoData {
  type: string;
  features: GeoFeature[];
}

// Example: URL to GeoJSON for Nigeria states (replace with any country)
const geoUrl = "/nigeria-states.json";

// Example data: state name -> value for heat
const data: Record<string, number> = {
  Lagos: 70,
  Abuja: 50,
  Kano: 30,
  Rivers: 90,
};

const colorScale = scaleQuantize<string>()
  .domain([0, 100])
  .range(["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]);

interface HeatMapProps {
  countryGeoUrl?: string; // optional URL for other countries
  focusState?: string;    // optional state to center on
}

const HeatMap: React.FC<HeatMapProps> = ({ countryGeoUrl, focusState }) => {
  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup
        center={focusState ? [8, 9] : [0, 0]} // adjust coordinates as needed
        zoom={focusState ? 5 : 1}             // adjust zoom for focus
      >
        <Geographies geography={countryGeoUrl || geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name as string;
              const value = data[stateName] || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(value)}
                  stroke="#fff"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#ff9933" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default HeatMap;
