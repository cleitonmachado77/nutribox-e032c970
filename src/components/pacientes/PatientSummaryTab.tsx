
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paciente } from "@/hooks/usePacientes";
import { FileBarChart, Download, Stethoscope, Activity, Heart, Brain } from "lucide-react";

interface PatientSummaryTabProps {
  selectedPatient: Paciente;
}

export const PatientSummaryTab = ({ selectedPatient }: PatientSummaryTabProps) => {
  const handleExportSummary = () => {
    // Implementar exportação do resumo
    console.log("Exportando resumo...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resumo Completo do Paciente</h2>
        <Button onClick={handleExportSummary} className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Resumo
        </Button>
      </div>

      {/* Informações Básicas */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dados Pessoais</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Nome:</span> {selectedPatient.lead.nome}</div>
                <div><span className="font-medium">Telefone:</span> {selectedPatient.lead.telefone}</div>
                <div><span className="font-medium">Email:</span> {selectedPatient.lead.email || 'Não informado'}</div>
                <div><span className="font-medium">Localização:</span> {selectedPatient.lead.cidade}, {selectedPatient.lead.estado}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dados Corporais</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Peso:</span> {selectedPatient.lead.peso || 'Não informado'}</div>
                <div><span className="font-medium">Altura:</span> {selectedPatient.lead.altura || 'Não informado'}</div>
                <div><span className="font-medium">IMC:</span> {selectedPatient.lead.imc || 'Não calculado'}</div>
                <div><span className="font-medium">Objetivo:</span> 
                  <Badge className="ml-2 bg-purple-100 text-purple-800">{selectedPatient.lead.objetivo}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Status Atual</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Progresso:</span> {selectedPatient.lead.progresso}%</div>
                <div><span className="font-medium">Status:</span> 
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    {selectedPatient.status_tratamento === 'ativo' ? 'Em Tratamento' : 'Inativo'}
                  </Badge>
                </div>
                <div><span className="font-medium">Última Consulta:</span> {selectedPatient.lead.ultima_consulta ? new Date(selectedPatient.lead.ultima_consulta).toLocaleDateString('pt-BR') : 'Não registrada'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico Clínico Resumo */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Histórico Clínico
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Condições Médicas</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Doenças Pré-existentes:</span> Hipertensão leve</div>
                <div><span className="font-medium">Cirurgias:</span> Nenhuma</div>
                <div><span className="font-medium">Medicamentos:</span> Losartana 50mg</div>
                <div><span className="font-medium">Suplementos:</span> Vitamina D, Ômega 3</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Alergias e Restrições</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Alergias:</span> Frutos do mar</div>
                <div><span className="font-medium">Intolerâncias:</span> Lactose</div>
                <div><span className="font-medium">Histórico Familiar:</span> Diabetes tipo 2, Hipertensão</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avaliação Física */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Avaliação Física
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Peso Atual</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">78kg</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">IMC</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">24.5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">% Gordura Corporal</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">18%</Badge>
              </div>
              <div className="pt-3 border-t">
                <h5 className="font-medium text-sm mb-2">Circunferências</h5>
                <div className="text-sm space-y-1">
                  <div>Cintura: 85cm</div>
                  <div>Quadril: 98cm</div>
                  <div>Braço: 32cm</div>
                  <div>Coxa: 58cm</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avaliação Comportamental */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Avaliação Comportamental
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Consistência do Plano</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">69%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Frequência de Refeições</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Boa</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tempo de Refeição</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Moderado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Vegetais/Frutas</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Excelente</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ingestão de Líquido</span>
                <Badge variant="outline" className="bg-red-50 text-red-700">Baixa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avaliação de Bem-Estar */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Avaliação de Bem-Estar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">Boa</div>
              <div className="text-sm text-gray-600">Energia Física</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">42%</div>
              <div className="text-sm text-gray-600">Atividade Física</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">Baixa</div>
              <div className="text-sm text-gray-600">Qualidade do Sono</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">Média</div>
              <div className="text-sm text-gray-600">Confiança</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano Alimentar Atual */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
          <CardTitle>Plano Alimentar Atual</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Estrutura</h4>
              <div className="space-y-2 text-sm">
                <div>Calorias/dia: 1800 kcal</div>
                <div>Refeições: 6 por dia</div>
                <div>Carboidratos: 45%</div>
                <div>Proteínas: 30%</div>
                <div>Gorduras: 25%</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Preferências</h4>
              <div className="space-y-2 text-sm">
                <div>Refeição preferida: Almoço</div>
                <div>Alimentos favoritos: Frango, Arroz integral</div>
                <div>Evita: Frutos do mar, Laticínios</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Observações</h4>
              <div className="space-y-2 text-sm">
                <div>Limitações: Tempo para cozinhar</div>
                <div>Recursos: Fogão, Micro-ondas</div>
                <div>Objetivo: Emagrecimento</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
