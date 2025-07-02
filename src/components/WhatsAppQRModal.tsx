import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, RefreshCw, CheckCircle, Smartphone } from 'lucide-react';
import { useWhatsAppAPI } from '@/hooks/useWhatsAppAPI';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WhatsAppQRModal = ({ open, onOpenChange }: WhatsAppQRModalProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { generateQRCode, checkConnection } = useWhatsAppAPI();
  const { toast } = useToast();

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const response = await generateQRCode();
      setQrCode(response.qr_code);
      
      // Iniciar verificação periódica de conexão
      const interval = setInterval(async () => {
        const isConnected = await checkConnection();
        if (isConnected) {
          setConnected(true);
          clearInterval(interval);
          toast({
            title: "WhatsApp Conectado!",
            description: "Sua conta foi conectada com sucesso.",
          });
          setTimeout(() => {
            onOpenChange(false);
          }, 2000);
        }
      }, 3000);

      // Limpar interval após 2 minutos
      setTimeout(() => clearInterval(interval), 120000);
    } catch (error: any) {
      console.error('Erro ao gerar QR:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao gerar QR code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Gerar QR automaticamente quando o modal abrir
  useEffect(() => {
    if (open && !qrCode && !connected) {
      handleGenerateQR();
    }
  }, [open]);

  // Resetar estado quando fechar
  useEffect(() => {
    if (!open) {
      setQrCode(null);
      setConnected(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Conectar WhatsApp
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR code com seu WhatsApp para conectar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {connected ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Conectado com sucesso!</h3>
                <p className="text-sm text-green-600">
                  Seu WhatsApp foi conectado e está pronto para uso.
                </p>
              </CardContent>
            </Card>
          ) : qrCode ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-64 h-64 mx-auto bg-white p-4 rounded-lg border flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=png&ecc=M&data=${encodeURIComponent(qrCode)}`}
                        alt="QR Code WhatsApp"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('QR Code loading error');
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEyMCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-medium text-yellow-800 mb-1">⚠️ Modo de Demonstração</p>
                        <p className="text-yellow-700 text-xs">
                          Este é um QR code simulado para demonstração. Em produção, seria necessário integração com WhatsApp Business API oficial.
                        </p>
                      </div>
                      
                      <div className="text-gray-600">
                        <p className="font-medium">Como conectar (simulação):</p>
                        <ol className="list-decimal list-inside space-y-1 text-left mt-1">
                          <li>Este QR code se conectará automaticamente após 10 segundos</li>
                          <li>Para integração real, use WhatsApp Business API</li>
                          <li>A conexão será simulada para demonstração</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleGenerateQR}
                  disabled={loading}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar QR
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <div className="space-y-2">
                  <p className="font-medium">Preparando conexão...</p>
                  <p className="text-sm text-gray-600">
                    Aguarde enquanto geramos seu QR code
                  </p>
                </div>
                {loading && (
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mt-3 text-blue-500" />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};