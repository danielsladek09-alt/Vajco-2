"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { farm } from "@/config/site";

const eggIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:30px;line-height:1;filter:drop-shadow(0 3px 4px rgba(20,20,15,0.35))">🥚</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -28],
});

/**
 * Mapa polohy farmy. Používá OpenStreetMap dlaždice (Leaflet) — funguje
 * bez jakéhokoliv API klíče. Pokud bychom v budoucnu chtěli přejít na
 * placenou mapovou službu (Mapbox/Google), API klíč by se doplnil do
 * .env.example a nastavil se tady, zbytek appky by se měnit nemusel.
 */
export function FarmMap() {
  return (
    <MapContainer
      center={[farm.lat, farm.lng]}
      zoom={farm.zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> přispěvatelé'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[farm.lat, farm.lng]} icon={eggIcon}>
        <Popup>
          <strong>VAJCO farma</strong>
          <br />
          {farm.village}, {farm.region}
          <br />
          {farm.landmark}
          {farm.isApproximate && (
            <>
              <br />
              <em>přibližná poloha</em>
            </>
          )}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
