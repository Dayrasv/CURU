import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const COLORS = [
  "hsl(174, 62%, 38%)", "hsl(38, 92%, 55%)", "hsl(215, 70%, 55%)", 
  "hsl(340, 65%, 55%)", "hsl(150, 50%, 45%)", "hsl(270, 50%, 55%)"
];

export default function ProjectsByAreaChart({ projects }) {
  const areaCounts = {};
  projects.forEach(p => {
    (p.knowledge_areas || []).forEach(area => {
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
  });

  const data = Object.entries(areaCounts).map(([name, value]) => ({ name, value }));
  
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardHeader><CardTitle className="text-base font-semibold">Projetos por Área</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          Nenhum projeto cadastrado
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader><CardTitle className="text-base font-semibold">Projetos por Área BNCC</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}