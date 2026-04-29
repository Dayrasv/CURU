import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";

import { PlusCircle, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";

const shiftLabels = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  noturno: "Noturno",
  integral: "Integral"
};

export default function ClassGroups() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    grade: "",
    shift: "matutino",
    institution_id: "",
    student_count: ""
  });

  const queryClient = useQueryClient();

  // 🔹 Turmas
  const { data: classGroups = [], isLoading } = useQuery({
    queryKey: ["classGroups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ClassGroups").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Escolas (pegar os dados do supabase)
   const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("CURU_Intitucoes")
        .select("Escola")
        .order("Escola", { ascending: true });

        console.log("DATA:", data);
        console.log("ERROR:", error);

      if (error) throw error;
      return data;
    },
  });

  // 🔹 Crear
  const createMutation = useMutation({
    mutationFn: async (newData) => {
      const { data, error } = await supabase
        .from("ClassGroups")
        .insert([newData]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classGroups"] });
      setOpen(false);
      setForm({
        name: "",
        grade: "",
        shift: "matutino",
        institution_id: "",
        student_count: ""
      });
      toast.success("Turma cadastrada");
    },
  });

  // 🔹 Eliminar
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("ClassGroups")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classGroups"] });
      toast.success("Turma removida");
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.institution_id) {
      toast.error("Nome e Instituição são obrigatórios");
      return;
    }

    const newData = {
      name: form.name,
      grade: form.grade || null,
      shift: form.shift,
      institution_id: form.institution_id,
      student_count: form.student_count
        ? parseInt(form.student_count)
        : null,
    };

    createMutation.mutate(newData);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Turmas</h1>
          <p className="text-sm text-muted-foreground">
            {classGroups.length} turmas cadastradas
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-[#003a66] hover:bg-[#002944] text-white">
              <PlusCircle className="w-4 h-4" /> Nova Turma
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Turma</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome da Turma *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Instituição *</Label>
                <Select
                  value={form.institution_id}
                  onValueChange={(v) =>
                    setForm({ ...form, institution_id: v })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione a instituição" />
                  </SelectTrigger>

                  <SelectContent>
                    {institutions.map((i) => (
                      <SelectItem key={i.Escola} value={i.Escola}>
                        {i.Escola}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Série</Label>
                  <Input
                    value={form.grade}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Turno</Label>
                  <Select
                    value={form.shift}
                    onValueChange={(v) =>
                      setForm({ ...form, shift: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {Object.entries(shiftLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nº de Alunos</Label>
                <Input
                  type="number"
                  value={form.student_count}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      student_count: e.target.value,
                    })
                  }
                  className="rounded-xl"
                />
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-xl bg-[#003a66] hover:bg-[#002944] text-white"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : classGroups.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhuma turma cadastrada
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classGroups.map((cls) => (
            <Card key={cls.id} className="p-5 rounded-2xl">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{cls.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cls.institution_id}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(cls.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mt-3">
                {cls.grade && <Badge>{cls.grade}</Badge>}
                {cls.shift && (
                  <Badge variant="outline">
                    {shiftLabels[cls.shift]}
                  </Badge>
                )}
                {cls.student_count && (
                  <Badge>{cls.student_count} alumnos</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}