
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLead } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

interface NewPacienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewPacienteDialog = ({ open, onOpenChange }: NewPacienteDialogProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
    objetivo: "",
    peso: "",
    altura: "",
    foto_perfil: "",
    anotacoes: "",
    status: "ativo",
    progresso: 0,
  });

  const createPaciente = useCreateLead();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPaciente.mutateAsync(formData);
      toast({
        title: "Sucesso!",
        description: "Paciente criado com sucesso.",
      });
      onOpenChange(false);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        cidade: "",
        estado: "",
        objetivo: "",
        peso: "",
        altura: "",
        foto_perfil: "",
        anotacoes: "",
        status: "ativo",
        progresso: 0,
      });
    } catch (error) {
      console.error('Error creating paciente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar paciente. Tente novamente.",
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
          <DialogTitle>Novo Paciente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            value={formData.foto_perfil}
            onChange={(url) => setFormData({...formData, foto_perfil: url})}
            label="Foto de Perfil"
            placeholder="URL da foto ou faça upload de uma imagem"
          />

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

          <div>
            <Label htmlFor="objetivo">Objetivo</Label>
            <Select value={formData.objetivo} onValueChange={(value) => setFormData({...formData, objetivo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Perda de Peso">Perda de Peso</SelectItem>
                <SelectItem value="Ganho de Massa">Ganho de Massa</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Definição">Definição</SelectItem>
                <SelectItem value="Saúde Geral">Saúde Geral</SelectItem>
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={createPaciente.isPending} className="flex-1">
              {createPaciente.isPending ? "Criando..." : "Criar Paciente"}
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
