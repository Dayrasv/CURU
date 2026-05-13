// arquivo relacionado com as configuracoes da aba Projectos

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { PlusCircle, Search, Calendar, School, Leaf } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../lib/supabase";
import { Trash2 } from "lucide-react";

const statusStyles = {
  em_andamento: "bg-accent/20 text-accent-foreground border border-accent/30",
  concluido: "bg-primary/15 text-primary",
};

const statusLabels = {
  em_andamento: "Em Andamento",
  concluido: "Concluído",
};

export default function Projects() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["Projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Projects")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Escolas")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const { data: participations = [] } = useQuery({
    queryKey: ["participations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Participations")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const instMap = {};
  institutions.forEach(i => {
    instMap[i.id] = i.name;
  });

  const studentsByProject = {};
  participations.forEach(p => {
    studentsByProject[p.project_id] =
      (studentsByProject[p.project_id] || 0) + (p.students_involved || 0);
  });

  const filtered = projects.filter(p => {
    const matchSearch = p.titulo?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from("Projects")
        .update({ estado: status })
        .eq("id", id);

      if (error) throw error;

      return{ id, status};
    },
    onSuccess: ({ id, status }) => {
    queryClient.setQueryData(["Projects"], (old) => {
      if (!old) return old;

      return old.map((project) =>
        project.id === id
          ? { ...project, estado:status }
          : project
      );    
    });
   },
  });

  // botao de apagar o projeto
  const deleteProjectMutation = useMutation({
  mutationFn: async (id) => {
    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["Projects"] });
  },
});

  const handleDelete = (id) => {
  deleteProjectMutation.mutate(id);
  };

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projetos cadastrados
          </p>
        </div>

        <Link to="/projects/new">
          <Button className="gap-2 rounded-xl">
            <PlusCircle className="w-4 h-4" />
            Novo Projeto
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

          {filtered.map(project => {

            const status = project.status || "em_andamento";

            return (
              <div key={project.id}>
                  <Card className="p-5 rounded-2xl border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{project.titulo}</h3>
                          {project.uses_macroproject && (
                            <Leaf className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.problem || project.impacto || "Sem descrição"}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5" />
                            {instMap[project.institucao] || "—"}
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {project.data_inicio ? format(new Date(project.data_inicio), "dd/MM/yyyy") : "—"}
                          </span>

                          {studentsByProject[project.id] > 0 && (
                            <span>{studentsByProject[project.id]} estudantes</span>
                          )}
                        </div>
                      </div>

                      {/*<Badge className={statusStyles[project.status]}>
                        {statusLabels[project.status]}
                      </Badge>*/}

                      <Select
                        value={project.estado}
                        onValueChange={(value) => handleStatusChange(project.id, value)}
                      >
                        <SelectTrigger className="w-30 mt-2 border-gray-200 shadow-sm focus:ring-0 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="em_andamento">Em andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                      </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project.id)}
                          className="text-black-500 hover:black-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </Card>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}