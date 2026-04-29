import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const statusLabels = {
  planejado: "Planejado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

export default function ProjectsByStatusChart({ projects }) {
  const statusCounts = { planejado: 0, em_andamento: 0, concluido: 0 };
  projects.forEach(p => {
    if (statusCounts[p.status] !== undefined) statusCounts[p.status]++;
  });

  const data = Object.entries(statusCounts).map(([key, value]) => ({
    name: statusLabels[key] || key,
    value,
  }));

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader><CardTitle className="text-base font-semibold">Status dos Projetos</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(174, 62%, 38%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}