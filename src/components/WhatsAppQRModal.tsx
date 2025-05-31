
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Smartphone, Wifi, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectionSuccess: () => void;
}

export const WhatsAppQRModal = ({ open, onOpenChange, onConnectionSuccess }: WhatsAppQRModalProps) => {
  const { generateQRCode, checkConnection } = useWhatsAppAPI();
  const { setIsConnected } = useWhatsApp();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStep, setConnectionStep] = useState(1);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const handleGenerateQRCode = async () => {
    try {
      setIsGenerating(true);
      setConnectionStep(1);
      setError("");
      setRetryCount(prev => prev + 1);
      
      console.log(`Tentativa ${retryCount + 1} de geração do QR code...`);
      
      const response = await generateQRCode();
      console.log('Resposta da API:', response);
      
      if (response && response.qr_code) {
        setQrCode(response.qr_code);
        setSessionId(response.session_id || '');
        setConnectionStep(2);
        setIsGenerating(false);

        toast({
          title: "QR Code gerado com sucesso!",
          description: "Escaneie o código com seu WhatsApp para conectar",
        });

        // Verificar conexão a cada 3 segundos
        startConnectionCheck();
      } else {
        throw new Error("Resposta inválida da API - QR code não encontrado");
      }

    } catch (error: any) {
      console.error('Erro detalhado ao gerar QR code:', error);
      const errorMessage = error.message || "Erro desconhecido ao gerar QR code";
      setError(`Erro: ${errorMessage}`);
      setIsGenerating(false);
      setConnectionStep(1);
      
      toast({
        title: "Erro na geração do QR code",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startConnectionCheck = () => {
    const checkInterval = setInterval(async () => {
      try {
        console.log('Verificando status de conexão...');
        const isConnected = await checkConnection();
        console.log('Status de conexão:', isConnected);
        
        if (isConnected) {
          clearInterval(checkInterval);
          setConnectionStep(3);
          setIsConnected(true);
          
          toast({
            title: "WhatsApp conectado!",
            description: "Sua conta foi conectada com sucesso",
          });
          
          setTimeout(() => {
            onConnectionSuccess();
            onOpenChange(false);
            resetModal();
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
      }
    }, 3000);

    // Limpar intervalo após 5 minutos
    setTimeout(() => {
      clearInterval(checkInterval);
      if (connectionStep === 2) {
        setError("QR Code expirado. Gere um novo código.");
        setConnectionStep(1);
        setQrCode("");
        toast({
          title: "QR Code expirado",
          description: "Por favor, gere um novo código",
          variant: "destructive",
        });
      }
    }, 300000);
  };

  const resetModal = () => {
    setConnectionStep(1);
    setQrCode("");
    setError("");
    setSessionId("");
    setRetryCount(0);
  };

  useEffect(() => {
    if (open) {
      resetModal();
      handleGenerateQRCode();
    }
  }, [open]);

  const steps = [
    {
      number: 1,
      title: "Gerando QR Code",
      description: "Preparando conexão com WhatsApp Web...",
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
      title: "Conectado",
      description: "WhatsApp Web conectado com sucesso!",
      icon: CheckCircle2,
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
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-red-400 text-sm font-medium">Erro na conexão</p>
                  <p className="text-red-300 text-xs mt-1">{error}</p>
                  <p className="text-red-300 text-xs mt-1">Tentativa: {retryCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.active ? 'bg-green-500' : connectionStep > step.number ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <step.icon className={`w-5 h-5 ${
                    step.active && connectionStep === 1 && isGenerating ? 'animate-spin' : ''
                  } text-white`} />
                </div>
                <span className="text-xs text-gray-300 mt-1 text-center max-w-20">{step.title}</span>
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
                      onError={(e) => {
                        console.error('Erro ao carregar imagem do QR code');
                        setError("Erro ao exibir QR code");
                      }}
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
                        <span>2. Toque em "Mais opções" (⋮)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        <span>3. Selecione "Dispositivos conectados"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>4. Toque em "Conectar um dispositivo"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>5. Escaneie este código QR</span>
                      </div>
                    </div>
                    {sessionId && (
                      <p className="text-xs text-gray-500 mt-2">
                        ID da sessão: {sessionId.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Success */}
          {connectionStep === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Conectado com sucesso!</h3>
              <p className="text-gray-300 text-sm">
                Seu WhatsApp Web está agora conectado. Você pode gerenciar suas conversas.
              </p>
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
                disabled={isGenerating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {error ? 'Tentar Novamente' : isGenerating ? 'Gerando...' : 'Gerar QR Code'}
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
