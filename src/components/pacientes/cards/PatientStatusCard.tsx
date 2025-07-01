
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Paciente } from "@/hooks/usePacientes";
import { 
  Target, 
  Edit,
  Scale,
  Ruler
} from "lucide-react";

interface PatientStatusCardProps {
  selectedPatient: Paciente;
  getObjetivoColor: (objetivo: string) => string;
  getStatusColor: (status: string) => string;
  getProgressColor: (progress: number) => string;
}

export const PatientStatusCard = ({ 
  selectedPatient, 
  getObjetivoColor,
  getStatusColor,
  getProgressColor
}: PatientStatusCardProps) => {
  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Status e Objetivos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Objetivo Principal:</label>
            <Badge className={`ml-2 ${getObjetivoColor(selectedPatient.lead.objetivo || 'Não definido')}`}>
              {selectedPatient.lead.objetivo || 'Não definido'}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status:</label>
            <Badge className={`ml-2 ${getStatusColor(selectedPatient.lead.status || 'Indefinido')}`}>
              {selectedPatient.lead.status || 'Indefinido'}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Progresso:</label>
            <div className="flex items-center gap-2">
              <Progress 
                value={selectedPatient.lead.progresso || 0} 
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedPatient.lead.progresso || 0}%
              </span>
            </div>
            <div className={`mt-1 h-1 rounded-full ${getProgressColor(selectedPatient.lead.progresso || 0)}`}></div>
          </div>

          {selectedPatient.lead.peso && (
            <div className="flex items-center gap-2 text-gray-700">
              <Scale className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Peso: {selectedPatient.lead.peso} kg</span>
            </div>
          )}

          {selectedPatient.lead.altura && (
            <div className="flex items-center gap-2 text-gray-700">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Altura: {selectedPatient.lead.altura} cm</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
            <Edit className="w-4 h-4 mr-2" />
            Editar Informações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
