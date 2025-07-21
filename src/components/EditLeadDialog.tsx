
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/hooks/useLeads";
import { ImageUpload } from "./ImageUpload";
import React from "react";
import { X } from 'lucide-react';

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export const EditLeadDialog = ({ open, onOpenChange, lead }: EditLeadDialogProps) => {
  const [formData, setFormData] = useState({
    nome: lead?.nome || "",
    telefone: lead?.telefone || "",
    email: lead?.email || "",
    cidade: lead?.cidade || "",
    estado: lead?.estado || "",
    peso: lead?.peso || "",
    altura: lead?.altura || "",
    foto_perfil: lead?.foto_perfil || "",
    anotacoes: lead?.anotacoes || "",
  });

  const updateLead = useUpdateLead();
  const { toast } = useToast();

  // Atualizar formData quando lead mudar ou dialog abrir
  React.useEffect(() => {
    if (lead && open) {
      setFormData({
        nome: lead.nome || "",
        telefone: lead.telefone || "",
        email: lead.email || "",
        cidade: lead.cidade || "",
        estado: lead.estado || "",
        peso: lead.peso || "",
        altura: lead.altura || "",
        foto_perfil: lead.foto_perfil || "",
        anotacoes: lead.anotacoes || "",
      });
    }
  }, [lead, open]);

  const handleRemoveImage = () => {
    setFormData({ ...formData, foto_perfil: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;

    // Normaliza o telefone
    const normalizedPhone = formData.telefone.replace(/\D/g, '');
    const payload = { ...formData, telefone: normalizedPhone };

    try {
      await updateLead.mutateAsync({
        id: lead.id,
        leadData: payload
      });

      toast({
        title: "Sucesso!",
        description: "Paciente atualizado com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de perfil */}
          <div className="flex flex-col gap-2">
            <ImageUpload
              value={formData.foto_perfil}
              onChange={(url) => setFormData({ ...formData, foto_perfil: url })}
              label="Foto de Perfil"
              placeholder="URL da foto ou faça upload de uma imagem"
            />
            {formData.foto_perfil && (
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={formData.foto_perfil}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <Button type="button" variant="outline" size="icon" onClick={handleRemoveImage} title="Remover imagem">
                  <X className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground">Remover imagem</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({...formData, cidade: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                placeholder="Ex: 70"
              />
            </div>
            <div>
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                value={formData.altura}
                onChange={(e) => setFormData({...formData, altura: e.target.value})}
                placeholder="Ex: 175"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="anotacoes">Anotações</Label>
            <Textarea
              id="anotacoes"
              value={formData.anotacoes}
              onChange={(e) => setFormData({...formData, anotacoes: e.target.value})}
              placeholder="Observações sobre o paciente..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={updateLead.isPending} className="flex-1">
              {updateLead.isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
