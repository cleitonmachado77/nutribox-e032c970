
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { Paciente } from "@/hooks/usePacientes";

interface EditPacienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente | null;
}

export const EditPacienteDialog = ({ open, onOpenChange, paciente }: EditPacienteDialogProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
    status: "",
    peso: "",
    altura: "",
    objetivo: "",
    anotacoes: ""
  });

  const updatePaciente = useUpdateLead();
  const { toast } = useToast();

  useEffect(() => {
    if (paciente && open) {
      setFormData({
        nome: paciente.lead.nome || "",
        telefone: paciente.lead.telefone || "",
        email: paciente.lead.email || "",
        cidade: paciente.lead.cidade || "",
        estado: paciente.lead.estado || "",
        status: paciente.lead.status || "",
        peso: paciente.lead.peso || "",
        altura: paciente.lead.altura || "",
        objetivo: paciente.lead.objetivo || "",
        anotacoes: paciente.lead.anotacoes || ""
      });
    }
  }, [paciente, open]);

  const handleSave = async () => {
    if (!paciente) return;

    try {
      await updatePaciente.mutateAsync({
        id: paciente.lead.id,
        leadData: formData
      });

      toast({
        title: "Sucesso!",
        description: "Dados do paciente atualizados com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating paciente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar paciente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange("telefone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => handleInputChange("cidade", e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              value={formData.estado}
              onChange={(e) => handleInputChange("estado", e.target.value)}
              placeholder="UF"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="em_tratamento">Em Tratamento</SelectItem>
                <SelectItem value="acompanhamento">Acompanhamento</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              value={formData.peso}
              onChange={(e) => handleInputChange("peso", e.target.value)}
              placeholder="70.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input
              id="altura"
              value={formData.altura}
              onChange={(e) => handleInputChange("altura", e.target.value)}
              placeholder="175"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Input
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => handleInputChange("objetivo", e.target.value)}
              placeholder="Objetivo do paciente"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="anotacoes">Anotações</Label>
            <Textarea
              id="anotacoes"
              value={formData.anotacoes}
              onChange={(e) => handleInputChange("anotacoes", e.target.value)}
              placeholder="Anotações sobre o paciente"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={updatePaciente.isPending} className="flex-1">
            {updatePaciente.isPending ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
