import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useTwilioAPI } from '@/hooks/useTwilioAPI';

interface TwilioNumberSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TwilioNumberSetup = ({ open, onOpenChange }: TwilioNumberSetupProps) => {
  const [consultorioNome, setConsultorioNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioningSuccess, setProvisioningSuccess] = useState(false);
  
  const { provisionNumber, loading } = useTwilioAPI();

  const handleProvision = async () => {
    if (!consultorioNome.trim()) return;

    setIsProvisioning(true);
    try {
      await provisionNumber(consultorioNome, cidade);
      setProvisioningSuccess(true);
      
      setTimeout(() => {
        onOpenChange(false);
        setProvisioningSuccess(false);
        setConsultorioNome('');
        setCidade('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao provisionar número:', error);
    } finally {
      setIsProvisioning(false);
    }
  };

  // Reset state when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isProvisioning) {
      setConsultorioNome('');
      setCidade('');
      setProvisioningSuccess(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Configurar WhatsApp Business
          </DialogTitle>
          <DialogDescription>
            Configure seu consultório para receber um número WhatsApp exclusivo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {provisioningSuccess ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Número configurado!</h3>
                <p className="text-sm text-green-600">
                  Seu WhatsApp Business foi configurado com sucesso e já está pronto para uso.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultorio" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Nome do Consultório *
                  </Label>
                  <Input
                    id="consultorio"
                    placeholder="Ex: Clínica NutriSaúde"
                    value={consultorioNome}
                    onChange={(e) => setConsultorioNome(e.target.value)}
                    disabled={isProvisioning || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Cidade (opcional)
                  </Label>
                  <Input
                    id="cidade"
                    placeholder="Ex: São Paulo - SP"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    disabled={isProvisioning || loading}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🚀 Como funciona:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Um número WhatsApp exclusivo será provisionado para você</li>
                  <li>• Seus pacientes poderão conversar diretamente pelo WhatsApp</li>
                  <li>• Todas as conversas ficam organizadas na plataforma</li>
                  <li>• Número gratuito para testes e desenvolvimento</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleProvision}
                  disabled={!consultorioNome.trim() || isProvisioning || loading}
                  className="flex-1"
                >
                  {isProvisioning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Configurando...
                    </>
                  ) : (
                    'Configurar WhatsApp'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenChange(false)}
                  disabled={isProvisioning}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};