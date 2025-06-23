
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, X } from "lucide-react";

interface NewQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewQuestionForm = ({ isOpen, onClose }: NewQuestionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "comportamental",
    perguntaDiaria: "",
    perguntaSemanal: "",
    tipo: "nivel",
    metaObjetivo: 3,
    isActive: true,
    descricao: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.perguntaSemanal) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha pelo menos o título e a pergunta semanal.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pergunta criada",
      description: `A pergunta "${formData.titulo}" foi criada com sucesso.`,
    });
    
    // Reset form
    setFormData({
      titulo: "",
      categoria: "comportamental",
      perguntaDiaria: "",
      perguntaSemanal: "",
      tipo: "nivel",
      metaObjetivo: 3,
      isActive: true,
      descricao: "",
    });
    
    onClose();
  };

  const handleReset = () => {
    setFormData({
      titulo: "",
      categoria: "comportamental",
      perguntaDiaria: "",
      perguntaSemanal: "",
      tipo: "nivel",
      metaObjetivo: 3,
      isActive: true,
      descricao: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Pergunta do Questionário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titulo">Título da Pergunta *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Consistência do Plano"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({...formData, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comportamental">Comportamental</SelectItem>
                      <SelectItem value="bem-estar">Bem-Estar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição (Opcional)</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o objetivo desta pergunta..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perguntas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pergunta-diaria">Pergunta Diária (Opcional)</Label>
                <Textarea
                  id="pergunta-diaria"
                  value={formData.perguntaDiaria}
                  onChange={(e) => setFormData({...formData, perguntaDiaria: e.target.value})}
                  placeholder="Pergunta que será feita diariamente..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="pergunta-semanal">Pergunta Semanal *</Label>
                <Textarea
                  id="pergunta-semanal"
                  value={formData.perguntaSemanal}
                  onChange={(e) => setFormData({...formData, perguntaSemanal: e.target.value})}
                  placeholder="Pergunta que será feita semanalmente..."
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Resposta</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({...formData, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nivel">Nível (1-3)</SelectItem>
                      <SelectItem value="porcentagem">Porcentagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="meta">Meta Objetivo</Label>
                  {formData.tipo === "nivel" ? (
                    <Select
                      value={formData.metaObjetivo.toString()}
                      onValueChange={(value) => setFormData({...formData, metaObjetivo: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nível 1 - Baixo</SelectItem>
                        <SelectItem value="2">Nível 2 - Moderado</SelectItem>
                        <SelectItem value="3">Nível 3 - Bom</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.metaObjetivo}
                      onChange={(e) => setFormData({...formData, metaObjetivo: parseInt(e.target.value) || 0})}
                      placeholder="Meta em %"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="active">Pergunta Ativa</Label>
                  <p className="text-sm text-gray-600">A pergunta será incluída nos questionários automaticamente</p>
                </div>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Criar Pergunta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
