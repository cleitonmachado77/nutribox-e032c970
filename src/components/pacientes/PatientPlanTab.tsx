
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Camera, Video } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";

interface PatientPlanTabProps {
  selectedPatient: Paciente;
}

export const PatientPlanTab = ({ selectedPatient }: PatientPlanTabProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Plano Alimentar Atual</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
            <FileText className="w-4 h-4 mr-2" />
            Editar Plano
          </Button>
          <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
            <Camera className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
          <Button size="sm" variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
            <Video className="w-4 h-4 mr-2" />
            Adicionar Vídeo
          </Button>
        </div>
      </div>
      <Card className="border-2 border-gray-200">
        <CardContent className="p-6">
          <Textarea 
            value={selectedPatient.lead.plano_alimentar} 
            className="min-h-64 border-2 focus:border-indigo-500" 
            placeholder="Digite o plano alimentar do paciente..." 
          />
          <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            Salvar Plano
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
