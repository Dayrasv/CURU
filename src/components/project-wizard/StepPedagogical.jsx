//pagina que é aberta quando é feito o cadastro do projeto: etapa de Pedagogico

import React from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X, Plus } from "lucide-react";

const KNOWLEDGE_AREAS = [
  "Linguagens", "Matemática", "Ciências da Natureza",
  "Ciências Humanas", "Ensino Religioso",
];

const DISCIPLINES = [
  "Português", "Matemática", "Ciências", "História", "Geografia",
  "Inglês", "Educação Física", "Artes", "Biologia", "Física",
  "Química", "Sociologia", "Filosofia",
];

export default function StepPedagogical({ form, setForm, institutions, classGroups }) {
  const toggleItem = (field, item) => {
    const arr = form[field] || [];
    setForm({
      ...form,
      [field]: arr.includes(item) ? arr.filter(a => a !== item) : [...arr, item],
    });
  };

  const addParticipation = () => {
    setForm({
      ...form,
      participations: [...(form.participations || []), { class_group_id: "", students_involved: "" }],
    });
  };

  const updateParticipation = (index, field, value) => {
    const parts = [...(form.participations || [])];
    parts[index] = { ...parts[index], [field]: value };
    setForm({ ...form, participations: parts });
  };

  const removeParticipation = (index) => {
    setForm({ ...form, participations: (form.participations || []).filter((_, i) => i !== index) });
  };

  const instClasses = classGroups.filter(c => c.institution_id === form.institution_id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Instituição *</Label>
        <Select value={form.institution_id} onValueChange={v => setForm({ ...form, institution_id: v })}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione a instituição" /></SelectTrigger>
          <SelectContent>
            {institutions.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Áreas do Conhecimento BNCC</Label>
        <div className="flex flex-wrap gap-2">
          {KNOWLEDGE_AREAS.map(area => (
            <Badge
              key={area}
              variant={(form.knowledge_areas || []).includes(area) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleItem("knowledge_areas", area)}
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Disciplinas Envolvidas</Label>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map(d => (
            <Badge
              key={d}
              variant={(form.disciplines || []).includes(d) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleItem("disciplines", d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Turmas e Nº de Estudantes</Label>
          <Button type="button" variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={addParticipation}>
            <Plus className="w-3.5 h-3.5" /> Adicionar Turma
          </Button>
        </div>
        {(form.participations || []).map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Select value={p.class_group_id} onValueChange={v => updateParticipation(i, "class_group_id", v)}>
              <SelectTrigger className="flex-1 rounded-xl"><SelectValue placeholder="Turma" /></SelectTrigger>
              <SelectContent>
                {instClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                {instClasses.length === 0 && <SelectItem value="none" disabled>Cadastre turmas primeiro</SelectItem>}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Nº alunos"
              value={p.students_involved}
              onChange={e => updateParticipation(i, "students_involved", e.target.value)}
              className="w-28 rounded-xl"
            />
            <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeParticipation(i)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}