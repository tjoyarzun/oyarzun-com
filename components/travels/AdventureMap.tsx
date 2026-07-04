"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Adventure {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
  type: string;
  emoji: string;
  description: string;
  imageUrl: string;
}

interface AdventureMapProps {
  adventures: Adventure[];
}

export default function AdventureMap({ adventures }: AdventureMapProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1C1A18]">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {adventures.map((adventure) => (
          <Marker key={adventure.id} position={[adventure.lat, adventure.lng]}>
            <Popup maxWidth={220}>
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                  {adventure.emoji} {adventure.location}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(adventure.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-700 leading-snug">
                  {adventure.description}
                </p>
                <img
                  src={adventure.imageUrl}
                  alt={adventure.name}
                  className="w-full h-20 object-cover rounded mt-1"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
