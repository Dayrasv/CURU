//pagina que é aberta quando é feito o cadastro do projeto: etapa de Identificacao

import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

export default function StepIdentification({ form, setForm }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Título do Projeto *</Label>
        <Input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Ex: Estudo da qualidade do ar na região escolar"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Problema Investigado</Label>
        <Textarea
          value={form.problem}
          onChange={e => setForm({ ...form, problem: e.target.value })}
          placeholder="Qual problema vocês estão investigando?"
          className="rounded-xl min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Hipótese</Label>
        <Textarea
          value={form.hypothesis}
          onChange={e => setForm({ ...form, hypothesis: e.target.value })}
          placeholder="Qual a hipótese inicial?"
          className="rounded-xl min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Descrição</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Descreva brevemente o projeto..."
          className="rounded-xl min-h-[80px]"
        />
      </div>
    </div>
  );
}