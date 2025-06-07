
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Phone, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";

interface PacientesListProps {
  pacientes: Paciente[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPatient: Paciente | null;
  setSelectedPatient: (patient: Paciente) => void;
  onDeletePatient: (patient: Paciente) => void;
}

export const PacientesList = ({ 
  pacientes, 
  searchTerm, 
  setSearchTerm, 
  selectedPatient, 
  setSelectedPatient,
  onDeletePatient
}: PacientesListProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-gradient-to-r from-emerald-400 to-green-500";
    if (progress >= 60) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-rose-400 to-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em acompanhamento":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
      case "Consulta agendada":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "Sem interação":
        return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const filteredPatients = pacientes.filter(paciente => 
    paciente.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    paciente.lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    paciente.lead.telefone.includes(searchTerm)
  );

  return (
    <Card className="lg:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-white">Lista de Pacientes ({filteredPatients.length})</CardTitle>
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
          <Button variant="secondary" size="icon" className="bg-white/20 hover:bg-white/30 border-white/30">
            <Filter className="w-4 h-4 text-white" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6 max-h-[600px] overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nenhum paciente encontrado com esse filtro' : 'Nenhum paciente cadastrado'}
          </div>
        ) : (
          filteredPatients.map(paciente => (
            <Card 
              key={paciente.id} 
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-2 ${selectedPatient?.id === paciente.id ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`} 
              onClick={() => setSelectedPatient(paciente)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                    <AvatarImage src={paciente.lead.foto_perfil} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                      {paciente.lead.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getProgressColor(paciente.lead.progresso)} border-2 border-white`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{paciente.lead.nome}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {paciente.lead.telefone}
                  </p>
                  <div className="flex gap-2 mt-2">
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
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePatient(paciente);
                    }}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Excluir paciente permanentemente"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
