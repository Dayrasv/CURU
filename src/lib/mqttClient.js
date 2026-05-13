import mqtt from "mqtt";
import { supabase } from "./supabase";

const client = mqtt.connect(
  "wss://1a6982c79cdb413eb6b5f25d3d24b0d8.s1.eu.hivemq.cloud:8884/mqtt",
  {
    username: "DayraSV",
    password: "Dayra.94",
  }
);

client.on("connect", () => {
  console.log("MQTT conectado global");
  client.subscribe("data");
});

client.on("message", async (topic, message) => {
  try {
    const msg = JSON.parse(message.toString());

    if (msg.type !== "uplink") return;

    const payload = msg?.params?.payload;
    if (!payload) return;

    const decoded = atob(payload);
    const partes = decoded.split(";");

    let datos = {};
    partes.forEach((p) => {
      const [key, value] = p.split(":");
      datos[key] = parseFloat(value);
    });

    const timestamp = msg.meta?.time;
    if (!timestamp) return;

    const fecha = new Date(timestamp * 1000);

    // 🔥 GUARDA SIEMPRE EN SUPABASE
    await supabase.from("everynet_dados").insert([
      {
        temperatura: datos.T ?? null,
        umidade_ar: datos.U ?? null,
        umidade_solo: datos.S ?? null,
        luminosidade: datos.L ?? null,
        tensao: datos.B ?? null,
        data_calendario: fecha.toLocaleDateString("pt-BR"),
        hora: fecha.toLocaleTimeString(),
      },
    ]);
  } catch (err) {
    console.error("MQTT error:", err);
  }
});

export default client;