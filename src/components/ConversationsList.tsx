
import { useState } from 'react';
import { Search, Phone, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EvolutionContact } from '@/hooks/useEvolutionAPI';

interface ConversationsListProps {
  contacts: EvolutionContact[];
  selectedContact: EvolutionContact | null;
  onSelectContact: (contact: EvolutionContact) => void;
  loading?: boolean;
}

export const ConversationsList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact,
  loading 
}: ConversationsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="w-1/3 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-green-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          Conversas
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Nenhuma conversa encontrada</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Tente um termo diferente' : 'Suas conversas aparecerão aqui'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.profilePicture} alt={contact.name} />
                      <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                        {contact.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-500 text-xs">
                        {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(contact.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{contact.phone}</span>
                    </div>
                    
                    {contact.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
