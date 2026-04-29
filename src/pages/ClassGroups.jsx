import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";

import { PlusCircle, Trash2 } from "lucide-react";
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

  // CLASS GROUPS
  const { data: classGroups = [], isLoading } = useQuery({
    queryKey: ["classGroups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ClassGroups")
        .select("*");

      if (error) throw error;

      return data;
    }
  });

  // INSTITUCIONES
  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      let allData = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from("CURU_Intitucoes")
          .select("Escola")
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (!data || data.length === 0) break;

        allData = [...allData, ...data];

        from += pageSize;
      }

      const unique = Array.from(
        new Set(allData.map(item => item.Escola?.trim()))
      ).map(name => ({
        Escola: name
      }));

      return unique;
    }
  });

  // CREATE
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
    }
  });

  // DELETE
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
    }
  });

  const handleSubmit = () => {
    if (!form.name || !form.institution_id) {
      toast.error("Nome e Instituição são obrigatórios");
      return;
    }

    createMutation.mutate({
      name: form.name,
      grade: form.grade || null,
      shift: form.shift,
      institution_id: form.institution_id,
      student_count: form.student_count
        ? parseInt(form.student_count)
        : null
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Turmas</h1>
          <p className="text-sm text-muted-foreground">
            {classGroups.length} turmas cadastradas
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Nova Turma
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Turma</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2"></div>
              <Label>Nome da Turma *</Label>
              <Input
                placeholder="Ex: 8º Ano A"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <div className="space-y-2"></div>
              <Label>Instituição *</Label>
              <Select
                value={form.institution_id}
                onValueChange={(v) =>
                  setForm({ ...form, institution_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escola" />
                </SelectTrigger>

                <SelectContent>
                  {institutions.map((i, idx) => (
                    <SelectItem key={idx} value={i.Escola}>
                      {i.Escola}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 🔥 ÚNICO CAMBIO: SÉRIE + TURNO */}
              <div className="grid grid-cols-2 gap-3">

                <div className="space-y-2">
                  <Label>Série</Label>
                  <Input
                    placeholder="Ex: Fundamental I"
                    value={form.grade}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
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
                    <SelectTrigger>
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="matutino">Matutino</SelectItem>
                      <SelectItem value="vespertino">Vespertino</SelectItem>
                      <SelectItem value="noturno">Noturno</SelectItem>
                      <SelectItem value="integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
          <div className="space-y-2"></div>
            <Label>Quantidade de alunos</Label>
              <Input
                type="number"
                min={0}
                placeholder="Alunos"
                value={form.student_count}
                onChange={(e) =>
                  setForm({
                    ...form,
                    student_count: e.target.value
                  })
                }
              />
           

              <Button onClick={handleSubmit} className="w-full">
                Cadastrar Turma
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA */}
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {classGroups.map((cls) => (
            <Card key={cls.id} className="p-4">

              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{cls.name}</h3>
                  <p className="text-xs text-gray-500">
                    {cls.institution_id}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(cls.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mt-2">
                {cls.grade && <Badge>{cls.grade}</Badge>}
                {cls.shift && (
                  <Badge>{shiftLabels[cls.shift]}</Badge>
                )}
                {cls.student_count && (
                  <Badge>{cls.student_count}</Badge>
                )}
              </div>

            </Card>
          ))}

        </div>
      )}

    </div>
  );
}