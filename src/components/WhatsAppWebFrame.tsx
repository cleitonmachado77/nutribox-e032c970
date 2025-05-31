
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WhatsAppWebFrame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    toast({
      title: "WhatsApp Web carregado!",
      description: "Escaneie o QR code com seu telefone para conectar",
    });
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    toast({
      title: "Erro ao carregar WhatsApp Web",
      description: "Use o botão 'Abrir em nova aba' para acessar diretamente",
      variant: "destructive",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Recarregando WhatsApp Web...",
      description: "Por favor, aguarde",
    });
  };

  const openInNewTab = () => {
    window.open('https://web.whatsapp.com', '_blank');
    toast({
      title: "WhatsApp Web aberto em nova aba",
      description: "Continue usando o WhatsApp na nova aba aberta",
    });
  };

  // Detecta se o iframe foi bloqueado após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 segundos timeout

    return () => clearTimeout(timer);
  }, [refreshKey, isLoading]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
              alt="WhatsApp" 
              className="w-6 h-6"
            />
            WhatsApp Web
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`relative ${isExpanded ? 'h-[800px]' : 'h-[600px]'} transition-all duration-300`}>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-green-500 animate-spin mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Carregando WhatsApp Web...</h3>
                <p className="text-gray-400 text-sm">
                  Aguarde enquanto carregamos a interface do WhatsApp
                </p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Não foi possível carregar o WhatsApp Web</h3>
                <p className="text-gray-400 text-sm mb-4">
                  O WhatsApp Web não permite ser carregado dentro de outros sites por questões de segurança.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={openInNewTab}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir WhatsApp Web em Nova Aba
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </div>
          )}

          <iframe
            key={refreshKey}
            src="https://web.whatsapp.com"
            className="w-full h-full border-0 rounded-b-lg"
            onLoad={handleLoad}
            onError={handleError}
            title="WhatsApp Web"
            allow="camera; microphone"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-top-navigation"
          />
        </div>
      </CardContent>
    </Card>
  );
};
