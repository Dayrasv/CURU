//pagina que é aberta quando é feito o cadastro do projeto: etapa de Desenvolvimento

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Plus, X, Calendar as CalendarIcon, GripVertical } from "lucide-react";
import { format } from "date-fns";

export default function StepDevelopment({ form, setForm }) {
  const addStep = () => {
    setForm(prev => ({
    ...prev,
      steps: [...(form.steps || []), { name: "", description: "", completed: false }],
    }));
  };

  const [files, setFiles] = useState([]);

  const updateStep = (index, field, value) => {
    setForm(prev => {
      const steps = [...(prev.steps || [])];
      steps[index] = { ...steps[index], [field]: value };
      setForm({ ...prev, steps });
    });
  };

  const removeStep = (index) => {
     setForm(prev => ({
    ...prev, steps: (form.steps || []).filter((_, i) => i !== index) }));
  };

  //adicionar arquivos
  const handleFiles = (e) => {
  const selectedFiles = Array.from(e.target.files);

  const mapped = selectedFiles.map(file => ({
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    url: URL.createObjectURL(file),
  }));

  setFiles(prev => [...prev, ...mapped]);
};

// remover arquivos
const removeFile = (id) => {
  setFiles(prev => prev.filter(f => f.id !== id));
};

  return (
  <div className="space-y-6">

    {/* FECHAS */}
    <div className="space-y-2">

      <div className="grid grid-cols-2 gap-4">

        {/* DATA INÍCIO */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Data de Início *</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start rounded-xl font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.start_date
                  ? format(new Date(form.start_date), "dd/MM/yyyy")
                  : "Selecione a data"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.start_date ? new Date(form.start_date) : undefined}
                onSelect={(date) =>
                  setForm({
                    ...form,
                    start_date: date ? date.toISOString().split("T")[0] : ""
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* DATA FINAL */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Data prevista de finalização
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start rounded-xl font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.end_date
                  ? format(new Date(form.end_date), "dd/MM/yyyy")
                  : "Selecione a data"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.end_date ? new Date(form.end_date) : undefined}
                onSelect={(date) =>
                  setForm(prev => ({
                    ...prev,
                    end_date: date ? date.toISOString().split("T")[0] : ""
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>
    </div>

    {/* ETAPAS */}
    <div className="space-y-3">
        <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Etapas do Projeto</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl"
          onClick={addStep}
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar Etapa
        </Button>
      </div>

      <div className="space-y-3">
        {(form.steps || []).map((step, i) => (
          <div
            key={i}
            className="flex gap-2 items-start p-3 rounded-xl border border-border bg-muted/20"
          >
            <span className="text-xs font-bold text-muted-foreground mt-2.5 w-5 shrink-0">
              {i + 1}
            </span>

            <div className="flex-1 space-y-2">
              <Input value={step.name}
                onChange={e => updateStep(i, "name", e.target.value)}
                placeholder="Nome da etapa"
                className="rounded-xl"
              />

              <Textarea value={step.description}
                onChange={e => updateStep(i, "description", e.target.value)}
                placeholder="Descrição (opcional)"
                className="rounded-xl min-h-[60px]"
              />
            </div>

            <Button
              type="button" variant="ghost" size="icon" className="shrink-0 mt-1"
              onClick={() => removeStep(i)}
            >
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

    <div className="space-y-2">
      <Label className="text-sm font-semibold"> Arquivos anexos</Label>

        <div>
           {/* INPUT */}
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            
          <Button
              type="button"
              variant="outline"
              className="w-auto px-3 py-1.5 text-sm justify-start gap-2 rounded-lg border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
              onClick={() => document.getElementById("fileInput").click()} >
              Escolher arquivos...
          </Button>    
       </div> 
      
      {/* LISTA DE ARCHIVOS */}
      <div className="space-y-2">
        {files.length === 0 && (
          <p className="text-sm text-muted-foreground"> Nenhum arquivo anexado </p>
        )}

        {files.map((f) => (
          <div key={f.id}
            className="flex items-center justify-between p-2 border rounded-xl bg-muted/30" >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{f.name}</span>
              <span className="text-xs text-muted-foreground">
                {(f.size / 1024).toFixed(1)} KB
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFile(f.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>  
);
}