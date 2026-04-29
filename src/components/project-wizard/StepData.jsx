import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";

const CURU_VARIABLES = [
  "Temperatura", "Umidade", "Qualidade do Ar", "Ruído",
  "Luminosidade", "CO2", "Pressão Atmosférica",
];

export default function StepData({ form, setForm }) {
  const toggleVariable = (v) => {
    const arr = form.macroproject_variables || [];
    setForm({
      ...form,
      macroproject_variables: arr.includes(v) ? arr.filter(a => a !== v) : [...arr, v],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Usa dados do CURU (Macroprojeto)?</p>
            <p className="text-xs text-muted-foreground">Dados de sensores ambientais</p>
          </div>
        </div>
        <Switch
          checked={form.uses_macroproject || false}
          onCheckedChange={v => setForm({ ...form, uses_macroproject: v })}
        />
      </div>

      {form.uses_macroproject && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Quais variáveis do CURU serão utilizadas?</Label>
          <div className="flex flex-wrap gap-2">
            {CURU_VARIABLES.map(v => (
              <Badge
                key={v}
                variant={(form.macroproject_variables || []).includes(v) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleVariable(v)}
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}