import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateLead } from "@/hooks/useLeads";
import { storage } from "@/integrations/supabase/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useObjetivoTags } from "@/hooks/useObjetivoTags";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewLeadDialog = ({ open, onOpenChange }: NewLeadDialogProps) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();
  const createLead = useCreateLead();
  const { data: objetivoTags = [] } = useObjetivoTags();
  
  const [objetivoTagId, setObjetivoTagId] = useState("");

  const calculatedIMC = peso && altura ? (parseFloat(peso) / (parseFloat(altura) * parseFloat(altura))).toFixed(2) : "";

  useEffect(() => {
    if (selectedImage) {
      uploadImage();
    }
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    try {
      const { data, error } = await storage
        .from('avatars')
        .upload(`leads/${Date.now()}-${selectedImage.name}`, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da imagem. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      const publicURL = storage.from('avatars').getPublicUrl(data.path);
      setImageUrl(publicURL.data.publicUrl);
      
      toast({
        title: "Sucesso!",
        description: "Imagem enviada com sucesso.",
      });
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao fazer upload da imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const leadData = {
        nome,
        telefone,
        email: email || undefined,
        objetivo_tag_id: objetivoTagId || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
        status: "novo",
        peso: peso || undefined,
        altura: altura || undefined,
        imc: calculatedIMC || undefined,
        foto_perfil: imageUrl || undefined,
        progresso: 0,
      };

      await createLead.mutateAsync(leadData);
      
      toast({
        title: "Sucesso!",
        description: "Lead criado com sucesso.",
      });
      
      // Reset form
      setNome("");
      setTelefone("");
      setEmail("");
      setObjetivoTagId("");
      setCidade("");
      setEstado("");
      setPeso("");
      setAltura("");
      setSelectedImage(null);
      setImageUrl("");
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
          {/* Nome e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(99) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* Objetivo Tag */}
          <div>
            <Label htmlFor="objetivo">Objetivo</Label>
            <Select value={objetivoTagId} onValueChange={setObjetivoTagId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um objetivo" />
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

          {/* Cidade e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Estado"
              />
            </div>
          </div>

          {/* Peso e Altura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Peso em kg"
              />
            </div>
            <div>
              <Label htmlFor="altura">Altura (m)</Label>
              <Input
                id="altura"
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                placeholder="Altura em metros"
              />
            </div>
          </div>

          {/* IMC */}
          {calculatedIMC && (
            <div>
              <Label>IMC (Calculado)</Label>
              <Input value={calculatedIMC} readOnly />
            </div>
          )}

          {/* Foto de Perfil */}
          <div>
            <Label htmlFor="image">Foto de Perfil</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {imageUrl ? (
                  <AvatarImage src={imageUrl} alt="Foto de Perfil" />
                ) : (
                  <AvatarFallback>
                    {nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button variant="outline" asChild>
                <label htmlFor="image" className="cursor-pointer">
                  {imageUrl ? "Alterar Foto" : "Adicionar Foto"}
                </label>
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={createLead.isPending}>
              {createLead.isPending ? "Criando..." : "Criar Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
