
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Save, Edit3, FileText, Download } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";
import { useToast } from "@/hooks/use-toast";

interface PatientClinicalHistoryProps {
  selectedPatient: Paciente;
}

export const PatientClinicalHistory = ({ selectedPatient }: PatientClinicalHistoryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Avaliação Física
    objetivo: "",
    pesoAtual: "",
    altura: "",
    imc: "",
    gorduraCorporal: "",
    circunferencias: {
      cintura: "",
      quadril: "",
      braco: "",
      coxa: ""
    },
    
    // Avaliação Emocional
    limitacoesEmocionais: [] as string[],
    anotacoesEmocionais: {} as Record<string, string>,
    
    // Avaliação Comportamental
    avaliacaoComportamental: {
      consistenciaPlano: "",
      frequenciaRefeicoes: "",
      tempoRefeicao: "",
      vegetaisFrutas: "",
      ingestaoLiquidos: ""
    },
    
    // Bem-estar
    bemestar: {
      satisfacaoCorpo: "",
      energiaFisica: "",
      atividadeFisica: "",
      sono: "",
      confiancaJornada: ""
    },
    
    // Plano Alimentar
    estrutura: {
      caloriasDia: "",
      distribuicaoMacros: "",
      refeicoes: ""
    },
    
    personalizacao: {
      refeicaoPreferida: "",
      refeicaoPretendida: "",
      alimentosPreferidos: "",
      alimentosPretendidos: "",
      refeicaoPerfeita: "",
      verdurasLegumes: "",
      frutas: "",
      objetos: "",
      limitacoes: ""
    },
    
    // Metas
    metasFisicas: {
      pesoMeta: "",
      imcMeta: "",
      gorduraMeta: "",
      circunferenciasMeta: {
        cintura: "",
        quadril: "",
        braco: "",
        coxa: ""
      }
    },
    
    metasComportamentais: {
      consistenciaPlano: "",
      frequenciaRefeicoes: "",
      tempoRefeicao: "",
      consumoFrutasVerduras: "",
      ingestaoLiquido: ""
    },
    
    metasBemestar: {
      energiaFisica: "",
      atividadeFisica: "",
      qualidadeSono: "",
      confiancaJornada: "",
      satisfacaoCorpo: ""
    }
  });

  const limitacoesEmocionaisOptions = [
    "Compulsão Alimentar Noturna",
    "Ansiedade Pré Refeição",
    "Fome Emocional",
    "Episódios de Recompensa Alimentar",
    "Culpa Pós Alimentação",
    "Oscilação de Humor no Ciclo Menstrual",
    "Auto-Imagem Negativa (Body-Shame)",
    "Sensação de Falta de Controle",
    "Estresse Crônico"
  ];

  const objetivosOptions = [
    "Estética",
    "Emagrecimento",
    "Saúde e Longevidade",
    "Performance Esportiva"
  ];

  // Carregar dados salvos no localStorage ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem(`patient_${selectedPatient.id}_clinical_history`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
      }
    }
  }, [selectedPatient.id]);

  const handleSave = () => {
    try {
      localStorage.setItem(`patient_${selectedPatient.id}_clinical_history`, JSON.stringify(formData));
      setIsEditing(false);
      setHasChanges(false);
      toast({
        title: "Dados salvos com sucesso!",
        description: "O histórico clínico foi salvo no sistema.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Recarregar dados salvos
    const savedData = localStorage.getItem(`patient_${selectedPatient.id}_clinical_history`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
      }
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setHasChanges(true);
  };

  const handleLimitacaoEmocionalChange = (limitacao: string, checked: boolean) => {
    if (checked) {
      if (formData.limitacoesEmocionais.length < 3) {
        updateFormData('limitacoesEmocionais', [...formData.limitacoesEmocionais, limitacao]);
      }
    } else {
      updateFormData('limitacoesEmocionais', formData.limitacoesEmocionais.filter(l => l !== limitacao));
    }
  };

  const handleGerarPlano = () => {
    toast({
      title: "Gerando Plano Alimentar",
      description: "O plano está sendo gerado com base nas informações do paciente.",
    });
  };

  const handleEditarPlano = () => {
    toast({
      title: "Editor de Plano",
      description: "Abrindo editor de plano alimentar.",
    });
  };

  const handleExportarPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O plano alimentar está sendo preparado para download.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Histórico Clínico</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && hasChanges && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          )}
          {isEditing && (
            <Button onClick={handleCancel} variant="outline">
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="avaliacao" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-purple-100">
          <TabsTrigger value="avaliacao" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">1. Avaliação</TabsTrigger>
          <TabsTrigger value="plano" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">2. Plano Alimentar</TabsTrigger>
          <TabsTrigger value="metas" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">3. Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacao" className="space-y-6">
          <Tabs defaultValue="fisica" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-purple-50">
              <TabsTrigger value="fisica" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Física</TabsTrigger>
              <TabsTrigger value="emocional" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Emocional</TabsTrigger>
              <TabsTrigger value="comportamental" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Comportamental</TabsTrigger>
              <TabsTrigger value="bemestar" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Bem-estar</TabsTrigger>
            </TabsList>

            <TabsContent value="fisica">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">1.1 Avaliação Física</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <Label className="text-base font-semibold text-purple-700">1.1.1 Objetivo do Paciente</Label>
                    <RadioGroup 
                      value={formData.objetivo} 
                      onValueChange={(value) => updateFormData('objetivo', value)}
                      disabled={!isEditing}
                      className="mt-2"
                    >
                      {objetivosOptions.map((objetivo) => (
                        <div key={objetivo} className="flex items-center space-x-2">
                          <RadioGroupItem value={objetivo} id={objetivo} className="border-purple-500 text-purple-600" />
                          <Label htmlFor={objetivo}>{objetivo}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold text-purple-700">1.1.2 Avaliação Antropométrica</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                      <div>
                        <Label htmlFor="peso">Peso Atual (kg)</Label>
                        <Input 
                          id="peso"
                          value={formData.pesoAtual}
                          onChange={(e) => updateFormData('pesoAtual', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="altura">Altura (cm)</Label>
                        <Input 
                          id="altura"
                          value={formData.altura}
                          onChange={(e) => updateFormData('altura', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="imc">IMC</Label>
                        <Input 
                          id="imc"
                          value={formData.imc}
                          onChange={(e) => updateFormData('imc', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gordura">% Gordura Corporal</Label>
                        <Input 
                          id="gordura"
                          value={formData.gorduraCorporal}
                          onChange={(e) => updateFormData('gorduraCorporal', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-sm font-medium text-purple-700">Circunferências (cm)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div>
                          <Label htmlFor="cintura">Cintura</Label>
                          <Input 
                            id="cintura"
                            value={formData.circunferencias.cintura}
                            onChange={(e) => updateFormData('circunferencias.cintura', e.target.value)}
                            disabled={!isEditing}
                            className="border-purple-300 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quadril">Quadril</Label>
                          <Input 
                            id="quadril"
                            value={formData.circunferencias.quadril}
                            onChange={(e) => updateFormData('circunferencias.quadril', e.target.value)}
                            disabled={!isEditing}
                            className="border-purple-300 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="braco">Braço</Label>
                          <Input 
                            id="braco"
                            value={formData.circunferencias.braco}
                            onChange={(e) => updateFormData('circunferencias.braco', e.target.value)}
                            disabled={!isEditing}
                            className="border-purple-300 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="coxa">Coxa</Label>
                          <Input 
                            id="coxa"
                            value={formData.circunferencias.coxa}
                            onChange={(e) => updateFormData('circunferencias.coxa', e.target.value)}
                            disabled={!isEditing}
                            className="border-purple-300 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emocional">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">1.2 Avaliação Emocional</CardTitle>
                  <p className="text-sm text-purple-600">Selecione até 3 limitações mais comuns</p>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {limitacoesEmocionaisOptions.map((limitacao) => (
                    <div key={limitacao} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={limitacao}
                          checked={formData.limitacoesEmocionais.includes(limitacao)}
                          onCheckedChange={(checked) => handleLimitacaoEmocionalChange(limitacao, checked as boolean)}
                          disabled={!isEditing || (formData.limitacoesEmocionais.length >= 3 && !formData.limitacoesEmocionais.includes(limitacao))}
                          className="border-purple-500 data-[state=checked]:bg-purple-600"
                        />
                        <Label htmlFor={limitacao} className="text-sm">{limitacao}</Label>
                      </div>
                      {formData.limitacoesEmocionais.includes(limitacao) && (
                        <Textarea
                          placeholder="Anotações sobre esta limitação..."
                          value={formData.anotacoesEmocionais[limitacao] || ""}
                          onChange={(e) => updateFormData(`anotacoesEmocionais.${limitacao}`, e.target.value)}
                          disabled={!isEditing}
                          className="ml-6 border-purple-300 focus:border-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comportamental">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">1.3 Avaliação Comportamental</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consistencia">Consistência no Plano</Label>
                      <Input 
                        id="consistencia"
                        value={formData.avaliacaoComportamental.consistenciaPlano}
                        onChange={(e) => updateFormData('avaliacaoComportamental.consistenciaPlano', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequencia">Frequência de Refeições</Label>
                      <Input 
                        id="frequencia"
                        value={formData.avaliacaoComportamental.frequenciaRefeicoes}
                        onChange={(e) => updateFormData('avaliacaoComportamental.frequenciaRefeicoes', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempo">Tempo de Refeição</Label>
                      <Input 
                        id="tempo"
                        value={formData.avaliacaoComportamental.tempoRefeicao}
                        onChange={(e) => updateFormData('avaliacaoComportamental.tempoRefeicao', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vegetais">Vegetais e Frutas</Label>
                      <Input 
                        id="vegetais"
                        value={formData.avaliacaoComportamental.vegetaisFrutas}
                        onChange={(e) => updateFormData('avaliacaoComportamental.vegetaisFrutas', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="liquidos">Ingestão de Líquidos</Label>
                      <Input 
                        id="liquidos"
                        value={formData.avaliacaoComportamental.ingestaoLiquidos}
                        onChange={(e) => updateFormData('avaliacaoComportamental.ingestaoLiquidos', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Nova Pergunta
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bemestar">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">1.4 Avaliação de Bem-estar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="satisfacao">Satisfação com o Corpo</Label>
                      <Input 
                        id="satisfacao"
                        value={formData.bemestar.satisfacaoCorpo}
                        onChange={(e) => updateFormData('bemestar.satisfacaoCorpo', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="energia">Energia Física</Label>
                      <Input 
                        id="energia"
                        value={formData.bemestar.energiaFisica}
                        onChange={(e) => updateFormData('bemestar.energiaFisica', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="atividade">Atividade Física</Label>
                      <Input 
                        id="atividade"
                        value={formData.bemestar.atividadeFisica}
                        onChange={(e) => updateFormData('bemestar.atividadeFisica', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sono">Sono</Label>
                      <Input 
                        id="sono"
                        value={formData.bemestar.sono}
                        onChange={(e) => updateFormData('bemestar.sono', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confianca">Confiança na Jornada</Label>
                      <Input 
                        id="confianca"
                        value={formData.bemestar.confiancaJornada}
                        onChange={(e) => updateFormData('bemestar.confiancaJornada', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais Perguntas
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="plano" className="space-y-6">
          <Tabs defaultValue="estrutura" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-purple-50">
              <TabsTrigger value="estrutura" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Estrutura</TabsTrigger>
              <TabsTrigger value="personalizacao" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Personalização</TabsTrigger>
              <TabsTrigger value="plano-acao" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Plano</TabsTrigger>
            </TabsList>

            <TabsContent value="estrutura">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">2.1 Estrutura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="calorias">Quantidade Calórica/dia</Label>
                      <Input 
                        id="calorias"
                        value={formData.estrutura.caloriasDia}
                        onChange={(e) => updateFormData('estrutura.caloriasDia', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="macros">Distribuição dos Macros</Label>
                      <Input 
                        id="macros"
                        value={formData.estrutura.distribuicaoMacros}
                        onChange={(e) => updateFormData('estrutura.distribuicaoMacros', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicoes-estrutura">Refeições</Label>
                      <Input 
                        id="refeicoes-estrutura"
                        value={formData.estrutura.refeicoes}
                        onChange={(e) => updateFormData('estrutura.refeicoes', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais Critérios
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personalizacao">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">2.2 Personalização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="refeicao-preferida">Refeição Preferida</Label>
                      <Textarea 
                        id="refeicao-preferida"
                        value={formData.personalizacao.refeicaoPreferida}
                        onChange={(e) => updateFormData('personalizacao.refeicaoPreferida', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicao-pretendida">Refeição Pretendida</Label>
                      <Textarea 
                        id="refeicao-pretendida"
                        value={formData.personalizacao.refeicaoPretendida}
                        onChange={(e) => updateFormData('personalizacao.refeicaoPretendida', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alimentos-preferidos">Alimentos Preferidos</Label>
                      <Textarea 
                        id="alimentos-preferidos"
                        value={formData.personalizacao.alimentosPreferidos}
                        onChange={(e) => updateFormData('personalizacao.alimentosPreferidos', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alimentos-pretendidos">Alimentos Pretendidos</Label>
                      <Textarea 
                        id="alimentos-pretendidos"
                        value={formData.personalizacao.alimentosPretendidos}
                        onChange={(e) => updateFormData('personalizacao.alimentosPretendidos', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicao-perfeita">Refeição Perfeita</Label>
                      <Textarea 
                        id="refeicao-perfeita"
                        value={formData.personalizacao.refeicaoPerfeita}
                        onChange={(e) => updateFormData('personalizacao.refeicaoPerfeita', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="limitacoes-alimentares">Limitações</Label>
                      <Textarea 
                        id="limitacoes-alimentares"
                        value={formData.personalizacao.limitacoes}
                        onChange={(e) => updateFormData('personalizacao.limitacoes', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais Informações
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plano-acao">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">2.3 Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={handleGerarPlano}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Gerar Novo Plano
                    </Button>
                    <Button 
                      onClick={handleEditarPlano}
                      variant="outline" 
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Plano
                    </Button>
                    <Button 
                      onClick={handleSave}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Plano
                    </Button>
                    <Button 
                      onClick={handleExportarPDF}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Plano PDF
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 min-h-[200px] bg-purple-50 border-purple-200">
                    <p className="text-purple-600 text-center">
                      Plano alimentar será exibido aqui após a geração
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <Tabs defaultValue="fisicas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-purple-50">
              <TabsTrigger value="fisicas" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Metas Físicas</TabsTrigger>
              <TabsTrigger value="comportamentais" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Metas Comportamentais</TabsTrigger>
              <TabsTrigger value="bemestar-metas" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Metas de Bem-estar</TabsTrigger>
            </TabsList>

            <TabsContent value="fisicas">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">3.1 Metas Físicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="peso-meta">Peso Meta (kg)</Label>
                      <Input 
                        id="peso-meta"
                        value={formData.metasFisicas.pesoMeta}
                        onChange={(e) => updateFormData('metasFisicas.pesoMeta', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imc-meta">IMC Meta</Label>
                      <Input 
                        id="imc-meta"
                        value={formData.metasFisicas.imcMeta}
                        onChange={(e) => updateFormData('metasFisicas.imcMeta', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gordura-meta">% Gordura Meta</Label>
                      <Input 
                        id="gordura-meta"
                        value={formData.metasFisicas.gorduraMeta}
                        onChange={(e) => updateFormData('metasFisicas.gorduraMeta', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-purple-700">Metas de Circunferências (cm)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <Label htmlFor="cintura-meta">Cintura</Label>
                        <Input 
                          id="cintura-meta"
                          value={formData.metasFisicas.circunferenciasMeta.cintura}
                          onChange={(e) => updateFormData('metasFisicas.circunferenciasMeta.cintura', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quadril-meta">Quadril</Label>
                        <Input 
                          id="quadril-meta"
                          value={formData.metasFisicas.circunferenciasMeta.quadril}
                          onChange={(e) => updateFormData('metasFisicas.circunferenciasMeta.quadril', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="braco-meta">Braço</Label>
                        <Input 
                          id="braco-meta"
                          value={formData.metasFisicas.circunferenciasMeta.braco}
                          onChange={(e) => updateFormData('metasFisicas.circunferenciasMeta.braco', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coxa-meta">Coxa</Label>
                        <Input 
                          id="coxa-meta"
                          value={formData.metasFisicas.circunferenciasMeta.coxa}
                          onChange={(e) => updateFormData('metasFisicas.circunferenciasMeta.coxa', e.target.value)}
                          disabled={!isEditing}
                          className="border-purple-300 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comportamentais">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">3.2 Metas Comportamentais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consistencia-meta">Consistência no Plano</Label>
                      <Input 
                        id="consistencia-meta"
                        value={formData.metasComportamentais.consistenciaPlano}
                        onChange={(e) => updateFormData('metasComportamentais.consistenciaPlano', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequencia-meta">Frequência de Refeições</Label>
                      <Input 
                        id="frequencia-meta"
                        value={formData.metasComportamentais.frequenciaRefeicoes}
                        onChange={(e) => updateFormData('metasComportamentais.frequenciaRefeicoes', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempo-meta">Tempo de Refeição</Label>
                      <Input 
                        id="tempo-meta"
                        value={formData.metasComportamentais.tempoRefeicao}
                        onChange={(e) => updateFormData('metasComportamentais.tempoRefeicao', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frutas-meta">Consumo de Frutas/Verduras</Label>
                      <Input 
                        id="frutas-meta"
                        value={formData.metasComportamentais.consumoFrutasVerduras}
                        onChange={(e) => updateFormData('metasComportamentais.consumoFrutasVerduras', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="liquido-meta">Ingestão de Líquido</Label>
                      <Input 
                        id="liquido-meta"
                        value={formData.metasComportamentais.ingestaoLiquido}
                        onChange={(e) => updateFormData('metasComportamentais.ingestaoLiquido', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bemestar-metas">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-purple-800">3.3 Metas de Bem-estar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="energia-meta">Energia Física</Label>
                      <Input 
                        id="energia-meta"
                        value={formData.metasBemestar.energiaFisica}
                        onChange={(e) => updateFormData('metasBemestar.energiaFisica', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="atividade-meta">Atividade Física</Label>
                      <Input 
                        id="atividade-meta"
                        value={formData.metasBemestar.atividadeFisica}
                        onChange={(e) => updateFormData('metasBemestar.atividadeFisica', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sono-meta">Qualidade do Sono</Label>
                      <Input 
                        id="sono-meta"
                        value={formData.metasBemestar.qualidadeSono}
                        onChange={(e) => updateFormData('metasBemestar.qualidadeSono', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confianca-meta">Confiança na Jornada</Label>
                      <Input 
                        id="confianca-meta"
                        value={formData.metasBemestar.confiancaJornada}
                        onChange={(e) => updateFormData('metasBemestar.confiancaJornada', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="satisfacao-meta">Satisfação com o Corpo Atual</Label>
                      <Input 
                        id="satisfacao-meta"
                        value={formData.metasBemestar.satisfacaoCorpo}
                        onChange={(e) => updateFormData('metasBemestar.satisfacaoCorpo', e.target.value)}
                        disabled={!isEditing}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};
