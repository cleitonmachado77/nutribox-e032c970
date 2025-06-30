
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

interface PatientComparisonSectionProps {
  patientId: string;
  consultationId: string;
}

export const PatientComparisonSection = ({ patientId, consultationId }: PatientComparisonSectionProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Comparativo de Consultas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-12 space-y-4">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Calendar className="w-12 h-12 text-indigo-300" />
            <BarChart3 className="w-12 h-12 text-purple-300" />
            <TrendingUp className="w-12 h-12 text-indigo-300" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800">Funcionalidade em Desenvolvimento</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Esta seção permitirá comparar dados entre diferentes consultas do paciente, 
            mostrando a evolução dos indicadores ao longo do tempo.
          </p>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Recursos Planejados:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Comparação de medidas corporais</li>
              <li>• Evolução dos objetivos</li>
              <li>• Progresso comportamental</li>
              <li>• Gráficos de tendências</li>
              <li>• Relatórios de evolução</li>
            </ul>
          </div>
          
          <Button variant="outline" disabled className="mt-4">
            Aguarde a próxima atualização
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
