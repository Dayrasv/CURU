//pagina que é aberta quando é feito o cadastro do projeto: etapa de Pedagogico

import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";

import { Switch } from "../ui/switch";
import { Leaf } from "lucide-react";

// quadros para as areas
const KNOWLEDGE_AREAS = [
  "Linguagens", "Matemática", "Ciências da Natureza",
  "Ciências Humanas", "Ensino Religioso",
];

// quadros para as disciplinas
const DISCIPLINES = [
  "Português", "Matemática", "Ciências", "História", "Geografia",
  "Inglês", "Educação Física", "Artes", "Biologia", "Física",
  "Química", "Sociologia", "Filosofia",
];

// quadros para as variaveis do CURU
const CURU_VARIABLES = [
  "Temperatura", "Umidade", "Qualidade do Ar", "Ruído",
  "Luminosidade", "CO2", "Pressão Atmosférica",
];

export default function StepPedagogical({ form, setForm }) {

  const [schools, setSchools] = useState([]);
  const [TurmasData, setTurmasData] = useState([]);

  const toggleVariable = (v) => {
    const arr = form.macroproject_variables || [];
    setForm({
      ...form,
      macroproject_variables: arr.includes(v)
        ? arr.filter(a => a !== v)
        : [...arr, v],
    });
  };

  // ESCOLAS
  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from("Escolas")
        .select("id, Nombre");

      if (error) return console.error(error);
      setSchools(data || []);
    };

    fetchSchools();
  }, []);

  // TURMAS
  useEffect(() => {
    const fetchTurmas = async () => {
      const { data, error } = await supabase
        .from("Turmas")
        .select("id, name, student_count, institution_id");

      if (error) return console.error(error);
      setTurmasData(data || []);
    };

    fetchTurmas();
  }, []);

  const instClasses = TurmasData.filter(
    c => c.institution_id === form.institution_name
  );

  const toggleItem = (field, item) => {
  setForm(prev => {
    const arr = prev[field] || [];
    return {
      ...prev,
      [field]: arr.includes(item)
        ? arr.filter(a => a !== item)
        : [...arr, item],
    };
  });
};

  const addParticipation = () => {
    setForm(prev => ({
      ...prev,
      participations: [
        ...(prev.participations || []),
        { class_group_id: "", students_involved: "" }
      ],
    }));
  };

 const updateParticipation = (index, field, value) => {
  setForm(prev => {
    const parts = [...(prev.participations || [])];
    parts[index] = { ...parts[index], [field]: value };
    return { ...prev, participations: parts };
  });
};

 const removeParticipation = (index) => {
    setForm(prev => ({
      ...prev,
      participations: (prev.participations || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">

      {/*INSTITUIÇÃO */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Instituição *</Label>

        <Select
          value={form.institution_id}
          onValueChange={(v) => {
            const selectedSchool = schools.find(s => String(s.id) === String(v));

            setForm(prev => ({
              ...prev,
              institution_id: v,
              institution_name: selectedSchool?.Nombre
            }));
          }}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Selecione a instituição" />
          </SelectTrigger>

          <SelectContent>
            {schools.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.Nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TECNOLOGIA */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Tecnologia utilizada no projeto
        </Label>

        {!form.uses_macroproject ? (
          <Input
            placeholder="Ex: Arduino, sensores IoT, Python..."
            value={form.technology || ""}
            onChange={(e) =>
              setForm({ ...form, technology: e.target.value })
            }
          />
        ) : (
          <div className="text-xs text-muted-foreground">
            Selecione as variáveis abaixo
          </div>
        )}
      </div>

      {/* SWITCH CURU */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">
              Usa dados do CURU (Macroprojeto)?
            </p>
            <p className="text-xs text-muted-foreground">
              Dados de sensores ambientais
            </p>
          </div>
        </div>

        <Switch
          checked={form.uses_macroproject || false}
          onCheckedChange={(v) =>
            setForm(prev => ({
              ...prev,
              uses_macroproject: v,
              macroproject_variables: v ? form.macroproject_variables : []
            }))
          }
        />
      </div>

      {/*  VARIABLES CURU */}
      {form.uses_macroproject && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Quais variáveis do CURU serão utilizadas?
          </Label>

          <div className="flex flex-wrap gap-2">
            {CURU_VARIABLES.map((v) => (
              <Badge
                key={v}
                variant={
                  (form.macroproject_variables || []).includes(v)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleVariable(v)}
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ÁREAS */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Áreas do Conhecimento BNCC</Label>
        <div className="flex flex-wrap gap-2">
          {KNOWLEDGE_AREAS.map(area => (
            <Badge
              key={area}
              variant={(form.knowledge_areas || []).includes(area) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleItem("knowledge_areas", area)}
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* DISCIPLINAS */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Disciplinas Envolvidas</Label>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map(d => (
            <Badge
              key={d}
              variant={(form.disciplines || []).includes(d) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleItem("disciplines", d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      {/* TURMAS */}
      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            Turmas - Nº de Estudantes
          </Label>

          <Button type="button" onClick={addParticipation}>
            <Plus className="w-4 h-4" /> Adicionar Turma
          </Button>
        </div>

        {(form.participations || []).map((p, i) => (
          <div key={i} className="flex gap-2 items-center">

            <Select
              value={p.class_group_id}
              onValueChange={(v) => updateParticipation(i, "class_group_id", v)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Turma" />
              </SelectTrigger>

              <SelectContent>
                {instClasses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} - {c.student_count} alunos
                  </SelectItem>
                ))}

                {instClasses.length === 0 && (
                  <SelectItem value="none" disabled>
                    Nenhuma turma cadastrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeParticipation(i)}
            >
              <X className="w-4 h-4" />
            </Button>

          </div>
        ))}
      </div>

    </div>
  );
}