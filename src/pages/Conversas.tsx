
import { Search, Filter, Plus, Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conversations = [
  {
    id: 1,
    name: "Maria Silva",
    lastMessage: "Bom dia, gostaria de saber mais sobre o processo...",
    time: "12:44",
    unread: 2,
    tags: ["Conectada", "Novo", "Trabalha", "Civil", "Inválida", "VIP"],
    avatar: "MS"
  },
  {
    id: 2,
    name: "João Souza", 
    lastMessage: "Enviei os documentos solicitados.",
    time: "12:44",
    unread: 0,
    tags: ["Operacional", "Finalizado", "Tributário", "Cobrança"],
    avatar: "JS"
  },
  {
    id: 3,
    name: "Ana Paula",
    lastMessage: "Preciso de ajuda com um contrato.",
    time: "12:44",
    unread: 5,
    tags: ["Comercial", "Em Análise", "Administrativo", "Urgente", "Novo Cliente"],
    avatar: "AP"
  },
  {
    id: 4,
    name: "Carlos Lima",
    lastMessage: "Gostaria de alugar mais cidades.",
    time: "12:44",
    unread: 1,
    tags: ["Operacional", "Aguardando Resposta", "Penal", "Ambiental", "Recorrente"],
    avatar: "CL"
  },
  {
    id: 5,
    name: "Beatriz Gomes",
    lastMessage: "Obrigada pelo retorno rápido.",
    time: "12:44",
    unread: 0,
    tags: ["Conectada", "Finalizado", "Civil", "VIP"],
    avatar: "BG"
  }
];

export default function Conversas() {
  return (
    <div className="flex h-screen bg-background">
      {/* Lista de Conversas */}
      <div className="w-96 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Conversas</h2>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Conversa
            </Button>
          </div>
          
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="nao-lidos">Não lidos</TabsTrigger>
              <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contatos..."
                  className="pl-10 bg-background"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </Tabs>
        </div>

        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {conversation.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                      <Button variant="ghost" size="icon" className="w-6 h-6">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="bg-primary">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {conversation.tags.slice(0, 4).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header do Chat */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  MS
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Maria Silva</h3>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">Trabalha</Badge>
              <Badge variant="secondary">Civil</Badge>
              <Badge variant="outline">Editar Tags</Badge>
              <Badge className="bg-blue-500 hover:bg-blue-600">Conectada</Badge>
              <Badge className="bg-green-500 hover:bg-green-600">NOVO</Badge>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-4 bg-background">
          <div className="max-w-2xl">
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">12:44</p>
              <p className="text-foreground">
                Bom dia, gostaria de saber mais sobre o processo.
              </p>
            </div>
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
