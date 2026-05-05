// arquivo relacionado com as configuracoes da aba Instituicoes

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { PlusCircle, School, MapPin, Phone, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

// adicionar os elementos da lista do tipo de escola
const typeLabels = { escola: "Escola", ong: "ONG", universidade: "Universidade", instituto: "Instituto", outro: "Outro" };

export default function Institutions() {
  const [customType, setCustomType] = useState("");
  const [errors, setErrors] = useState({});
  const [schoolId, setSchoolId] = useState("");
  const [phoneCode, setPhoneCode] = useState("+55");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", address: "", city: "", state: "", responsible: "", phone: "", latitude: "", longitude: "", cep: "" });
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const queryClient = useQueryClient();
  
  // pegando todas as escolas que estao na BD
  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Escolas")
        .select("*");

      if (error) throw error;
      return data;
    }
  });

  // insertar as informacoes na BD de Supabase
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("Escolas")
        .insert([{ 
          Nombre: data.name,
          Tipo: data.type,
          CEP: data.cep,
          endereco: `${data.address}, ${data.number || ""} - ${data.neighborhood || ""}`.trim(),
          cidade: data.city,
          estado: data.state,
          responsavel: data.responsible,
          telefono: `${phoneCode} ${data.phone.replace(phoneCode, "")}`.trim(),
          latitude: data.latitude || null,
          longitude: data.longitude || null   
        }])
        .select(); 

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      setOpen(false);
      setForm({ 
        name: "", 
        type: "", 
        address: "", 
        city: "", state: "", 
        responsible: "", 
        phone: "", 
        latitude: "", 
        longitude: "", 
        cep: "" });
      toast.success("Instituição cadastrada");
    },
  });

  // eliminar uma esola da BD de Supabase
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("Escolas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Instituição removida");
    },
  });

  // convertir um endereço em coordenadas de latitude e longitude
  const getLatLng = async (address, city, state) => {
  const query = `${address}, ${city}, ${state}, Brazil`;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    if (data?.length > 0) {
      return {
        lat: data[0].lat,
        lng: data[0].lon
      };
    }

    return { lat: null, lng: null };
  } catch (err) {
    console.error(err);
    return { lat: null, lng: null };
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  // codigo para alertar para o prenchimento de todos los campos
  // que sejam necesarios para o cadastro
  const newErrors = {};
  
  if (!form.name) newErrors.name = true;
  if (!form.cep) newErrors.cep = true;
  if (!form.responsible) newErrors.responsible = true;
  if (!form.phone) newErrors.phone = true;
  if (!form.type) newErrors.type = true;

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error("Preencha os campos requeridos");
    return;
  }

  try {
    const fullAddress = `${form.address}, ${form.number || ""}, ${form.city}, ${form.state}`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
    );

    const geoData = await res.json();

    const latitude = geoData?.[0]?.lat || null;
    const longitude = geoData?.[0]?.lon || null;

    const data = {
      ...form,
      type: form.type ? (form.type === "outro" ? customType : form.type) : "escola",
      phone: `${phoneCode} ${form.phone}`,
      latitude,
      longitude
    };

    createMutation.mutate(data);
  } catch (error) {
    console.error(error);
    toast.error("Erro ao obter coordenadas");
  }
};

// prenchimento dos dados principais de acordo con numero de cep
  const handleCepChange = async (cep) => {
    setForm(prev => ({ ...prev, cep }));

    if (cep.length < 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

 return (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Instituições</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {institutions.length} instituições cadastradas
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 rounded-xl">
            <PlusCircle className="w-4 h-4" /> Nova Instituição
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Instituição</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={e => {
                  setForm({ ...form, name: e.target.value });
                  setErrors(prev => ({ ...prev, name: false }));
                }}
                className={`rounded-xl ${errors.name ? "border-red-500" : ""}`}
              />
            </div>

          <div className="space-y-2">
            <Label>Tipo</Label>

            <Select
              value={form.type || ""}
              onValueChange={v => {
                setForm({ ...form, type: v });
                setErrors(prev => ({ ...prev, type: false }));
              }}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>

              <SelectContent>
                {Object.entries(typeLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.type === "outro" && (
            <div className="space-y-2">
              <Label>Especifique o tipo</Label>
              <Input
                value={customType}
                onChange={e => setCustomType(e.target.value)}
                className="rounded-xl"
              />
    </div>
  )}

          <div className="space-y-2">
            <Label>CEP *</Label>
            <Input
              value={form.cep || ""}
              onChange={e => handleCepChange(e.target.value)}
              className={`rounded-xl ${errors.cep ? "border-red-500" : ""}`}
            />
          </div>

          <div className="space-y-2">
            <Label>Rua</Label>
            <Input
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={form.number || ""}
                onChange={e => setForm({ ...form, number: e.target.value })}
                className="rounded-xl"
              />
            </div>

          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input
              value={form.neighborhood || ""}
              onChange={e => setForm({ ...form, neighborhood: e.target.value })}
              className="rounded-xl"
            />
          </div>
  </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <Input
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
            className="rounded-xl"  />         
        </div>
  </div>

        <div className="space-y-2">
          <Label>Responsável *</Label>
          <Input
            value={form.responsible}
            onChange={e => {
              setForm({ ...form, responsible: e.target.value });
              setErrors(prev => ({ ...prev, responsible: false }));
            }}
            className={`rounded-xl ${errors.responsible ? "border-red-500" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Telefone *</Label>

          <div className="grid grid-cols-3 gap-2">
            <Select value={phoneCode} onValueChange={setPhoneCode}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+55">🇧🇷 +55</SelectItem>
              </SelectContent>
            </Select>

          <Input
            className={`col-span-2 rounded-xl ${errors.phone ? "border-red-500" : ""}`}
            value={form.phone}
            onChange={e => {
              setForm({ ...form, phone: e.target.value });
              setErrors(prev => ({ ...prev, phone: false }));
            }}
          />
    </div>
  </div>

        <Button
          type="submit"
          className="w-full rounded-xl"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Salvando..." : "Cadastrar"}
        </Button>

</form>          
        </DialogContent>
      </Dialog>
    </div>

    {isLoading ? (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    ) : institutions.length === 0 ? (
      <div className="text-center py-20 text-muted-foreground">
        Nenhuma instituição cadastrada
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutions.map(inst => (
          <Card key={inst.id} className="p-5 rounded-2xl border-border/50 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <School className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm">{inst.Nombre}</h3>
                  <Badge variant="secondary" className="text-[10px] mt-1">
                    {typeLabels[inst.type] || inst.type}
                  </Badge>
                </div>
              </div>

        <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => {
                  setSelectedInstitution(inst);
                  setViewOpen(true);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm("Excluir esta instituição?")) deleteMutation.mutate(inst.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              {(inst.address || inst.city || inst.state) && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {[
                    inst.address,
                    inst.number,
                    inst.neighborhood,
                    inst.city,
                    inst.state
                  ].filter(Boolean).join(", ")}
                </p>
              )}

              {inst.responsible && <p>Responsável: {inst.responsible}</p>}

              {inst.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {inst.phone}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    )}

    {/* janela para mostrar as informaçoes das escolas*/}
    <Dialog open={viewOpen} onOpenChange={setViewOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader> <DialogTitle>Detalhes da Instituição</DialogTitle> </DialogHeader>

        {selectedInstitution && (
          <div className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {selectedInstitution.Nombre}</p>
            <p><strong>Tipo:</strong> {selectedInstitution.Tipo}</p>
            <p><strong>Responsavel:</strong> {selectedInstitution.responsavel}</p>
            <p><strong>Telefone:</strong> {selectedInstitution.telefono}</p>
            <p><strong>CEP:</strong> {selectedInstitution.CEP}</p>
            <p><strong>Endereço:</strong> {selectedInstitution.endereco}</p>
            <p><strong>Cidade:</strong> {selectedInstitution.cidade}</p>
            <p><strong>Estado:</strong> {selectedInstitution.estado}</p>

            {selectedInstitution.latitude && selectedInstitution.longitude && (
              <p>
                <strong>Coordenadas:</strong>{" "}
                {selectedInstitution.latitude}, {selectedInstitution.longitude}
              </p>
            )}

            <Button className="w-full mt-4" onClick={() => setViewOpen(false)}>
              Fechar
            </Button>
          </div>
        )}
      
      </DialogContent>
    </Dialog>

  </div>
 );
};