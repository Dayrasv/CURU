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
          onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Estudo da qualidade do ar na região escolar"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Problema Investigado</Label>
        <Textarea
          value={form.problem}
           onChange={e => setForm(prev => ({ ...prev, problem: e.target.value }))}
          placeholder="Qual problema vocês estão investigando?"
          className="rounded-xl min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Objetivo</Label>
        <Textarea
          value={form.hypothesis}
          onChange={e => setForm(prev => ({ ...prev, hypothesis: e.target.value }))}
          placeholder="O que você quer alcançar ao resolver o problema?"
          className="rounded-xl min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Impacto do projeto</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Por que o tema é tão importante?"
          className="rounded-xl min-h-[80px]"
        />
      </div>
    </div>
  );
}