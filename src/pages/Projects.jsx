import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
//import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { PlusCircle, Search, Calendar, School, Leaf } from "lucide-react";
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

export default function Projects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("-created_date"),
  });
  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => base44.entities.Institution.list(),
  });
  const { data: participations = [] } = useQuery({
    queryKey: ["participations"],
    queryFn: () => base44.entities.Participation.list(),
  });

  const instMap = {};
  institutions.forEach(i => { instMap[i.id] = i.name; });

  const studentsByProject = {};
  participations.forEach(p => {
    studentsByProject[p.project_id] = (studentsByProject[p.project_id] || 0) + (p.students_involved || 0);
  });

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projetos cadastrados</p>
        </div>
        <Link to="/projects/new">
          <Button className="gap-2 rounded-xl">
            <PlusCircle className="w-4 h-4" /> Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="planejado">Planejado</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Nenhum projeto encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(project => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="p-5 rounded-2xl border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                      {project.uses_macroproject && (
                        <Leaf className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.problem || project.description || "Sem descrição"}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <School className="w-3.5 h-3.5" />
                        {instMap[project.institution_id] || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.start_date ? format(new Date(project.start_date), "dd/MM/yyyy") : "—"}
                      </span>
                      {studentsByProject[project.id] > 0 && (
                        <span>{studentsByProject[project.id]} estudantes</span>
                      )}
                    </div>
                  </div>
                  <Badge className={statusStyles[project.status] || statusStyles.planejado}>
                    {statusLabels[project.status] || "Planejado"}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}