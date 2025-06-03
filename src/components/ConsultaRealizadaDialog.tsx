
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateConsultaRealizada, useUploadConsultaArquivo } from "@/hooks/useConsultasRealizadas";
import { ImageUpload } from "./ImageUpload";
import { Upload, FileText, X } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";

interface ConsultaRealizadaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente;
}

export const ConsultaRealizadaDialog = ({ open, onOpenChange, paciente }: ConsultaRealizadaDialogProps) => {
  const [formData, setFormData] = useState({
    data_consulta: new Date().toISOString().split('T')[0],
    observacoes: "",
    peso_atual: "",
    altura_atual: "",
    notas_clinicas: "",
  });
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [consultaRealizadaId, setConsultaRealizadaId] = useState<string>("");

  const createConsulta = useCreateConsultaRealizada();
  const uploadArquivo = useUploadConsultaArquivo();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Criar a consulta realizada
      const consulta = await createConsulta.mutateAsync({
        paciente_id: paciente.id,
        data_consulta: new Date(formData.data_consulta).toISOString(),
        observacoes: formData.observacoes,
        peso_atual: formData.peso_atual,
        altura_atual: formData.altura_atual,
        notas_clinicas: formData.notas_clinicas,
      });

      // Upload dos arquivos se houver
      if (arquivos.length > 0) {
        for (const arquivo of arquivos) {
          await uploadArquivo.mutateAsync({
            consultaRealizadaId: consulta.id,
            file: arquivo,
          });
        }
      }

      toast({
        title: "Sucesso!",
        description: "Consulta registrada com sucesso.",
      });

      onOpenChange(false);
      // Reset form
      setFormData({
        data_consulta: new Date().toISOString().split('T')[0],
        observacoes: "",
        peso_atual: "",
        altura_atual: "",
        notas_clinicas: "",
      });
      setArquivos([]);
    } catch (error) {
      console.error('Error creating consulta:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar consulta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArquivos(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Consulta Realizada - {paciente.lead.nome}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="data_consulta">Data da Consulta *</Label>
            <Input
              id="data_consulta"
              type="date"
              value={formData.data_consulta}
              onChange={(e) => setFormData({...formData, data_consulta: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso_atual">Peso Atual (kg)</Label>
              <Input
                id="peso_atual"
                value={formData.peso_atual}
                onChange={(e) => setFormData({...formData, peso_atual: e.target.value})}
                placeholder="Ex: 75"
              />
            </div>
            <div>
              <Label htmlFor="altura_atual">Altura Atual (cm)</Label>
              <Input
                id="altura_atual"
                value={formData.altura_atual}
                onChange={(e) => setFormData({...formData, altura_atual: e.target.value})}
                placeholder="Ex: 175"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações gerais da consulta..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notas_clinicas">Notas Clínicas</Label>
            <Textarea
              id="notas_clinicas"
              value={formData.notas_clinicas}
              onChange={(e) => setFormData({...formData, notas_clinicas: e.target.value})}
              placeholder="Anotações técnicas e clínicas..."
              rows={3}
            />
          </div>

          {/* Upload de arquivos */}
          <div>
            <Label>Arquivos da Consulta</Label>
            <div className="mt-2">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="mb-2"
              />
              
              {arquivos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Arquivos selecionados:</p>
                  {arquivos.map((arquivo, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        {arquivo.type.startsWith('image/') ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm">{arquivo.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={createConsulta.isPending || uploadArquivo.isPending} 
              className="flex-1"
            >
              {createConsulta.isPending || uploadArquivo.isPending ? "Registrando..." : "Registrar Consulta"}
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
