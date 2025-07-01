
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Cake
} from "lucide-react";
import { format } from "date-fns";

interface PatientPersonalInfoCardProps {
  selectedPatient: Paciente;
  onConsultasClick: () => void;
}

export const PatientPersonalInfoCard = ({ 
  selectedPatient, 
  onConsultasClick 
}: PatientPersonalInfoCardProps) => {
  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={selectedPatient.lead.foto_perfil} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
              {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{selectedPatient.lead.nome}</h3>
            <p className="text-gray-600">
              {selectedPatient.lead.idade ? `${selectedPatient.lead.idade} anos` : 'Idade não informada'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{selectedPatient.lead.email || 'Email não informado'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{selectedPatient.lead.telefone}</span>
          </div>

          {selectedPatient.lead.data_nascimento && (
            <div className="flex items-center gap-2 text-gray-700">
              <Cake className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {format(new Date(selectedPatient.lead.data_nascimento), 'dd/MM/yyyy')}
              </span>
            </div>
          )}

          {(selectedPatient.lead.cidade || selectedPatient.lead.estado) && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {[selectedPatient.lead.cidade, selectedPatient.lead.estado].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={onConsultasClick}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Consultas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
