import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

const statusStyles = {
  planejado: "bg-muted text-muted-foreground",
  em_andamento: "bg-accent/20 text-accent-foreground border border-accent/30",
  concluido: "bg-primary/15 text-primary",
};

const statusLabels = {
  planejado: "Planejado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

export default function RecentProjects({ projects, institutions }) {
  const instMap = {};
  institutions.forEach(i => { instMap[i.id] = i.name; });

  const recent = [...projects].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Projetos Recentes</CardTitle>
        <Link to="/projects" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum projeto cadastrado ainda</p>
        )}
        {recent.map(p => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {instMap[p.institution_id] || "—"} · {p.created_date ? format(new Date(p.created_date), "dd/MM/yyyy") : "—"}
              </p>
            </div>
            <Badge className={statusStyles[p.status] || statusStyles.planejado}>
              {statusLabels[p.status] || "Planejado"}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}