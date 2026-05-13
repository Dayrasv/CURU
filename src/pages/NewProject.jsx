import React, { useState, useEffect } from "react";
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
import StepDevelopment from "../components/project-wizard/StepDevelopment";

// representacao dos pasos na secao superior da pagina
const STEPS = [
  { label: "Identificação", icon: Lightbulb, description: "Título, problema e objetivo" },
  { label: "Metodologia", icon: BookOpen, description: "Turmas e escolas" },
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

  const { data: Turmas = [] } = useQuery({
  queryKey: ["Turmas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("Turmas")
      .select("*");
    if (error) throw error;
    return data;
  },
});

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      console.log("Esta se executando o mutation?");

      const { participations, ...f } = form;

      const {
          data: { user },
          error: authError,} = await supabase.auth.getUser();

      // if (authError || !user) throw new Error("Usuario no autenticado");
      
      const projectPayload = {
            titulo: f.title,
            problema: f.problem,
            objetivo: f.hypothesis, 
            impacto: f.description, 
            institucao: f.institution_id,
            tecnologia: f.uses_macroproject ? "macroproject" : "standard",
            area_conhecimento: JSON.stringify(f.knowledge_areas),
            Disciplinas: JSON.stringify(f.disciplines),
            data_inicio: f.start_date,
            etapas_projeto: JSON.stringify(f.steps),
  };

   const { data, error } = await supabase
      .from("Projects")
      .insert([projectPayload])
      .select()
      .single();

      console.log("DATA:", data);
      console.log("ERROR:", error);   

        if (error) { throw error; }

    return data;
  },

    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["Projects"] });
      toast.success("Projeto criado com sucesso!");
      //navigate(`/projects/${project.id}`);
    },
   
  });

  // sao os campos obrigatorios que habilitan o botão
  const canProceed = () => {
    //console.log("canProceed step:", step);
    //console.log("institution_id:", form.institution_id);
    
    if (step === 0) return form.title.trim().length > 0;
    if (step === 1) return form.institution_id;
    if (step === 2) return form.start_date;
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
        {step === 1 && <StepPedagogical form={form} setForm={setForm} institutions={institutions} Turmas={Turmas} />}
        {step === 2 && <StepDevelopment form={form} setForm={setForm} />}
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
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!canProceed()}
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
              className="gap-2 rounded-xl"
              onClick={() => {
                console.log("FORM:", form);

                const { participations, ...f } = form;

                const projectPayload = {
                  titulo: f.title,
                  problema: f.problem,
                  objetivo: f.hypothesis, 
                  impacto: f.description, 
                  institucao: f.institution_id,
                  tecnologia: f.uses_macroproject ? "macroproject" : "standard",
                  area_conhecimento: JSON.stringify(f.knowledge_areas),
                  Disciplinas: JSON.stringify(f.disciplines),
                  data_inicio: f.start_date,
                  etapas_projeto: JSON.stringify(f.steps),
                };

                console.log("PAYLOAD:", projectPayload);

                createProjectMutation.mutate();
              }}
              disabled={!canProceed() || createProjectMutation.isPending}
            >

              {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
              <Check className="w-4 h-4" />
            </Button>          
        )}
      </div>
    </div>
  );
}