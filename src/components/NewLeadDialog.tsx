
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLead } from "@/hooks/useLeads";
import { useObjetivoTags } from "@/hooks/useObjetivoTags";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewLeadDialog = ({ open, onOpenChange }: NewLeadDialogProps) => {
  const createLead = useCreateLead();
  const { data: objetivoTags = [] } = useObjetivoTags();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
    peso: "",
    altura: "",
    objetivo: "",
    objetivo_tag_id: "",
    anotacoes: "",
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('leads-storage')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('leads-storage')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const calculateIMC = (peso: string, altura: string): string => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100; // converter cm para metros
    
    if (pesoNum > 0 && alturaNum > 0) {
      const imc = pesoNum / (alturaNum * alturaNum);
      return imc.toFixed(1);
    }
    
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let photoUrl = "";
      
      if (profileImage) {
        photoUrl = await uploadImage(profileImage) || "";
      }

      const imc = calculateIMC(formData.peso, formData.altura);

      const leadData = {
        ...formData,
        imc,
        foto_perfil: photoUrl,
        objetivo_tag_id: formData.objetivo_tag_id || null,
      };

      await createLead.mutateAsync(leadData);
      
      toast({
        title: "Sucesso!",
        description: "Lead criado com sucesso.",
      });
      
      // Reset form
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        cidade: "",
        estado: "",
        peso: "",
        altura: "",
        objetivo: "",
        objetivo_tag_id: "",
        anotacoes: "",
      });
      setProfileImage(null);
      setPreviewUrl("");
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar lead. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Foto de perfil */}
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                value={formData.altura}
                onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="objetivo">Objetivo Principal</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                placeholder="Ex: Perder 10kg em 6 meses"
              />
            </div>
            
            <div>
              <Label htmlFor="objetivo_tag">Tag de Objetivo</Label>
              <Select 
                value={formData.objetivo_tag_id} 
                onValueChange={(value) => setFormData({ ...formData, objetivo_tag_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tag" />
                </SelectTrigger>
                <SelectContent>
                  {objetivoTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.cor }}
                        />
                        {tag.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="anotacoes">Anotações</Label>
            <Textarea
              id="anotacoes"
              value={formData.anotacoes}
              onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
              placeholder="Observações importantes sobre o lead..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createLead.isPending} className="flex-1">
              {createLead.isPending ? "Criando..." : "Criar Lead"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
