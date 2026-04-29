import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Calendar as CalendarIcon, GripVertical } from "lucide-react";
import { format } from "date-fns";

export default function StepDevelopment({ form, setForm }) {
  const addStep = () => {
    setForm({
      ...form,
      steps: [...(form.steps || []), { name: "", description: "", completed: false }],
    });
  };

  const updateStep = (index, field, value) => {
    const steps = [...(form.steps || [])];
    steps[index] = { ...steps[index], [field]: value };
    setForm({ ...form, steps });
  };

  const removeStep = (index) => {
    setForm({ ...form, steps: (form.steps || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Data de Início</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start rounded-xl font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.start_date ? format(new Date(form.start_date), "dd/MM/yyyy") : "Selecione a data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.start_date ? new Date(form.start_date) : undefined}
              onSelect={(date) => setForm({ ...form, start_date: date ? date.toISOString().split("T")[0] : "" })}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Etapas do Projeto</Label>
          <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={addStep}>
            <Plus className="w-3.5 h-3.5" /> Adicionar Etapa
          </Button>
        </div>
        <div className="space-y-3">
          {(form.steps || []).map((step, i) => (
            <div key={i} className="flex gap-2 items-start p-3 rounded-xl border border-border bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground mt-2.5 w-5 shrink-0">{i + 1}</span>
              <div className="flex-1 space-y-2">
                <Input
                  value={step.name}
                  onChange={e => updateStep(i, "name", e.target.value)}
                  placeholder="Nome da etapa"
                  className="rounded-xl"
                />
                <Textarea
                  value={step.description}
                  onChange={e => updateStep(i, "description", e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="rounded-xl min-h-[60px]"
                />
              </div>
              <Button type="button" variant="ghost" size="icon" className="shrink-0 mt-1" onClick={() => removeStep(i)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(form.steps || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Adicione etapas para organizar o desenvolvimento do projeto
            </p>
          )}
        </div>
      </div>
    </div>
  );
}