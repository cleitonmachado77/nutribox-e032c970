
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Smartphone, Wifi, RefreshCw } from "lucide-react";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

interface WhatsAppQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectionSuccess: () => void;
}

export const WhatsAppQRModal = ({ open, onOpenChange, onConnectionSuccess }: WhatsAppQRModalProps) => {
  const { generateQRCode, checkConnection } = useWhatsAppAPI();
  const { setIsConnected } = useWhatsApp();
  const [qrCode, setQrCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(1);
  const [error, setError] = useState("");

  // Gerar QR code real
  const handleGenerateQRCode = async () => {
    try {
      setIsConnecting(true);
      setConnectionStep(1);
      setError("");
      
      console.log('Generating QR code...');
      const qrCodeData = await generateQRCode();
      console.log('QR code generated:', qrCodeData);
      
      setQrCode(qrCodeData);
      setConnectionStep(2);
      setIsConnecting(false);

      // Verificar conexão periodicamente
      const checkInterval = setInterval(async () => {
        try {
          const isConnected = await checkConnection();
          console.log('Connection status:', isConnected);
          
          if (isConnected) {
            clearInterval(checkInterval);
            setConnectionStep(3);
            setIsConnected(true);
            
            setTimeout(() => {
              onConnectionSuccess();
              onOpenChange(false);
              setConnectionStep(1);
              setQrCode("");
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }, 3000); // Verificar a cada 3 segundos

      // Limpar intervalo após 5 minutos
      setTimeout(() => {
        clearInterval(checkInterval);
        if (connectionStep === 2) {
          setError("QR Code expirado. Gere um novo código.");
          setConnectionStep(1);
        }
      }, 300000); // 5 minutos

    } catch (error) {
      console.error('Error generating QR code:', error);
      setError("Erro ao gerar QR Code. Tente novamente.");
      setIsConnecting(false);
      setConnectionStep(1);
    }
  };

  useEffect(() => {
    if (open) {
      handleGenerateQRCode();
    } else {
      // Reset state when modal closes
      setConnectionStep(1);
      setQrCode("");
      setError("");
    }
  }, [open]);

  const steps = [
    {
      number: 1,
      title: "Gerando QR Code",
      description: "Aguarde enquanto geramos seu código QR...",
      icon: RefreshCw,
      active: connectionStep === 1
    },
    {
      number: 2,
      title: "Escaneie o Código",
      description: "Use seu WhatsApp para escanear o código QR",
      icon: QrCode,
      active: connectionStep === 2
    },
    {
      number: 3,
      title: "Conectando",
      description: "Estabelecendo conexão com WhatsApp Web...",
      icon: Wifi,
      active: connectionStep === 3
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            Conectar WhatsApp Web
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.active ? 'bg-green-500' : connectionStep > step.number ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <step.icon className={`w-5 h-5 ${step.active && connectionStep === 1 ? 'animate-spin' : ''} text-white`} />
                </div>
                <span className="text-xs text-gray-300 mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>

          {/* QR Code Display */}
          {connectionStep === 2 && qrCode && (
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center p-4">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                      alt="WhatsApp QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-white mb-2">Como conectar:</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span>1. Abra o WhatsApp no seu celular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>2. Toque em "Mais opções" ou "Configurações"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        <span>3. Selecione "WhatsApp Web"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>4. Escaneie este código QR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Success */}
          {connectionStep === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Conectado com sucesso!</h3>
              <p className="text-gray-300 text-sm">Seu WhatsApp está agora conectado. Você pode gerenciar suas conversas.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            {(connectionStep === 1 || error) && (
              <Button 
                onClick={handleGenerateQRCode}
                disabled={isConnecting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isConnecting ? 'animate-spin' : ''}`} />
                {error ? 'Tentar Novamente' : 'Gerar QR Code'}
              </Button>
            )}
            {connectionStep === 2 && !error && (
              <Button 
                onClick={handleGenerateQRCode}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Novo QR
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
