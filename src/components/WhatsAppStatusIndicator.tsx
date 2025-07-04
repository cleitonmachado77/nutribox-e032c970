import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  QrCode, 
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone
} from 'lucide-react';
import { EvolutionSession } from '@/hooks/useEvolutionSupabase';

interface WhatsAppStatusIndicatorProps {
  session: EvolutionSession | null;
  onRefresh: () => void;
  onConnect: () => void;
  loading: boolean;
}

export const WhatsAppStatusIndicator = ({ 
  session, 
  onRefresh, 
  onConnect, 
  loading 
}: WhatsAppStatusIndicatorProps) => {
  const [timeSinceLastCheck, setTimeSinceLastCheck] = useState<string>('');

  // Atualizar tempo desde a última verificação
  useEffect(() => {
    if (session?.lastChecked) {
      const updateTime = () => {
        const now = new Date();
        const lastCheck = new Date(session.lastChecked!);
        const diffInSeconds = Math.floor((now.getTime() - lastCheck.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
          setTimeSinceLastCheck(`${diffInSeconds}s atrás`);
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          setTimeSinceLastCheck(`${minutes}m atrás`);
        } else {
          const hours = Math.floor(diffInSeconds / 3600);
          setTimeSinceLastCheck(`${hours}h atrás`);
        }
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [session?.lastChecked]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected': return <WifiOff className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default' as const;
      case 'connecting': return 'secondary' as const;
      case 'disconnected': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <div>
                <p className="font-medium text-gray-600">WhatsApp não inicializado</p>
                <p className="text-sm text-gray-500">Clique em conectar para começar</p>
              </div>
            </div>
            <Button 
              onClick={onConnect}
              disabled={loading}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Principal */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)} animate-pulse`}></div>
              <div>
                <p className="font-medium">
                  WhatsApp {getStatusText(session.status)}
                </p>
                <p className="text-sm text-gray-600">
                  Instância: {session.instanceName}
                </p>
                {session.phoneNumber && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {session.phoneNumber}
                  </p>
                )}
                {session.lastChecked && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Verificado {timeSinceLastCheck}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(session.status)}>
                {getStatusIcon(session.status)}
                <span className="ml-1">{getStatusText(session.status)}</span>
              </Badge>
              
              {session.status === 'disconnected' && (
                <Button 
                  onClick={onConnect}
                  disabled={loading}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Reconectar
                    </>
                  )}
                </Button>
              )}
              
              {session.status === 'connected' && (
                <Button 
                  onClick={onRefresh}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Status */}
      {session.status === 'connecting' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <QrCode className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <p className="font-medium">Aguardando conexão</p>
            <p className="text-sm">Escaneie o QR Code com seu WhatsApp para conectar</p>
          </AlertDescription>
        </Alert>
      )}

      {session.status === 'disconnected' && (
        <Alert className="border-red-200 bg-red-50">
          <WifiOff className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <p className="font-medium">WhatsApp desconectado</p>
            <p className="text-sm">Clique em "Reconectar" para estabelecer uma nova conexão</p>
          </AlertDescription>
        </Alert>
      )}

      {session.status === 'connected' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="font-medium">WhatsApp conectado</p>
            <p className="text-sm">Sua conta está ativa e pronta para enviar/receber mensagens</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Informações Técnicas */}
      <Card className="bg-gray-50">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-gray-700">Instância ID</p>
              <p className="text-gray-500 font-mono">{session.id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Status</p>
              <p className="text-gray-500">{session.status}</p>
            </div>
            {session.lastChecked && (
              <div>
                <p className="font-medium text-gray-700">Última Verificação</p>
                <p className="text-gray-500">
                  {new Date(session.lastChecked).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-700">Multi-Tenant</p>
              <p className="text-gray-500">Ativo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 