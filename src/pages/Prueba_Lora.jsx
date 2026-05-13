import React, { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import { Thermometer, Droplets, Sun, Battery } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export default function Lora() {

  const [data, setData] = useState({
    valTemp: "--",
    valHumRel: "--",
    valHumSolo: "--",
    valLum: "--",
    valBat: "--",
  });

const saveSensorMutation = useMutation({
  mutationFn: async (data) => {
    const { error } = await supabase
      .from("everynet_dados")
      .insert([data]);

    if (error) throw error;
  },
  onSuccess: () => {
    console.log("Salvado");
  },
  onError: (err) => {
    console.error("Erro", err);
  }
}); 

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Lora
        </h1>
        <p className="text-muted-foreground"> Monitoramento de sensores em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Temperatura"
          value={`${data.valTemp} °C`}
          icon={Thermometer}
          color="chart4"
        />

        <StatCard
          title="Umidade Rel."
          value={`${data.valHumRel} %`}
          icon={Droplets}
          color="chart3"
        />

        <StatCard
          title="Umidade Solo"
          value={`${data.valHumSolo} %`}
          icon={Droplets}
          color="chart5"
        />

        <StatCard
          title="Luminosidade"
          value={`${data.valLum} lx`}
          icon={Sun}
          color="primary"
        />

        <StatCard
          title="Tensão Bat."
          value={`${data.valBat} V`}
          icon={Battery}
          color="chart4"
        />

      </div>
    </div>
  );
}