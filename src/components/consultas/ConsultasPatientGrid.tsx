
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, MoreVertical, Calendar, MessageSquare, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Paciente } from "@/hooks/usePacientes";

interface ConsultasPatientGridProps {
  pacientes: Paciente[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectPatient: (patient: Paciente) => void;
  onDeletePatient: (patient: Paciente) => void;
  viewMode: 'grid' | 'list';
}

export const ConsultasPatientGrid = ({ 
  pacientes, 
  searchTerm, 
  setSearchTerm, 
  onSelectPatient,
  onDeletePatient,
  viewMode
}: ConsultasPatientGridProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (progress >= 60) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-rose-400 to-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "pausado":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "inativo":
        return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const handleQuickAction = (action: string, paciente: Paciente, event: React.MouseEvent) => {
    event.stopPropagation();
    
    switch (action) {
      case 'schedule':
        console.log('Agendar consulta para:', paciente.lead.nome);
        break;
      case 'message':
        console.log('Enviar mensagem para:', paciente.lead.nome);
        break;
      case 'call':
        console.log('Ligar para:', paciente.lead.nome);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de busca */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-white flex items-center justify-between">
            <span>Pacientes ({pacientes.length})</span>
          </CardTitle>
          <div className="flex gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
              <Input 
                placeholder="Buscar pacientes..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-200" 
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid horizontal de pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pacientes.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            {searchTerm ? 'Nenhum paciente encontrado com esse filtro' : 'Nenhum paciente cadastrado'}
          </div>
        ) : (
          pacientes.map(paciente => (
            <Card 
              key={paciente.id} 
              className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-indigo-300 bg-white/90 backdrop-blur-sm"
              onClick={() => onSelectPatient(paciente)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar e indicador de progresso */}
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                      <AvatarImage src={paciente.lead.foto_perfil} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold text-lg">
                        {paciente.lead.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getProgressColor(paciente.lead.progresso || 0)} border-2 border-white`}>
                      {paciente.lead.progresso || 0}%
                    </div>
                  </div>

                  {/* Informações do paciente */}
                  <div className="text-center space-y-2 w-full">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {paciente.lead.nome}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{paciente.lead.telefone}</span>
                    </div>

                    {/* Status e objetivo */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge className={`text-xs ${getStatusColor(paciente.status_tratamento)}`}>
                        {paciente.status_tratamento === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {paciente.lead.objetivo_tag && (
                        <Badge 
                          className="text-xs text-white"
                          style={{ backgroundColor: paciente.lead.objetivo_tag.cor }}
                        >
                          {paciente.lead.objetivo_tag.nome}
                        </Badge>
                      )}
                    </div>

                    {/* Informações adicionais */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {paciente.lead.ultima_consulta && (
                        <div>Última: {new Date(paciente.lead.ultima_consulta).toLocaleDateString('pt-BR')}</div>
                      )}
                      {paciente.lead.proxima_consulta && (
                        <div>Próxima: {new Date(paciente.lead.proxima_consulta).toLocaleDateString('pt-BR')}</div>
                      )}
                    </div>
                  </div>

                  {/* Botões de ação rápida */}
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => handleQuickAction('schedule', paciente, e)}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => handleQuickAction('message', paciente, e)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleQuickAction('call', paciente, e)}>
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePatient(paciente);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
