
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Paciente } from "@/hooks/usePacientes";
import { TrendingUp, TrendingDown, Minus, Download, BarChart3 } from "lucide-react";

interface PatientComparisonTabProps {
  selectedPatient: Paciente;
}

export const PatientComparisonTab = ({ selectedPatient }: PatientComparisonTabProps) => {
  const [consultaA, setConsultaA] = useState<string>("");
  const [consultaB, setConsultaB] = useState<string>("");

  // Simulação de consultas disponíveis
  const consultas = [
    { id: "1", date: "2024-01-15", label: "Consulta 1 - 15/01/2024" },
    { id: "2", date: "2024-01-08", label: "Consulta 2 - 08/01/2024" },
    { id: "3", date: "2024-01-01", label: "Consulta Inicial - 01/01/2024" }
  ];

  // Dados simulados para comparação
  const comparisonData = {
    "1": {
      peso: 78,
      imc: 24.5,
      gordura: 18,
      circunferencia_cintura: 85,
      circunferencia_quadril: 98,
      consistencia_plano: 75,
      energia_fisica: 3,
      qualidade_sono: 2,
      atividade_fisica: 60,
      confianca: 3
    },
    "2": {
      peso: 80,
      imc: 25.1,
      gordura: 20,
      circunferencia_cintura: 87,
      circunferencia_quadril: 100,
      consistencia_plano: 65,
      energia_fisica: 2,
      qualidade_sono: 2,
      atividade_fisica: 40,
      confianca: 2
    },
    "3": {
      peso: 85,
      imc: 26.7,
      gordura: 25,
      circunferencia_cintura: 92,
      circunferencia_quadril: 105,
      consistencia_plano: 45,
      energia_fisica: 1,
      qualidade_sono: 1,
      atividade_fisica: 20,
      confianca: 2
    }
  };

  const getEvolutionIcon = (valueA: number, valueB: number, isPositiveGood: boolean = true) => {
    const diff = valueA - valueB;
    if (diff === 0) return <Minus className="w-4 h-4 text-gray-500" />;
    
    const isImprovement = isPositiveGood ? diff > 0 : diff < 0;
    return isImprovement ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getEvolutionColor = (valueA: number, valueB: number, isPositiveGood: boolean = true) => {
    const diff = valueA - valueB;
    if (diff === 0) return "text-gray-600";
    
    const isImprovement = isPositiveGood ? diff > 0 : diff < 0;
    return isImprovement ? "text-green-600" : "text-red-600";
  };

  const getDifference = (valueA: number, valueB: number) => {
    const diff = valueA - valueB;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  const handleExportComparison = () => {
    console.log("Exportando comparativo...");
  };

  const canCompare = consultaA && consultaB && consultaA !== consultaB;
  const dataA = consultaA ? comparisonData[consultaA as keyof typeof comparisonData] : null;
  const dataB = consultaB ? comparisonData[consultaB as keyof typeof comparisonData] : null;

  return (
    <div className="space-y-6">
      {/* Seleção de Consultas */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparativo entre Consultas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Consulta A</label>
              <Select value={consultaA} onValueChange={setConsultaA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar consulta..." />
                </SelectTrigger>
                <SelectContent>
                  {consultas.map((consulta) => (
                    <SelectItem key={consulta.id} value={consulta.id}>
                      {consulta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Consulta B</label>
              <Select value={consultaB} onValueChange={setConsultaB}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar consulta..." />
                </SelectTrigger>
                <SelectContent>
                  {consultas.map((consulta) => (
                    <SelectItem key={consulta.id} value={consulta.id}>
                      {consulta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleExportComparison} 
              disabled={!canCompare}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Comparativo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo */}
      {canCompare && dataA && dataB && (
        <div className="space-y-6">
          {/* Dados Físicos */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle>Comparativo Físico</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Peso (kg)</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.peso} → {dataB.peso}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.peso, dataA.peso, false)}`}>
                      {getEvolutionIcon(dataB.peso, dataA.peso, false)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.peso, dataA.peso)} kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">IMC</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.imc} → {dataB.imc}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.imc, dataA.imc, false)}`}>
                      {getEvolutionIcon(dataB.imc, dataA.imc, false)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.imc, dataA.imc)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">% Gordura</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.gordura}% → {dataB.gordura}%</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.gordura, dataA.gordura, false)}`}>
                      {getEvolutionIcon(dataB.gordura, dataA.gordura, false)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.gordura, dataA.gordura)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Cintura (cm)</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.circunferencia_cintura} → {dataB.circunferencia_cintura}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.circunferencia_cintura, dataA.circunferencia_cintura, false)}`}>
                      {getEvolutionIcon(dataB.circunferencia_cintura, dataA.circunferencia_cintura, false)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.circunferencia_cintura, dataA.circunferencia_cintura)} cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Comportamentais */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
              <CardTitle>Comparativo Comportamental</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Consistência do Plano (%)</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.consistencia_plano}% → {dataB.consistencia_plano}%</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.consistencia_plano, dataA.consistencia_plano)}`}>
                      {getEvolutionIcon(dataB.consistencia_plano, dataA.consistencia_plano)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.consistencia_plano, dataA.consistencia_plano)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Atividade Física (%)</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.atividade_fisica}% → {dataB.atividade_fisica}%</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.atividade_fisica, dataA.atividade_fisica)}`}>
                      {getEvolutionIcon(dataB.atividade_fisica, dataA.atividade_fisica)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.atividade_fisica, dataA.atividade_fisica)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados de Bem-Estar */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle>Comparativo de Bem-Estar</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Energia Física</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.energia_fisica} → {dataB.energia_fisica}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.energia_fisica, dataA.energia_fisica)}`}>
                      {getEvolutionIcon(dataB.energia_fisica, dataA.energia_fisica)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.energia_fisica, dataA.energia_fisica)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Qualidade do Sono</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.qualidade_sono} → {dataB.qualidade_sono}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.qualidade_sono, dataA.qualidade_sono)}`}>
                      {getEvolutionIcon(dataB.qualidade_sono, dataA.qualidade_sono)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.qualidade_sono, dataA.qualidade_sono)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Confiança na Jornada</h4>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{dataA.confianca} → {dataB.confianca}</div>
                    <div className={`flex items-center justify-center gap-1 ${getEvolutionColor(dataB.confianca, dataA.confianca)}`}>
                      {getEvolutionIcon(dataB.confianca, dataA.confianca)}
                      <span className="text-sm font-medium">
                        {getDifference(dataB.confianca, dataA.confianca)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo da Evolução */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle>Resumo da Evolução</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Melhorias Identificadas:</h4>
                  <ul className="space-y-2">
                    {dataB.peso < dataA.peso && (
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Redução de peso: {(dataA.peso - dataB.peso).toFixed(1)}kg</span>
                      </li>
                    )}
                    {dataB.consistencia_plano > dataA.consistencia_plano && (
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Melhora na consistência do plano: +{dataB.consistencia_plano - dataA.consistencia_plano}%</span>
                      </li>
                    )}
                    {dataB.energia_fisica > dataA.energia_fisica && (
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Aumento da energia física</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Pontos de Atenção:</h4>
                  <ul className="space-y-2">
                    {dataB.peso >= dataA.peso && (
                      <li className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Peso mantido ou aumentado</span>
                      </li>
                    )}
                    {dataB.qualidade_sono <= dataA.qualidade_sono && (
                      <li className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Qualidade do sono necessita atenção</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!canCompare && (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Selecione duas consultas diferentes</h3>
            <p className="text-gray-600">Escolha duas consultas para visualizar o comparativo de evolução do paciente</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
