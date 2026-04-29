import React, { useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import { Thermometer, Droplets, Sun, Battery } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import "leaflet/dist/leaflet.css";
export default function Curu() {

  const data = {
    "Instituto Nova Geração": {
      valTemp: 25,
      valHumRel: 60,
      valHumSolo: 40,
      valLum: 300,
      valBat: 3.7,
    },
    "Centro Educacional Vila Verde": {
      valTemp: 27,
      valHumRel: 55,
      valHumSolo: 35,
      valLum: 280,
      valBat: 3.6,
    },
    "Colégio Integração Paulista": {
      valTemp: 24,
      valHumRel: 65,
      valHumSolo: 45,
      valLum: 320,
      valBat: 3.8,
    },
    "Escola Parque das Ciencias": {
      valTemp: 26,
      valHumRel: 58,
      valHumSolo: 38,
      valLum: 290,
      valBat: 3.7,
    },
    "Colégio Futuro Paulista": {
      valTemp: 28,
      valHumRel: 52,
      valHumSolo: 33,
      valLum: 310,
      valBat: 3.5,
    },
    "Escola Horizonte do Saber": {
      valTemp: 23,
      valHumRel: 68,
      valHumSolo: 50,
      valLum: 330,
      valBat: 3.9,
    },
  };

  const locations = {
  "Instituto Nova Geração": [-23.5505, -46.6333],
  "Centro Educacional Vila Verde": [-23.5520, -46.6300],
  "Colégio Integração Paulista": [-23.5480, -46.6350],
  "Escola Parque das Ciencias": [-23.5510, -46.6400],
  "Colégio Futuro Paulista": [-23.5530, -46.6280],
  "Escola Horizonte do Saber": [-23.5470, -46.6360],
};

  const [selectedSchool, setSelectedSchool] = useState("Instituto Nova Geração");

  const current = data[selectedSchool];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          CURU
        </h1>
        <p className="text-muted-foreground">
          Monitoramento de sensores em tempo real
        </p>
      </div>

      {/* lista desplegable de escuelas y la fecha*/}
      <div className="flex gap-4 items-end">

        {/* ESCUELA */}
        <div>
            <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="p-2 border rounded-lg bg-white"
            >
            {Object.keys(data).map((school) => (
                <option key={school}>{school}</option>
            ))}
            </select>
        </div>

        {/* FECHA */}
        <div>
            <input
            type="date"
            className="p-2 border rounded-lg bg-white"
            />
        </div>

</div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Temperatura"
          value={`${current.valTemp} °C`}
          icon={Thermometer}
          color="chart4"
        />

        <StatCard
          title="Umidade Rel."
          value={`${current.valHumRel} %`}
          icon={Droplets}
          color="chart3"
        />

        <StatCard
          title="Umidade Solo"
          value={`${current.valHumSolo} %`}
          icon={Droplets}
          color="chart5"
        />

        <StatCard
          title="Luminosidade"
          value={`${current.valLum} lx`}
          icon={Sun}
          color="primary"
        />

        <StatCard
          title="Tensão Bat."
          value={`${current.valBat} V`}
          icon={Battery}
          color="chart4"
        />

      </div>

      {/* Mapar de la ubicacion de cada CURU*/}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <h2 className="text-lg font-semibold mb-4"> Localização das escolas </h2>

            <div className="h-[400px] rounded-lg overflow-hidden">

                <MapContainer
                center={[-23.5505, -46.6333]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {Object.entries(locations).map(([school, coords]) => (
                    <Marker key={school} position={coords}>
                    <Popup>
                        <strong>{school}</strong>
                        <br />
                        Temperatura: {data[school].valTemp}°C
                    </Popup>
                    </Marker>
                ))}

    </MapContainer>

            </div>
    </div>

      {/* Tabla con resumen de las variables de las escuelas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <h2 className="text-lg font-semibold mb-4">
          Resumo geral
        </h2>

        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2">Escuela</th>
              <th>Temperatura</th>
              <th>Umidade Relativa</th>
              <th>Umidade Solo</th>
              <th>Luminosidade</th>
              <th>Tensão</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(data).map(([school, values]) => (
              <tr key={school} className="border-t">
                <td className="py-2">{school}</td>
                <td>{values.valTemp}°C</td>
                <td>{values.valHumRel}%</td>
                <td>{values.valHumSolo}%</td>
                <td>{values.valLum} lx</td>
                <td>{values.valBat} V</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

        {/* Historico de evento */}
        <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Histórico</h2>
            <div className="h-[200px] flex items-center justify-center text-gray-400">
                (Aquí irá una gráfica)
            </div>
        </div>
    </div>
  );
}
