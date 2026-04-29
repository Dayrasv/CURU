import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
//import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function InstitutionMap({ institutions }) {
  const validInsts = institutions.filter(i => i.latitude && i.longitude);
  const center = validInsts.length > 0
    ? [validInsts[0].latitude, validInsts[0].longitude]
    : [-14.235, -51.925]; // Brazil center

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader><CardTitle className="text-base font-semibold">Mapa da Rede</CardTitle></CardHeader>
      <CardContent className="p-0 overflow-hidden rounded-b-2xl">
        <MapContainer center={center} zoom={validInsts.length > 0 ? 10 : 4} style={{ height: "360px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validInsts.map(inst => (
            <Marker key={inst.id} position={[inst.latitude, inst.longitude]}>
              <Popup>
                <strong>{inst.name}</strong><br />
                {inst.city}, {inst.state}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}