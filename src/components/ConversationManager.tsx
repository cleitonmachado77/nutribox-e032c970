
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvolutionAPIComplete } from '@/hooks/useEvolutionAPIComplete';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Users,
  Settings,
  Send,
  Phone,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Image,
  Paperclip,
  MoreVertical
} from 'lucide-react';

export const ConversationManager = () => {
  const {
    instances,
    contacts,
    groups,
    messages,
    selectedInstance,
    loading,
    setSelectedInstance,
    fetchInstances,
    createInstance,
    deleteInstance,
    restartInstance,
    fetchContacts,
    fetchGroups,
    fetchMessages,
    sendTextMessage,
    sendMediaMessage,
    createGroup,
    setWebhook
  } = useEvolutionAPIComplete();

  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newInstanceName, setNewInstanceName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filtrar contatos baseado na busca
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    try {
      await sendTextMessage(selectedContact, newMessage);
      setNewMessage('');
      // Recarregar mensagens
      await fetchMessages(selectedContact);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;

    try {
      await createInstance(newInstanceName);
      setNewInstanceName('');
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedParticipants.length === 0) return;

    try {
      await createGroup(newGroupName, selectedParticipants);
      setNewGroupName('');
      setSelectedParticipants([]);
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Instâncias e Contatos */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">WhatsApp SaaS</h2>
            <Button
              size="sm"
              onClick={fetchInstances}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Seletor de Instância */}
          <Select value={selectedInstance} onValueChange={setSelectedInstance}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar instância" />
            </SelectTrigger>
            <SelectContent>
              {instances.map((instance) => (
                <SelectItem key={instance.name} value={instance.name}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    {instance.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs - Contatos, Grupos, Configurações */}
        <Tabs defaultValue="contacts" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
            <TabsTrigger value="settings">Config</TabsTrigger>
          </TabsList>

          {/* Busca */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="contacts" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact.id);
                      fetchMessages(contact.id);
                    }}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact === contact.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contact.profilePicture} />
                        <AvatarFallback>
                          {contact.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contact.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 m-0">
            <div className="p-4 border-b">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Grupo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Grupo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome do grupo"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <div>
                      <p className="text-sm font-medium mb-2">Participantes:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {contacts.map((contact) => (
                          <label key={contact.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedParticipants.includes(contact.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedParticipants([...selectedParticipants, contact.id]);
                                } else {
                                  setSelectedParticipants(selectedParticipants.filter(p => p !== contact.id));
                                }
                              }}
                            />
                            <span className="text-sm">{contact.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleCreateGroup} disabled={!newGroupName || selectedParticipants.length === 0}>
                      Criar Grupo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setSelectedContact(group.id);
                      fetchMessages(group.id);
                    }}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact === group.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={group.profilePicture} />
                        <AvatarFallback>
                          <Users className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{group.name}</p>
                        <p className="text-sm text-gray-500">
                          {group.participants.length} participantes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0 p-4 space-y-4">
            {/* Gerenciar Instâncias */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Gerenciar Instâncias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da nova instância"
                    value={newInstanceName}
                    onChange={(e) => setNewInstanceName(e.target.value)}
                  />
                  <Button size="sm" onClick={handleCreateInstance}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {instances.map((instance) => (
                    <div key={instance.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">{instance.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => restartInstance(instance.name)}>
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteInstance(instance.name)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Configurar Webhook */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Webhook n8n</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="URL do webhook n8n"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button size="sm" onClick={() => setWebhook(webhookUrl)} disabled={!webhookUrl}>
                  Configurar Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Área Principal - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {(contacts.find(c => c.id === selectedContact)?.name || 
                        groups.find(g => g.id === selectedContact)?.name || 'U').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {contacts.find(c => c.id === selectedContact)?.name || 
                       groups.find(g => g.id === selectedContact)?.name || 'Desconhecido'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedContact.includes('@g.us') ? 'Grupo' : 'Contato'}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.key.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.key.fromMe
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">
                        {message.message?.conversation || 
                         message.message?.extendedTextMessage?.text || 
                         'Mensagem de mídia'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.key.fromMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.messageTimestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Image className="w-4 h-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
              <p>Escolha um contato ou grupo para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
