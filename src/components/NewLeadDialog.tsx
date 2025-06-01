
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X } from "lucide-react";
import { useCreateLead } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLeadDialog({ open, onOpenChange }: NewLeadDialogProps) {
  const { toast } = useToast();
  const createLead = useCreateLead();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [bodyImages, setBodyImages] = useState<File[]>([]);
  const [bodyImagePreviews, setBodyImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    objetivo: "",
    cidade: "",
    estado: "",
    peso: "",
    altura: "",
    anotacoes: "",
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBodyImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBodyImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBodyImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeBodyImage = (index: number) => {
    setBodyImages(prev => prev.filter((_, i) => i !== index));
    setBodyImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('lead-images')
        .upload(path, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('lead-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileImageUrl = null;
      let bodyImageUrls: string[] = [];

      // Upload profile image
      if (profileImage) {
        const timestamp = Date.now();
        const profilePath = `profile/${timestamp}_${profileImage.name}`;
        profileImageUrl = await uploadImage(profileImage, profilePath);
      }

      // Upload body images
      if (bodyImages.length > 0) {
        const uploadPromises = bodyImages.map(async (file, index) => {
          const timestamp = Date.now();
          const bodyPath = `body/${timestamp}_${index}_${file.name}`;
          return uploadImage(file, bodyPath);
        });

        const results = await Promise.all(uploadPromises);
        bodyImageUrls = results.filter(url => url !== null) as string[];
      }

      // Calculate IMC if weight and height are provided
      let imc = null;
      if (formData.peso && formData.altura) {
        const weight = parseFloat(formData.peso);
        const height = parseFloat(formData.altura) / 100; // Convert cm to m
        imc = (weight / (height * height)).toFixed(1);
      }

      // Map objetivo values to match database format
      const objetivoMap: Record<string, string> = {
        "perda-peso": "Perda de Peso",
        "ganho-massa": "Ganho de Massa",
        "manutencao": "Manutenção",
        "outros": "Outros"
      };

      const leadData = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email || null,
        objetivo: objetivoMap[formData.objetivo] || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        peso: formData.peso || null,
        altura: formData.altura || null,
        imc: imc,
        anotacoes: formData.anotacoes || null,
        foto_perfil: profileImageUrl,
        status: "novo",
        progresso: 0,
      };

      await createLead.mutateAsync(leadData);

      toast({
        title: "Lead criado com sucesso!",
        description: "O novo lead foi adicionado ao sistema.",
      });

      // Reset form
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        objetivo: "",
        cidade: "",
        estado: "",
        peso: "",
        altura: "",
        anotacoes: "",
      });
      setProfileImage(null);
      setProfileImagePreview(null);
      setBodyImages([]);
      setBodyImagePreviews([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Erro ao criar lead",
        description: "Ocorreu um erro ao criar o lead. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select onValueChange={(value) => setFormData({...formData, objetivo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perda-peso">Perda de Peso</SelectItem>
                  <SelectItem value="ganho-massa">Ganho de Massa</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                placeholder="Digite a cidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select onValueChange={(value) => setFormData({...formData, estado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                placeholder="70.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                value={formData.altura}
                onChange={(e) => setFormData({...formData, altura: e.target.value})}
                placeholder="175"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anotacoes">Anotações</Label>
            <Input
              id="anotacoes"
              value={formData.anotacoes}
              onChange={(e) => setFormData({...formData, anotacoes: e.target.value})}
              placeholder="Observações importantes sobre o lead"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Foto de Perfil</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {profileImagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={profileImagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-full mx-auto"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setProfileImage(null);
                        setProfileImagePreview(null);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Clique para adicionar foto</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                      id="profile-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Foto
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Fotos do Corpo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {bodyImagePreviews.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {bodyImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Body ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-5 h-5 p-0"
                            onClick={() => removeBodyImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBodyImagesChange}
                      className="hidden"
                      id="body-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('body-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Adicionar Mais
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Fotos para antes/depois</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBodyImagesChange}
                      className="hidden"
                      id="body-upload-initial"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('body-upload-initial')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Fotos
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
