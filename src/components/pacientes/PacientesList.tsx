
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Trash, Calendar, MessageSquare, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Paciente } from "@/hooks/usePacientes";

interface PacientesListProps {
  pacientes: Paciente[];
  viewMode: 'grid' | 'list';
  onSelectPatient: (patient: Paciente) => void;
  onEditPatient: (patient: Paciente) => void;
  onDeletePatient: (patient: Paciente) => void;
}

export const PacientesList = ({ 
  pacientes, 
  viewMode,
  onSelectPatient,
  onEditPatient,
  onDeletePatient
}: PacientesListProps) => {
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
      case 'edit':
        onEditPatient(paciente);
        break;
      case 'archive':
        console.log('Arquivar paciente:', paciente.lead.nome);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {pacientes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {pacientes.map(paciente => (
            <Card 
              key={paciente.id} 
              className="p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-gray-200 hover:border-purple-300" 
              onClick={() => onSelectPatient(paciente)}
            >
              <div className="flex items-center gap-4">
                <Checkbox 
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-purple-500"
                />

                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                    <AvatarImage src={paciente.lead.foto_perfil} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500 text-white font-semibold">
                      {paciente.lead.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getProgressColor(paciente.lead.progresso)} border-2 border-white`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate">{paciente.lead.nome}</p>
                    <span className="text-xs text-gray-500">{paciente.lead.progresso || 0}%</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {paciente.lead.telefone}
                  </p>
                  
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {paciente.lead.objetivo_tag && (
                      <Badge 
                        className="text-xs text-white"
                        style={{ backgroundColor: paciente.lead.objetivo_tag.cor }}
                      >
                        {paciente.lead.objetivo_tag.nome}
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getStatusColor(paciente.status_tratamento)}`}>
                      {paciente.status_tratamento === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  {/* Informações adicionais */}
                  <div className="mt-2 text-xs text-gray-500">
                    {paciente.lead.ultima_consulta && (
                      <div>Última consulta: {new Date(paciente.lead.ultima_consulta).toLocaleDateString('pt-BR')}</div>
                    )}
                    {paciente.lead.proxima_consulta && (
                      <div>Próxima: {new Date(paciente.lead.proxima_consulta).toLocaleDateString('pt-BR')}</div>
                    )}
                  </div>
                </div>

                {/* Botões de ação rápida */}
                <div className="flex flex-col gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleQuickAction('schedule', paciente, e)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar Consulta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('message', paciente, e)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('call', paciente, e)}>
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('edit', paciente, e)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('archive', paciente, e)}>
                        Arquivar
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
