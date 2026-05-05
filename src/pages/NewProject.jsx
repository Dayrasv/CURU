import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { cn } from "../lib/utils";
import { ArrowLeft, ArrowRight, Check, Lightbulb, BookOpen, Database, Rocket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import StepIdentification from "../components/project-wizard/StepIdentification";
import StepPedagogical from "../components/project-wizard/StepPedagogical";
import StepData from "../components/project-wizard/StepData";
import StepDevelopment from "../components/project-wizard/StepDevelopment";

// representacao dos pasos na secao superior da pagina
const STEPS = [
  { label: "Identificação", icon: Lightbulb, description: "Título, problema e hipótese" },
  { label: "Pedagógico", icon: BookOpen, description: "Disciplinas, turmas e alunos" },
  { label: "Dados", icon: Database, description: "Integração com CURU" },
  { label: "Desenvolvimento", icon: Rocket, description: "Etapas e cronograma" },
];

export default function NewProject() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "", description: "", problem: "", hypothesis: "",
    knowledge_areas: [], disciplines: [], institution_id: "",
    status: "planejado", uses_macroproject: false, macroproject_variables: [],
    steps: [], start_date: "", participations: [],
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

  const { data: classGroups = [] } = useQuery({
  queryKey: ["classGroups"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("ClassGroups")
      .select("*");
    if (error) throw error;
    return data;
  },
});

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const { participations, ...projectData } = form;
      const user = await base44.auth.me();
      projectData.teacher_email = user.email;
      const project = await base44.entities.Project.create(projectData);

      // Create participations
      for (const p of participations) {
        if (p.class_group_id && p.students_involved) {
          await base44.entities.Participation.create({
            institution_id: form.institution_id,
            project_id: project.id,
            class_group_id: p.class_group_id,
            students_involved: parseInt(p.students_involved),
          });
        }
      }
      return project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["participations"] });
      toast.success("Projeto criado com sucesso!");
      navigate(`/projects/${project.id}`);
    },
  });

  const canProceed = () => {
    if (step === 0) return form.title.trim().length > 0;
    if (step === 1) return form.institution_id;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Projeto</h1>
        <p className="text-sm text-muted-foreground mt-1">Preencha as informações do projeto de forma guiada</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex flex-col items-center gap-2 group",
                i <= step ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <div className="text-center hidden sm:block">
                <p className={cn("text-xs font-semibold", i <= step ? "text-foreground" : "text-muted-foreground")}>{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.description}</p>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 rounded-full", i < step ? "bg-primary" : "bg-border")} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6 sm:p-8 rounded-2xl border-border/50">
        {step === 0 && <StepIdentification form={form} setForm={setForm} />}
        {step === 1 && <StepPedagogical form={form} setForm={setForm} institutions={institutions} classGroups={classGroups} />}
        {step === 2 && <StepData form={form} setForm={setForm} />}
        {step === 3 && <StepDevelopment form={form} setForm={setForm} />}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={() => step > 0 ? setStep(step - 1) : navigate("/projects")}
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 0 ? "Anterior" : "Cancelar"}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            className="gap-2 rounded-xl"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            className="gap-2 rounded-xl"
            onClick={() => createProjectMutation.mutate()}
            disabled={!canProceed() || createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"} <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}