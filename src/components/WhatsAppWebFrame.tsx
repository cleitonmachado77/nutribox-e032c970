
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Maximize2, Minimize2, AlertTriangle, Smartphone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WhatsAppWebFrame = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const openInNewTab = () => {
    window.open('https://web.whatsapp.com', '_blank');
    toast({
      title: "WhatsApp Web aberto em nova aba",
      description: "Continue usando o WhatsApp na nova aba aberta",
    });
  };

  const openInNewWindow = () => {
    const features = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no';
    window.open('https://web.whatsapp.com', 'whatsapp', features);
    toast({
      title: "WhatsApp Web aberto em nova janela",
      description: "Uma janela dedicada foi aberta para o WhatsApp",
    });
  };

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
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`space-y-6 ${isExpanded ? 'min-h-[600px]' : ''}`}>
          {/* Informação sobre limitação */}
          <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-400 font-medium mb-1">Limitação de Segurança</h4>
                <p className="text-yellow-200 text-sm">
                  O WhatsApp Web não permite ser carregado dentro de outros sites por questões de segurança. 
                  Use os botões abaixo para acessar o WhatsApp em uma nova aba ou janela.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de acesso */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={openInNewTab}
              className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col gap-2"
            >
              <ExternalLink className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Abrir em Nova Aba</div>
                <div className="text-xs opacity-90">Recomendado</div>
              </div>
            </Button>

            <Button
              onClick={openInNewWindow}
              variant="outline"
              className="h-20 border-gray-600 text-gray-300 hover:bg-gray-700 flex flex-col gap-2"
            >
              <Maximize2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Abrir em Janela</div>
                <div className="text-xs opacity-90">Dedicada</div>
              </div>
            </Button>
          </div>

          {/* Instruções de uso */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Como conectar seu WhatsApp:
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <span>1. Abra o WhatsApp no seu celular</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-green-400" />
                <span>2. Toque em "Mais opções" (⋮) → "Dispositivos conectados"</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-green-400" />
                <span>3. Toque em "Conectar um dispositivo"</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-green-400" />
                <span>4. Escaneie o QR code que aparece na nova aba/janela</span>
              </div>
            </div>
          </div>

          {/* Vantagens da solução */}
          <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Vantagens desta solução:</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Interface original e completa do WhatsApp Web</li>
              <li>• Todas as funcionalidades disponíveis (envio de arquivos, áudio, etc.)</li>
              <li>• Sincronização em tempo real com seu telefone</li>
              <li>• Segurança mantida pelo WhatsApp</li>
              <li>• Não requer configurações adicionais</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
