import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//import { base44 } from "@/api/base44Client";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { PlusCircle, School, MapPin, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const typeLabels = { escola: "Escola", ong: "ONG", universidade: "Universidade", instituto: "Instituto", outro: "Outro" };

export default function Institutions() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "escola", address: "", city: "", state: "", responsible: "", phone: "", latitude: "", longitude: "" });
  const queryClient = useQueryClient();

  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => base44.entities.Institution.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("institutions").insert([data]);
    if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      setOpen(false);
      setForm({ name: "", type: "escola", address: "", city: "", state: "", responsible: "", phone: "", latitude: "", longitude: "" });
      toast.success("Instituição cadastrada");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Institution.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success("Instituição removida");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (data.latitude) data.latitude = parseFloat(data.latitude);
    if (data.longitude) data.longitude = parseFloat(data.longitude);
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instituições</h1>
          <p className="text-sm text-muted-foreground mt-1">{institutions.length} instituições cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl"><PlusCircle className="w-4 h-4" /> Nova Instituição</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Cadastrar Instituição</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Cidade</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="rounded-xl" /></div>
                <div className="space-y-2"><Label>Estado</Label><Input value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="rounded-xl" /></div>
              </div>
              <div className="space-y-2"><Label>Endereço</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Responsável</Label><Input value={form.responsible} onChange={e => setForm({...form, responsible: e.target.value})} className="rounded-xl" /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Latitude</Label><Input value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} placeholder="-23.5505" className="rounded-xl" /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} placeholder="-46.6333" className="rounded-xl" /></div>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
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
        <div className="text-center py-20 text-muted-foreground">Nenhuma instituição cadastrada</div>
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
                    <h3 className="font-semibold text-sm">{inst.name}</h3>
                    <Badge variant="secondary" className="text-[10px] mt-1">{typeLabels[inst.type] || inst.type}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => { if (confirm("Excluir esta instituição?")) deleteMutation.mutate(inst.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {(inst.city || inst.state) && (
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{[inst.city, inst.state].filter(Boolean).join(", ")}</p>
                )}
                {inst.responsible && <p>Responsável: {inst.responsible}</p>}
                {inst.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{inst.phone}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}