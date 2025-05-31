
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, X, Send } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ContactInfo {
  name: string;
  phone: string;
}

export const WhatsAppChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const { toast } = useToast();

  const handleContactSubmit = (info: ContactInfo) => {
    setContactInfo(info);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: `Obrigado, ${info.name}! Agora você pode conversar comigo. Para um atendimento mais completo, clique em "Continuar no WhatsApp" a qualquer momento.`,
      isUser: false,
      timestamp: new Date(),
    }]);
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Resposta automática simples
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Obrigado pela sua mensagem! Para um atendimento mais rápido e completo, clique em 'Continuar no WhatsApp' abaixo.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const openWhatsApp = () => {
    if (!contactInfo) return;

    const conversation = messages
      .filter(msg => msg.isUser)
      .map(msg => msg.text)
      .join('\n');

    const whatsappMessage = `Olá! Sou ${contactInfo.name}.\n\nConversa iniciada no site:\n${conversation}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Substitua pelo seu número do WhatsApp (formato: 5511999999999)
    const whatsappNumber = "5511999999999"; // Coloque seu número aqui
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Continuaremos a conversa no WhatsApp!",
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
      <Card className="h-full flex flex-col bg-white shadow-xl">
        <CardHeader className="bg-green-500 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WhatsApp" 
                className="w-6 h-6"
              />
              Chat de Atendimento
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {!contactInfo ? (
            <ContactForm onSubmit={handleContactSubmit} />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="border-t p-3 space-y-2">
                <ChatInput onSend={handleSendMessage} />
                <Button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Continuar no WhatsApp
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
