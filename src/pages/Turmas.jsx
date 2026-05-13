// arquivo relacionado com as configuracoes da aba Turmas

// Importación de hooks de React
import React, { useState } from "react";

// React Query para manejar datos (consultas y mutaciones)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Cliente de Supabase (base de datos)
import { supabase } from "../lib/supabase";

// Componentes UI
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";

// Iconos
import { PlusCircle, Trash2 } from "lucide-react";

// Notificaciones
import { toast } from "sonner";

// Etiquetas para mostrar el turno en texto bonito
const shiftLabels = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  noturno: "Noturno",
  integral: "Integral"
};

// Controla si el modal está abierto o cerrado
export default function Turmas() {
  const [open, setOpen] = useState(false);

  // Estado del formulario
  const [form, setForm] = useState({
    name: "",
    grade: "",
    shift: "matutino",
    institution_id: "",
    student_count: ""
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});

  // React Query (para refrescar datos automáticamente)
  const queryClient = useQueryClient();

  const { data: Turmas = [], isLoading } = useQuery({
    queryKey: ["Turmas"],
    queryFn: async () => {
      // Función que consulta la base de datos
      const { data, error } = await supabase
        .from("Turmas")
        .select("*");

      if (error) throw error;

      return data;
    }
  });

  // Obtener instituciones
  const { data: institutions = [] } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      // Variables para paginar (Supabase trae max 1000 por request)
      let allData = [];
      let from = 0;
      const pageSize = 1000;

      // Bucle para traer TODOS los registros
      while (true) {
        const { data, error } = await supabase
          .from("CURU_Intitucoes")
          .select("Escola")
          .range(from, from + pageSize - 1);

        if (error) throw error;

        // Si no hay más datos, salir del bucle
        if (!data || data.length === 0) break;

        // Acumular resultados
        allData = [...allData, ...data];

        from += pageSize;
      }
      // Eliminar duplicados
      const unique = Array.from(
        new Set(allData.map(item => item.Escola?.trim()))
      ).map(name => ({
        Escola: name
      }));

      return unique;
    }
  });

  // Creando los datos para enviarlos a supabase: Creando una nueva turma
  const createMutation = useMutation({
    mutationFn: async (newData) => {
       // Inserta datos en Supabase
      const { data, error } = await supabase
        .from("Turmas")
        .insert([newData]);
        
      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      // Refresca la lista automáticamente
      queryClient.invalidateQueries({ queryKey: ["Turmas"] });
      
      //limpia el formulario
      setForm({
        name: "",
        grade: "",
        shift: "matutino",
        institution_id: "",
        student_count: ""
      });

      // Notificación
      toast.success("Turma cadastrada");
    }
  });

  // Eliminar turma
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Borra por ID
      const { error } = await supabase
        .from("Turmas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Turmas"] });
      toast.success("Turma removida");
    }
  });

  // Enviar formulario
  const handleSubmit = () => {
    
    // Objeto para errores
    const newErrors = {};

    if (!form.name) newErrors.name = true;
    if (!form.institution_id) newErrors.institution_id = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    // Construir objeto final
    const payload = {
      name: form.name,
      grade: form.grade || null,
      shift: form.shift,
      institution_id: form.institution_id,
      student_count: form.student_count
        ? parseInt(form.student_count)
        : null
    };

    if (!payload.name) {
      toast.error("Nome da turma");
      return;
    }

    if (!payload.institution_id) {
      toast.error("Instituiçao");
      return;
    }
     // Enviar a Supabase
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">

      {/* Texto de cant de turmas cadastradas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Turmas</h1>
          <p className="text-sm text-muted-foreground">
            {Turmas.length} turmas cadastradas
          </p>
        </div>

        {/* Boton de adicionar nueva turma */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Nova Turma
            </Button>
          </DialogTrigger>

          {/* Boton de adicionar nuevo cadastro */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Turma</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2"></div>
              <Label>Nome da Turma *</Label>
              <Input
                placeholder="Ex: 8 Ano A"
                value={form.name}
                className={errors.name ? "border-red-500" : ""}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors((prev) => ({
                    ...prev,
                    name: false
                  }));
                }}
              />

              <div className="space-y-2"></div>
              <Label>Instituição *</Label>
              <Select
                value={form.institution_id}
                onValueChange={(v) => {
                  setForm({ ...form, institution_id: v });
                  setErrors((prev) => ({
                    ...prev,
                    institution_id: false
                  }));
                }}
              >
                <SelectTrigger className={errors.institution_id ? "border-red-500" : ""}>
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

          {Turmas.map((cls) => (
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