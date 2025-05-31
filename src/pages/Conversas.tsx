
import { Header } from "@/components/Header";
import { WhatsAppWebFrame } from "@/components/WhatsAppWebFrame";
import { useEffect } from "react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

export default function Conversas() {
  const { resetUnreadCount } = useWhatsApp();

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <Header 
        title="Conversas WhatsApp" 
        description="Acesse o WhatsApp Web diretamente no seu painel" 
      />
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
              alt="WhatsApp" 
              className="w-8 h-8"
            />
            <div>
              <h3 className="text-white font-semibold">WhatsApp Web Integrado</h3>
              <p className="text-green-100 text-sm">
                Use seu WhatsApp diretamente aqui. Escaneie o QR code com seu telefone para conectar.
              </p>
            </div>
          </div>
        </div>

        <WhatsAppWebFrame />
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Como usar:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Abra o WhatsApp no seu celular</li>
            <li>• Toque em "Mais opções" (três pontos) → "Dispositivos conectados"</li>
            <li>• Toque em "Conectar um dispositivo"</li>
            <li>• Escaneie o QR code que aparece acima</li>
            <li>• Seu WhatsApp estará disponível diretamente aqui!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
