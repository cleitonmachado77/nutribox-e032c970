
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";

interface PatientPhotosTabProps {
  selectedPatient: Paciente;
}

export const PatientPhotosTab = ({ selectedPatient }: PatientPhotosTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-gray-200">
            <AvatarImage src={selectedPatient.lead.foto_perfil} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
              {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
            <Camera className="w-4 h-4 mr-2" />
            Alterar Foto
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Fotos do Corpo (Antes/Depois)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
            <Camera className="w-4 h-4 mr-2" />
            Adicionar Fotos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
