import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, School, Users, Leaf, Trash2, Paperclip, CheckCircle2, Circle, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
const statusLabels = { planejado: "Planejado", em_andamento: "Em Andamento", concluido: "Concluído" };

export default function ProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = window.location.pathname.split("/projects/")[1];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const list = await base44.entities.Project.list();
      return list.find(p => p.id === projectId);
    },
    enabled: !!projectId,
  });

  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => base44.entities.Institution.list(),
  });

  const { data: participations = [] } = useQuery({
    queryKey: ["participations"],
    queryFn: () => base44.entities.Participation.list(),
  });

  const { data: Turmas = [] } = useQuery({
    queryKey: ["Turmas"],
    queryFn: () => base44.entities.ClassGroup.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
      toast.success("Projeto excluído");
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Projeto não encontrado</p>
      <Link to="/projects"><Button variant="outline" className="mt-4">Voltar</Button></Link>
    </div>
  );

  const instName = institutions.find(i => i.id === project.institution_id)?.name || "—";
  const projParticipations = participations.filter(p => p.project_id === projectId);
  const totalStudents = projParticipations.reduce((s, p) => s + (p.students_involved || 0), 0);
  const steps = project.steps || [];

  const toggleStep = (index) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], completed: !newSteps[index].completed };
    updateMutation.mutate({ id: projectId, data: { steps: newSteps } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/projects">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight truncate">{project.title}</h1>
            {project.uses_macroproject && <Leaf className="w-5 h-5 text-primary shrink-0" />}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><School className="w-3.5 h-3.5" />{instName}</span>
            {project.start_date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(new Date(project.start_date), "dd/MM/yyyy")}</span>}
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{totalStudents} estudantes</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={project.status} onValueChange={(val) => updateMutation.mutate({ id: projectId, data: { status: val } })}>
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planejado">Planejado</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="destructive" size="sm" className="rounded-xl gap-2" onClick={() => {
          if (confirm("Tem certeza que deseja excluir este projeto?")) deleteMutation.mutate(projectId);
        }}>
          <Trash2 className="w-4 h-4" /> Excluir
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/50">
          <CardHeader><CardTitle className="text-base">Identificação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Problema</p>
              <p className="text-sm">{project.problem || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Hipótese</p>
              <p className="text-sm">{project.hypothesis || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Descrição</p>
              <p className="text-sm">{project.description || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50">
          <CardHeader><CardTitle className="text-base">Metodológico</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Áreas do Conhecimento</p>
              <div className="flex flex-wrap gap-1.5">
                {(project.knowledge_areas || []).map((a, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
                ))}
                {(project.knowledge_areas || []).length === 0 && <span className="text-sm text-muted-foreground">—</span>}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Disciplinas</p>
              <div className="flex flex-wrap gap-1.5">
                {(project.disciplines || []).map((d, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                ))}
                {(project.disciplines || []).length === 0 && <span className="text-sm text-muted-foreground">—</span>}
              </div>
            </div>
            {project.uses_macroproject && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Variáveis CURU</p>
                <div className="flex flex-wrap gap-1.5">
                  {(project.macroproject_variables || []).map((v, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary text-xs">{v}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Steps Timeline */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader><CardTitle className="text-base">Etapas do Projeto</CardTitle></CardHeader>
        <CardContent>
          {steps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma etapa cadastrada</p>
          ) : (
            <div className="space-y-3">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className="flex items-start gap-3 p-3 rounded-xl w-full text-left hover:bg-muted/50 transition-colors"
                >
                  {step.completed
                    ? <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    : <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  }
                  <div>
                    <p className={`text-sm font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}>{step.name}</p>
                    {step.description && <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participations */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader><CardTitle className="text-base">Turmas Participantes</CardTitle></CardHeader>
        <CardContent>
          {projParticipations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma turma vinculada</p>
          ) : (
            <div className="space-y-2">
              {projParticipations.map(p => {
                const cls = Turmas.find(c => c.id === p.class_group_id);
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-sm font-medium">{cls?.name || "Turma"}</span>
                    <span className="text-sm text-muted-foreground">{p.students_involved} estudantes</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}