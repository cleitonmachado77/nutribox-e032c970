
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, ArrowRight, Calendar, BarChart3, Equal } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import { useConsultationData } from "@/hooks/useConsultationData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientComparisonSectionProps {
  patientId: string;
  consultationId: string;
}

interface ConsultationSummaryData {
  consultationId: string;
  consultationNumber: number;
  date: string;
  clinical?: any;
  physical?: any;
  emotional?: any;
  behavioral?: any;
  wellness?: any;
}

export const PatientComparisonSection = ({ patientId, consultationId }: PatientComparisonSectionProps) => {
  const { consultations } = useConsultations(patientId);
  const [selectedConsultation1, setSelectedConsultation1] = useState<string>("");
  const [selectedConsultation2, setSelectedConsultation2] = useState<string>("");
  const [consultationData1, setConsultationData1] = useState<ConsultationSummaryData | null>(null);
  const [consultationData2, setConsultationData2] = useState<ConsultationSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableConsultations = consultations.filter(c => c.status === 'concluida');

  const loadConsultationData = async (consultationId: string): Promise<ConsultationSummaryData | null> => {
    try {
      const consultation = consultations.find(c => c.id === consultationId);
      if (!consultation) return null;

      const [clinicalData, physicalData, emotionalData, behavioralData, wellnessData] = await Promise.all([
        supabase.from('consultation_clinical_history').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        supabase.from('consultation_physical_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        supabase.from('consultation_emotional_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        supabase.from('consultation_behavioral_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        supabase.from('consultation_wellness_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle()
      ]);

      return {
        consultationId: consultation.id,
        consultationNumber: consultation.consultation_number,
        date: new Date(consultation.created_at).toLocaleDateString('pt-BR'),
        clinical: clinicalData.data,
        physical: physicalData.data,
        emotional: emotionalData.data,
        behavioral: behavioralData.data,
        wellness: wellnessData.data
      };
    } catch (error) {
      console.error('Error loading consultation data:', error);
      return null;
    }
  };

  const handleCompare = async () => {
    if (!selectedConsultation1 || !selectedConsultation2) {
      toast.error('Selecione duas consultas para comparar');
      return;
    }

    if (selectedConsultation1 === selectedConsultation2) {
      toast.error('Selecione consultas diferentes para comparar');
      return;
    }

    setIsLoading(true);
    try {
      const [data1, data2] = await Promise.all([
        loadConsultationData(selectedConsultation1),
        loadConsultationData(selectedConsultation2)
      ]);

      setConsultationData1(data1);
      setConsultationData2(data2);
      toast.success('Comparativo gerado com sucesso!');
    } catch (error) {
      console.error('Error comparing consultations:', error);
      toast.error('Erro ao gerar comparativo');
    } finally {
      setIsLoading(false);
    }
  };

  const getNumericValue = (value: string | undefined | null): number | null => {
    if (!value) return null;
    const numericString = value.toString().replace(/[^\d.,]/g, '').replace(',', '.');
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? null : parsed;
  };

  const calculateDifference = (value1: string | undefined | null, value2: string | undefined | null) => {
    const num1 = getNumericValue(value1);
    const num2 = getNumericValue(value2);
    
    if (num1 === null || num2 === null) return null;
    
    const diff = num2 - num1;
    const percentChange = num1 !== 0 ? ((diff / num1) * 100) : 0;
    
    return {
      absolute: diff,
      percent: percentChange,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'equal'
    };
  };

  const renderComparison = (label: string, value1: any, value2: any, unit: string = '') => {
    const diff = calculateDifference(value1, value2);
    
    return (
      <div className="grid grid-cols-5 gap-4 items-center py-2">
        <div className="font-medium text-sm text-gray-700">{label}:</div>
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {value1 || 'N/A'}
          </Badge>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {value2 || 'N/A'}
          </Badge>
        </div>
        <div className="text-center">
          {diff && (
            <div className="flex items-center justify-center gap-1">
              {diff.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
              {diff.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
              {diff.trend === 'equal' && <Equal className="w-4 h-4 text-gray-600" />}
              <span className={`text-xs font-medium ${
                diff.trend === 'up' ? 'text-green-600' : 
                diff.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {diff.absolute > 0 ? '+' : ''}{diff.absolute.toFixed(1)}{unit}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQualitativeComparison = (label: string, value1: any, value2: any) => {
    const hasChange = value1 !== value2;
    
    return (
      <div className="grid grid-cols-5 gap-4 items-center py-2">
        <div className="font-medium text-sm text-gray-700">{label}:</div>
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            {value1 || 'N/A'}
          </Badge>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            {value2 || 'N/A'}
          </Badge>
        </div>
        <div className="text-center">
          {hasChange ? (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Alterado
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600 text-xs">
              Igual
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (availableConsultations.length < 2) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparativo de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 space-y-4">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Consultas Insuficientes</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              É necessário ter pelo menos 2 consultas concluídas para realizar comparativos.
            </p>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {availableConsultations.length} consulta(s) concluída(s)
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparativo de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primeira Consulta
              </label>
              <Select value={selectedConsultation1} onValueChange={setSelectedConsultation1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a primeira consulta" />
                </SelectTrigger>
                <SelectContent>
                  {availableConsultations.map((consultation) => (
                    <SelectItem key={consultation.id} value={consultation.id}>
                      Consulta #{consultation.consultation_number} - {new Date(consultation.created_at).toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segunda Consulta
              </label>
              <Select value={selectedConsultation2} onValueChange={setSelectedConsultation2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a segunda consulta" />
                </SelectTrigger>
                <SelectContent>
                  {availableConsultations.map((consultation) => (
                    <SelectItem key={consultation.id} value={consultation.id}>
                      Consulta #{consultation.consultation_number} - {new Date(consultation.created_at).toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleCompare}
                disabled={!selectedConsultation1 || !selectedConsultation2 || isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? 'Comparando...' : 'Comparar'}
              </Button>
            </div>
          </div>

          {consultationData1 && consultationData2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Critério</div>
                <div className="text-center">Consulta #{consultationData1.consultationNumber}</div>
                <div className="text-center">→</div>
                <div className="text-center">Consulta #{consultationData2.consultationNumber}</div>
                <div className="text-center">Evolução</div>
              </div>

              {/* Avaliação Física */}
              {(consultationData1.physical || consultationData2.physical) && (
                <Card className="border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg py-3">
                    <CardTitle className="text-lg">Avaliação Física</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {renderComparison('Peso', consultationData1.physical?.peso_atual, consultationData2.physical?.peso_atual, 'kg')}
                    {renderComparison('Altura', consultationData1.physical?.altura, consultationData2.physical?.altura, 'cm')}
                    {renderComparison('IMC', consultationData1.physical?.imc, consultationData2.physical?.imc)}
                    {renderComparison('Gordura Corporal', consultationData1.physical?.gordura_corporal, consultationData2.physical?.gordura_corporal, '%')}
                    {renderComparison('Cintura', consultationData1.physical?.circunferencia_cintura, consultationData2.physical?.circunferencia_cintura, 'cm')}
                    {renderComparison('Quadril', consultationData1.physical?.circunferencia_quadril, consultationData2.physical?.circunferencia_quadril, 'cm')}
                    {renderComparison('Braço', consultationData1.physical?.circunferencia_braco, consultationData2.physical?.circunferencia_braco, 'cm')}
                    {renderComparison('Coxa', consultationData1.physical?.circunferencia_coxa, consultationData2.physical?.circunferencia_coxa, 'cm')}
                  </CardContent>
                </Card>
              )}

              {/* Avaliação Emocional */}
              {(consultationData1.emotional || consultationData2.emotional) && (
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg py-3">
                    <CardTitle className="text-lg">Avaliação Emocional</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {renderQualitativeComparison('Relação com Comida', consultationData1.emotional?.relationship_with_food, consultationData2.emotional?.relationship_with_food)}
                    {renderQualitativeComparison('Estado Emocional', consultationData1.emotional?.emotional_state, consultationData2.emotional?.emotional_state)}
                    {renderQualitativeComparison('Nível de Estresse', consultationData1.emotional?.stress_level, consultationData2.emotional?.stress_level)}
                    {renderQualitativeComparison('Ansiedade Alimentar', consultationData1.emotional?.food_anxiety, consultationData2.emotional?.food_anxiety)}
                  </CardContent>
                </Card>
              )}

              {/* Avaliação Comportamental */}
              {(consultationData1.behavioral || consultationData2.behavioral) && (
                <Card className="border-2 border-yellow-200">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg py-3">
                    <CardTitle className="text-lg">Avaliação Comportamental</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {renderQualitativeComparison('Consistência do Plano', consultationData1.behavioral?.plan_consistency, consultationData2.behavioral?.plan_consistency)}
                    {renderQualitativeComparison('Frequência das Refeições', consultationData1.behavioral?.meal_frequency, consultationData2.behavioral?.meal_frequency)}
                    {renderQualitativeComparison('Tempo de Refeição', consultationData1.behavioral?.meal_time, consultationData2.behavioral?.meal_time)}
                    {renderQualitativeComparison('Vegetais/Frutas', consultationData1.behavioral?.vegetable_fruits, consultationData2.behavioral?.vegetable_fruits)}
                    {renderQualitativeComparison('Ingestão de Líquidos', consultationData1.behavioral?.fluid_intake, consultationData2.behavioral?.fluid_intake)}
                  </CardContent>
                </Card>
              )}

              {/* Avaliação de Bem-estar */}
              {(consultationData1.wellness || consultationData2.wellness) && (
                <Card className="border-2 border-pink-200">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg py-3">
                    <CardTitle className="text-lg">Avaliação de Bem-estar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {renderQualitativeComparison('Imagem Corporal', consultationData1.wellness?.body_image, consultationData2.wellness?.body_image)}
                    {renderQualitativeComparison('Energia Física', consultationData1.wellness?.physical_energy, consultationData2.wellness?.physical_energy)}
                    {renderQualitativeComparison('Atividade Física', consultationData1.wellness?.physical_activity, consultationData2.wellness?.physical_activity)}
                    {renderQualitativeComparison('Qualidade do Sono', consultationData1.wellness?.sleep, consultationData2.wellness?.sleep)}
                    {renderQualitativeComparison('Confiança na Jornada', consultationData1.wellness?.journey_confidence, consultationData2.wellness?.journey_confidence)}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
