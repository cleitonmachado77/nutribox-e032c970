
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useConsultationData } from "@/hooks/useConsultationData";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Heart, Activity, Brain, Stethoscope, Download } from "lucide-react";
import { toast } from "sonner";

interface PatientSummarySectionProps {
  patientId: string;
  consultationId: string;
}

export const PatientSummarySection = ({ patientId, consultationId }: PatientSummarySectionProps) => {
  const { getSavedClinicalHistory, isLoading } = useConsultationData(patientId, consultationId);
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    loadSummaryData();
  }, [patientId, consultationId]);

  const loadSummaryData = async () => {
    try {
      // Carregar dados de todas as seções para o resumo
      const [clinicalData, physicalData, emotionalData, behavioralData, wellnessData] = await Promise.all([
        getSavedClinicalHistory(),
        // Buscar dados físicos
        supabase.from('consultation_physical_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        // Buscar dados emocionais
        supabase.from('consultation_emotional_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        // Buscar dados comportamentais  
        supabase.from('consultation_behavioral_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle(),
        // Buscar dados de bem-estar
        supabase.from('consultation_wellness_assessment').select('*').eq('patient_id', patientId).eq('consultation_id', consultationId).maybeSingle()
      ]);

      setSummaryData({
        clinical: clinicalData,
        physical: physicalData.data,
        emotional: emotionalData.data,
        behavioral: behavioralData.data,
        wellness: wellnessData.data
      });
    } catch (error) {
      console.error('Error loading summary data:', error);
      toast.error('Erro ao carregar dados do resumo');
    }
  };

  const exportSummary = () => {
    if (!summaryData) return;

    const content = generateSummaryContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumo_paciente_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Resumo exportado com sucesso!');
  };

  const generateSummaryContent = () => {
    const { clinical, physical, emotional, behavioral, wellness } = summaryData;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resumo do Paciente</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .section-title { color: #333; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
        .item { margin-bottom: 8px; }
        .label { font-weight: bold; color: #555; }
        .objectives { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px; }
        .objective-badge { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .measurements { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .measurement-item { background: #f9f9f9; padding: 10px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RESUMO DO PACIENTE</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>

    <div class="section">
        <h2 class="section-title">🏥 HISTÓRICO CLÍNICO</h2>
        ${clinical?.pre_existing_conditions ? `<div class="item"><span class="label">Condições Pré-existentes:</span> ${clinical.pre_existing_conditions}</div>` : ''}
        ${clinical?.surgeries ? `<div class="item"><span class="label">Cirurgias:</span> ${clinical.surgeries}</div>` : ''}
        ${clinical?.medications ? `<div class="item"><span class="label">Medicamentos:</span> ${clinical.medications}</div>` : ''}
        ${clinical?.supplements ? `<div class="item"><span class="label">Suplementos:</span> ${clinical.supplements}</div>` : ''}
        ${clinical?.allergies ? `<div class="item"><span class="label">Alergias:</span> ${clinical.allergies}</div>` : ''}
        ${clinical?.family_history ? `<div class="item"><span class="label">Histórico Familiar:</span> ${clinical.family_history}</div>` : ''}
        ${clinical?.hereditary_diseases ? `<div class="item"><span class="label">Doenças Hereditárias:</span> ${clinical.hereditary_diseases}</div>` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">🎯 AVALIAÇÃO FÍSICA</h2>
        <div class="objectives">
            ${physical?.objetivo_estetica ? '<span class="objective-badge">Estética</span>' : ''}
            ${physical?.objetivo_emagrecimento ? '<span class="objective-badge">Emagrecimento</span>' : ''}
            ${physical?.objetivo_saude_longevidade ? '<span class="objective-badge">Saúde e Longevidade</span>' : ''}
            ${physical?.objetivo_performance_esportiva ? '<span class="objective-badge">Performance Esportiva</span>' : ''}
        </div>
        <div class="measurements">
            ${physical?.peso_atual ? `<div class="measurement-item"><span class="label">Peso Atual:</span> ${physical.peso_atual}</div>` : ''}
            ${physical?.altura ? `<div class="measurement-item"><span class="label">Altura:</span> ${physical.altura}</div>` : ''}
            ${physical?.imc ? `<div class="measurement-item"><span class="label">IMC:</span> ${physical.imc}</div>` : ''}
            ${physical?.gordura_corporal ? `<div class="measurement-item"><span class="label">Gordura Corporal:</span> ${physical.gordura_corporal}</div>` : ''}
            ${physical?.circunferencia_cintura ? `<div class="measurement-item"><span class="label">Cintura:</span> ${physical.circunferencia_cintura}</div>` : ''}
            ${physical?.circunferencia_quadril ? `<div class="measurement-item"><span class="label">Quadril:</span> ${physical.circunferencia_quadril}</div>` : ''}
            ${physical?.circunferencia_braco ? `<div class="measurement-item"><span class="label">Braço:</span> ${physical.circunferencia_braco}</div>` : ''}
            ${physical?.circunferencia_coxa ? `<div class="measurement-item"><span class="label">Coxa:</span> ${physical.circunferencia_coxa}</div>` : ''}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">🧠 AVALIAÇÃO EMOCIONAL</h2>
        ${emotional?.relationship_with_food ? `<div class="item"><span class="label">Relação com a Comida:</span> ${emotional.relationship_with_food}</div>` : ''}
        ${emotional?.eating_triggers ? `<div class="item"><span class="label">Gatilhos Alimentares:</span> ${emotional.eating_triggers}</div>` : ''}
        ${emotional?.emotional_state ? `<div class="item"><span class="label">Estado Emocional:</span> ${emotional.emotional_state}</div>` : ''}
        ${emotional?.stress_level ? `<div class="item"><span class="label">Nível de Estresse:</span> ${emotional.stress_level}</div>` : ''}
        ${emotional?.food_anxiety ? `<div class="item"><span class="label">Ansiedade Alimentar:</span> ${emotional.food_anxiety}</div>` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">⚡ AVALIAÇÃO COMPORTAMENTAL</h2>
        ${behavioral?.plan_consistency ? `<div class="item"><span class="label">Consistência do Plano:</span> ${behavioral.plan_consistency}</div>` : ''}
        ${behavioral?.meal_frequency ? `<div class="item"><span class="label">Frequência das Refeições:</span> ${behavioral.meal_frequency}</div>` : ''}
        ${behavioral?.meal_time ? `<div class="item"><span class="label">Tempo de Refeição:</span> ${behavioral.meal_time}</div>` : ''}
        ${behavioral?.vegetable_fruits ? `<div class="item"><span class="label">Consumo de Vegetais/Frutas:</span> ${behavioral.vegetable_fruits}</div>` : ''}
        ${behavioral?.fluid_intake ? `<div class="item"><span class="label">Ingestão de Líquidos:</span> ${behavioral.fluid_intake}</div>` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">💚 AVALIAÇÃO DE BEM-ESTAR</h2>
        ${wellness?.body_image ? `<div class="item"><span class="label">Imagem Corporal:</span> ${wellness.body_image}</div>` : ''}
        ${wellness?.physical_energy ? `<div class="item"><span class="label">Energia Física:</span> ${wellness.physical_energy}</div>` : ''}
        ${wellness?.physical_activity ? `<div class="item"><span class="label">Atividade Física:</span> ${wellness.physical_activity}</div>` : ''}
        ${wellness?.sleep ? `<div class="item"><span class="label">Qualidade do Sono:</span> ${wellness.sleep}</div>` : ''}
        ${wellness?.journey_confidence ? `<div class="item"><span class="label">Confiança na Jornada:</span> ${wellness.journey_confidence}</div>` : ''}
    </div>
</body>
</html>`;
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando resumo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum dado encontrado para gerar o resumo</p>
            <p className="text-sm">Complete as seções de Histórico e Avaliação primeiro</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { clinical, physical, emotional, behavioral, wellness } = summaryData;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Resumo do Paciente</span>
            </div>
            <Button
              onClick={exportSummary}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Histórico Clínico */}
            {clinical && (
              <Card className="border-2 border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Histórico Clínico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {clinical.pre_existing_conditions && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Condições Pré-existentes:</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">{clinical.pre_existing_conditions}</Badge>
                    </div>
                  )}
                  {clinical.surgeries && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Cirurgias:</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">{clinical.surgeries}</Badge>
                    </div>
                  )}
                  {clinical.medications && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Medicamentos:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{clinical.medications}</Badge>
                    </div>
                  )}
                  {clinical.supplements && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Suplementos:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">{clinical.supplements}</Badge>
                    </div>
                  )}
                  {clinical.allergies && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Alergias:</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">{clinical.allergies}</Badge>
                    </div>
                  )}
                  {clinical.family_history && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Histórico Familiar:</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">{clinical.family_history}</Badge>
                    </div>
                  )}
                  {clinical.hereditary_diseases && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-medium text-gray-700">Doenças Hereditárias:</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">{clinical.hereditary_diseases}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Avaliação Física */}
            {physical && (
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Avaliação Física
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Objetivos */}
                  <div>
                    <span className="font-medium text-gray-700 block mb-2">Objetivos:</span>
                    <div className="flex flex-wrap gap-2">
                      {physical.objetivo_estetica && <Badge className="bg-purple-100 text-purple-800">Estética</Badge>}
                      {physical.objetivo_emagrecimento && <Badge className="bg-orange-100 text-orange-800">Emagrecimento</Badge>}
                      {physical.objetivo_saude_longevidade && <Badge className="bg-green-100 text-green-800">Saúde e Longevidade</Badge>}
                      {physical.objetivo_performance_esportiva && <Badge className="bg-blue-100 text-blue-800">Performance Esportiva</Badge>}
                    </div>
                  </div>
                  <Separator />
                  {/* Medidas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {physical.peso_atual && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-green-600">{physical.peso_atual}</div>
                        <div className="text-sm text-gray-600">Peso</div>
                      </div>
                    )}
                    {physical.altura && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-blue-600">{physical.altura}</div>
                        <div className="text-sm text-gray-600">Altura</div>
                      </div>
                    )}
                    {physical.imc && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-purple-600">{physical.imc}</div>
                        <div className="text-sm text-gray-600">IMC</div>
                      </div>
                    )}
                    {physical.gordura_corporal && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-bold text-lg text-orange-600">{physical.gordura_corporal}</div>
                        <div className="text-sm text-gray-600">Gordura</div>
                      </div>
                    )}
                  </div>
                  {/* Circunferências */}
                  {(physical.circunferencia_cintura || physical.circunferencia_quadril || physical.circunferencia_braco || physical.circunferencia_coxa) && (
                    <>
                      <Separator />
                      <div>
                        <span className="font-medium text-gray-700 block mb-2">Circunferências:</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {physical.circunferencia_cintura && (
                            <div className="text-sm">
                              <span className="font-medium">Cintura:</span> {physical.circunferencia_cintura}
                            </div>
                          )}
                          {physical.circunferencia_quadril && (
                            <div className="text-sm">
                              <span className="font-medium">Quadril:</span> {physical.circunferencia_quadril}
                            </div>
                          )}
                          {physical.circunferencia_braco && (
                            <div className="text-sm">
                              <span className="font-medium">Braço:</span> {physical.circunferencia_braco}
                            </div>
                          )}
                          {physical.circunferencia_coxa && (
                            <div className="text-sm">
                              <span className="font-medium">Coxa:</span> {physical.circunferencia_coxa}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Avaliações Emocional, Comportamental e Bem-estar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avaliação Emocional */}
              {emotional && (
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Emocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {emotional.relationship_with_food && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Relação com Comida:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{emotional.relationship_with_food}</Badge>
                      </div>
                    )}
                    {emotional.emotional_state && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Estado Emocional:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{emotional.emotional_state}</Badge>
                      </div>
                    )}
                    {emotional.stress_level && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Nível de Estresse:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{emotional.stress_level}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Avaliação Comportamental */}
              {behavioral && (
                <Card className="border-2 border-yellow-200">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Comportamental
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {behavioral.plan_consistency && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Consistência:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{behavioral.plan_consistency}</Badge>
                      </div>
                    )}
                    {behavioral.meal_frequency && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Frequência:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{behavioral.meal_frequency}</Badge>
                      </div>
                    )}
                    {behavioral.fluid_intake && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Hidratação:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{behavioral.fluid_intake}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Avaliação de Bem-estar */}
              {wellness && (
                <Card className="border-2 border-pink-200">
                  <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Bem-estar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {wellness.physical_energy && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Energia:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{wellness.physical_energy}</Badge>
                      </div>
                    )}
                    {wellness.sleep && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Sono:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{wellness.sleep}</Badge>
                      </div>
                    )}
                    {wellness.journey_confidence && (
                      <div>
                        <span className="font-medium text-xs text-gray-600">Confiança:</span>
                        <Badge variant="outline" className="w-full justify-center mt-1">{wellness.journey_confidence}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
