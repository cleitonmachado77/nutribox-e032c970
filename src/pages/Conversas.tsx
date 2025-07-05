
import { Header } from "@/components/Header";
import { ConversationManager } from "@/components/ConversationManager";
import { MixedContentWarning } from "@/components/MixedContentWarning";

export default function Conversas() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 pb-0">
        <Header 
          title="WhatsApp SaaS - Evolution API" 
          description="Plataforma completa para gestão de conversas, contatos e grupos do WhatsApp" 
        />
        <MixedContentWarning />
      </div>
      
      <div className="h-[calc(100vh-140px)]">
        <ConversationManager />
      </div>
    </div>
  );
}
