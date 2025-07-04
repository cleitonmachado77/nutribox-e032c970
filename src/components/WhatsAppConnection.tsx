
import { useState } from 'react';
import { QrCode, Smartphone, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EvolutionInstance } from '@/hooks/useEvolutionAPI';

interface WhatsAppConnectionProps {
  instance: EvolutionInstance | null;
  onConnect: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const WhatsAppConnection = ({ 
  instance, 
  onConnect, 
  onRefresh, 
  loading 
}: WhatsAppConnectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5" />;
      case 'connecting': return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'disconnected': return <AlertCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      default: return 'Não conectado';
    }
  };

  if (!instance) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Conectar WhatsApp</CardTitle>
            <CardDescription>
              Conecte sua conta do WhatsApp para começar a gerenciar suas conversas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onConnect} 
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (instance.status === 'connecting' && instance.qrCode) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" />
              Escaneie o QR Code
            </CardTitle>
            <CardDescription>
              Use o WhatsApp do seu celular para escanear o código
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <img 
                src={instance.qrCode.startsWith('data:') ? instance.qrCode : `data:image/png;base64,${instance.qrCode}`}
                alt="QR Code WhatsApp"
                className="w-64 h-64"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-medium text-center">Como conectar:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em Menu ou Configurações</li>
                <li>Toque em "Aparelhos conectados"</li>
                <li>Toque em "Conectar um aparelho"</li>
                <li>Aponte seu celular para esta tela</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={onRefresh}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            instance.status === 'connected' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className={getStatusColor(instance.status)}>
              {getStatusIcon(instance.status)}
            </div>
          </div>
          <CardTitle className={getStatusColor(instance.status)}>
            {getStatusText(instance.status)}
          </CardTitle>
          <CardDescription>
            {instance.status === 'connected' 
              ? 'Sua conta está conectada e pronta para uso'
              : 'Problemas de conexão detectados'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instance.status !== 'connected' && (
            <Button 
              onClick={onConnect} 
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reconectando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Reconectar
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
