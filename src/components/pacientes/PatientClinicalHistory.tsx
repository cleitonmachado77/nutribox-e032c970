
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Save, Edit3, FileText } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";

interface PatientClinicalHistoryProps {
  selectedPatient: Paciente;
}

export const PatientClinicalHistory = ({ selectedPatient }: PatientClinicalHistoryProps) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = () => {
    // Implementar lógica de salvamento
    console.log("Salvando dados:", formData);
    setIsEditing(false);
  };

  const handleLimitacaoEmocionalChange = (limitacao: string, checked: boolean) => {
    if (checked) {
      if (formData.limitacoesEmocionais.length < 3) {
        setFormData(prev => ({
          ...prev,
          limitacoesEmocionais: [...prev.limitacoesEmocionais, limitacao]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        limitacoesEmocionais: prev.limitacoesEmocionais.filter(l => l !== limitacao)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Histórico Clínico</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="avaliacao" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="avaliacao">1. Avaliação</TabsTrigger>
          <TabsTrigger value="plano">2. Plano Alimentar</TabsTrigger>
          <TabsTrigger value="metas">3. Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="avaliacao" className="space-y-6">
          <Tabs defaultValue="fisica" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fisica">Física</TabsTrigger>
              <TabsTrigger value="emocional">Emocional</TabsTrigger>
              <TabsTrigger value="comportamental">Comportamental</TabsTrigger>
              <TabsTrigger value="bemestar">Bem-estar</TabsTrigger>
            </TabsList>

            <TabsContent value="fisica">
              <Card>
                <CardHeader>
                  <CardTitle>1.1 Avaliação Física</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">1.1.1 Objetivo do Paciente</Label>
                    <RadioGroup 
                      value={formData.objetivo} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, objetivo: value }))}
                      disabled={!isEditing}
                      className="mt-2"
                    >
                      {objetivosOptions.map((objetivo) => (
                        <div key={objetivo} className="flex items-center space-x-2">
                          <RadioGroupItem value={objetivo} id={objetivo} />
                          <Label htmlFor={objetivo}>{objetivo}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">1.1.2 Avaliação Antropométrica</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                      <div>
                        <Label htmlFor="peso">Peso Atual (kg)</Label>
                        <Input 
                          id="peso"
                          value={formData.pesoAtual}
                          onChange={(e) => setFormData(prev => ({ ...prev, pesoAtual: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="altura">Altura (cm)</Label>
                        <Input 
                          id="altura"
                          value={formData.altura}
                          onChange={(e) => setFormData(prev => ({ ...prev, altura: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="imc">IMC</Label>
                        <Input 
                          id="imc"
                          value={formData.imc}
                          onChange={(e) => setFormData(prev => ({ ...prev, imc: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gordura">% Gordura Corporal</Label>
                        <Input 
                          id="gordura"
                          value={formData.gorduraCorporal}
                          onChange={(e) => setFormData(prev => ({ ...prev, gorduraCorporal: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-sm font-medium">Circunferências (cm)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div>
                          <Label htmlFor="cintura">Cintura</Label>
                          <Input 
                            id="cintura"
                            value={formData.circunferencias.cintura}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              circunferencias: { ...prev.circunferencias, cintura: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="quadril">Quadril</Label>
                          <Input 
                            id="quadril"
                            value={formData.circunferencias.quadril}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              circunferencias: { ...prev.circunferencias, quadril: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="braco">Braço</Label>
                          <Input 
                            id="braco"
                            value={formData.circunferencias.braco}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              circunferencias: { ...prev.circunferencias, braco: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="coxa">Coxa</Label>
                          <Input 
                            id="coxa"
                            value={formData.circunferencias.coxa}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              circunferencias: { ...prev.circunferencias, coxa: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emocional">
              <Card>
                <CardHeader>
                  <CardTitle>1.2 Avaliação Emocional</CardTitle>
                  <p className="text-sm text-muted-foreground">Selecione até 3 limitações mais comuns</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {limitacoesEmocionaisOptions.map((limitacao) => (
                    <div key={limitacao} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={limitacao}
                          checked={formData.limitacoesEmocionais.includes(limitacao)}
                          onCheckedChange={(checked) => handleLimitacaoEmocionalChange(limitacao, checked as boolean)}
                          disabled={!isEditing || (formData.limitacoesEmocionais.length >= 3 && !formData.limitacoesEmocionais.includes(limitacao))}
                        />
                        <Label htmlFor={limitacao} className="text-sm">{limitacao}</Label>
                      </div>
                      {formData.limitacoesEmocionais.includes(limitacao) && (
                        <Textarea
                          placeholder="Anotações sobre esta limitação..."
                          value={formData.anotacoesEmocionais[limitacao] || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            anotacoesEmocionais: {
                              ...prev.anotacoesEmocionais,
                              [limitacao]: e.target.value
                            }
                          }))}
                          disabled={!isEditing}
                          className="ml-6"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comportamental">
              <Card>
                <CardHeader>
                  <CardTitle>1.3 Avaliação Comportamental</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consistencia">Consistência no Plano</Label>
                      <Input 
                        id="consistencia"
                        value={formData.avaliacaoComportamental.consistenciaPlano}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          avaliacaoComportamental: { ...prev.avaliacaoComportamental, consistenciaPlano: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequencia">Frequência de Refeições</Label>
                      <Input 
                        id="frequencia"
                        value={formData.avaliacaoComportamental.frequenciaRefeicoes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          avaliacaoComportamental: { ...prev.avaliacaoComportamental, frequenciaRefeicoes: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempo">Tempo de Refeição</Label>
                      <Input 
                        id="tempo"
                        value={formData.avaliacaoComportamental.tempoRefeicao}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          avaliacaoComportamental: { ...prev.avaliacaoComportamental, tempoRefeicao: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vegetais">Vegetais e Frutas</Label>
                      <Input 
                        id="vegetais"
                        value={formData.avaliacaoComportamental.vegetaisFrutas}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          avaliacaoComportamental: { ...prev.avaliacaoComportamental, vegetaisFrutas: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="liquidos">Ingestão de Líquidos</Label>
                      <Input 
                        id="liquidos"
                        value={formData.avaliacaoComportamental.ingestaoLiquidos}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          avaliacaoComportamental: { ...prev.avaliacaoComportamental, ingestaoLiquidos: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Nova Pergunta
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bemestar">
              <Card>
                <CardHeader>
                  <CardTitle>1.4 Avaliação de Bem-estar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="satisfacao">Satisfação com o Corpo</Label>
                      <Input 
                        id="satisfacao"
                        value={formData.bemestar.satisfacaoCorpo}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bemestar: { ...prev.bemestar, satisfacaoCorpo: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="energia">Energia Física</Label>
                      <Input 
                        id="energia"
                        value={formData.bemestar.energiaFisica}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bemestar: { ...prev.bemestar, energiaFisica: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="atividade">Atividade Física</Label>
                      <Input 
                        id="atividade"
                        value={formData.bemestar.atividadeFisica}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bemestar: { ...prev.bemestar, atividadeFisica: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sono">Sono</Label>
                      <Input 
                        id="sono"
                        value={formData.bemestar.sono}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bemestar: { ...prev.bemestar, sono: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confianca">Confiança na Jornada</Label>
                      <Input 
                        id="confianca"
                        value={formData.bemestar.confiancaJornada}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          bemestar: { ...prev.bemestar, confiancaJornada: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
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
          {/* Plano Alimentar tabs will continue here */}
          <Tabs defaultValue="estrutura" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
              <TabsTrigger value="personalizacao">Personalização</TabsTrigger>
              <TabsTrigger value="plano-acao">Plano</TabsTrigger>
            </TabsList>

            <TabsContent value="estrutura">
              <Card>
                <CardHeader>
                  <CardTitle>2.1 Estrutura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="calorias">Quantidade Calórica/dia</Label>
                      <Input 
                        id="calorias"
                        value={formData.estrutura.caloriasDia}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estrutura: { ...prev.estrutura, caloriasDia: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="macros">Distribuição dos Macros</Label>
                      <Input 
                        id="macros"
                        value={formData.estrutura.distribuicaoMacros}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estrutura: { ...prev.estrutura, distribuicaoMacros: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicoes-estrutura">Refeições</Label>
                      <Input 
                        id="refeicoes-estrutura"
                        value={formData.estrutura.refeicoes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          estrutura: { ...prev.estrutura, refeicoes: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais Critérios
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personalizacao">
              <Card>
                <CardHeader>
                  <CardTitle>2.2 Personalização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="refeicao-preferida">Refeição Preferida</Label>
                      <Textarea 
                        id="refeicao-preferida"
                        value={formData.personalizacao.refeicaoPreferida}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, refeicaoPreferida: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicao-pretendida">Refeição Pretendida</Label>
                      <Textarea 
                        id="refeicao-pretendida"
                        value={formData.personalizacao.refeicaoPretendida}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, refeicaoPretendida: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alimentos-preferidos">Alimentos Preferidos</Label>
                      <Textarea 
                        id="alimentos-preferidos"
                        value={formData.personalizacao.alimentosPreferidos}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, alimentosPreferidos: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="alimentos-pretendidos">Alimentos Pretendidos</Label>
                      <Textarea 
                        id="alimentos-pretendidos"
                        value={formData.personalizacao.alimentosPretendidos}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, alimentosPretendidos: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="refeicao-perfeita">Refeição Perfeita</Label>
                      <Textarea 
                        id="refeicao-perfeita"
                        value={formData.personalizacao.refeicaoPerfeita}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, refeicaoPerfeita: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="limitacoes-alimentares">Limitações</Label>
                      <Textarea 
                        id="limitacoes-alimentares"
                        value={formData.personalizacao.limitacoes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          personalizacao: { ...prev.personalizacao, limitacoes: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Mais Informações
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plano-acao">
              <Card>
                <CardHeader>
                  <CardTitle>2.3 Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Gerar Novo Plano
                    </Button>
                    <Button variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Plano
                    </Button>
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Plano
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Exportar Plano PDF
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                    <p className="text-gray-600 text-center">
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fisicas">Metas Físicas</TabsTrigger>
              <TabsTrigger value="comportamentais">Metas Comportamentais</TabsTrigger>
              <TabsTrigger value="bemestar-metas">Metas de Bem-estar</TabsTrigger>
            </TabsList>

            <TabsContent value="fisicas">
              <Card>
                <CardHeader>
                  <CardTitle>3.1 Metas Físicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="peso-meta">Peso Meta (kg)</Label>
                      <Input 
                        id="peso-meta"
                        value={formData.metasFisicas.pesoMeta}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasFisicas: { ...prev.metasFisicas, pesoMeta: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="imc-meta">IMC Meta</Label>
                      <Input 
                        id="imc-meta"
                        value={formData.metasFisicas.imcMeta}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasFisicas: { ...prev.metasFisicas, imcMeta: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gordura-meta">% Gordura Meta</Label>
                      <Input 
                        id="gordura-meta"
                        value={formData.metasFisicas.gorduraMeta}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasFisicas: { ...prev.metasFisicas, gorduraMeta: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Metas de Circunferências (cm)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <Label htmlFor="cintura-meta">Cintura</Label>
                        <Input 
                          id="cintura-meta"
                          value={formData.metasFisicas.circunferenciasMeta.cintura}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            metasFisicas: { 
                              ...prev.metasFisicas, 
                              circunferenciasMeta: { ...prev.metasFisicas.circunferenciasMeta, cintura: e.target.value }
                            }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quadril-meta">Quadril</Label>
                        <Input 
                          id="quadril-meta"
                          value={formData.metasFisicas.circunferenciasMeta.quadril}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            metasFisicas: { 
                              ...prev.metasFisicas, 
                              circunferenciasMeta: { ...prev.metasFisicas.circunferenciasMeta, quadril: e.target.value }
                            }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="braco-meta">Braço</Label>
                        <Input 
                          id="braco-meta"
                          value={formData.metasFisicas.circunferenciasMeta.braco}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            metasFisicas: { 
                              ...prev.metasFisicas, 
                              circunferenciasMeta: { ...prev.metasFisicas.circunferenciasMeta, braco: e.target.value }
                            }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="coxa-meta">Coxa</Label>
                        <Input 
                          id="coxa-meta"
                          value={formData.metasFisicas.circunferenciasMeta.coxa}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            metasFisicas: { 
                              ...prev.metasFisicas, 
                              circunferenciasMeta: { ...prev.metasFisicas.circunferenciasMeta, coxa: e.target.value }
                            }
                          }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comportamentais">
              <Card>
                <CardHeader>
                  <CardTitle>3.2 Metas Comportamentais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consistencia-meta">Consistência no Plano</Label>
                      <Input 
                        id="consistencia-meta"
                        value={formData.metasComportamentais.consistenciaPlano}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasComportamentais: { ...prev.metasComportamentais, consistenciaPlano: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequencia-meta">Frequência de Refeições</Label>
                      <Input 
                        id="frequencia-meta"
                        value={formData.metasComportamentais.frequenciaRefeicoes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasComportamentais: { ...prev.metasComportamentais, frequenciaRefeicoes: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempo-meta">Tempo de Refeição</Label>
                      <Input 
                        id="tempo-meta"
                        value={formData.metasComportamentais.tempoRefeicao}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasComportamentais: { ...prev.metasComportamentais, tempoRefeicao: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frutas-meta">Consumo de Frutas/Verduras</Label>
                      <Input 
                        id="frutas-meta"
                        value={formData.metasComportamentais.consumoFrutasVerduras}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasComportamentais: { ...prev.metasComportamentais, consumoFrutasVerduras: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="liquido-meta">Ingestão de Líquido</Label>
                      <Input 
                        id="liquido-meta"
                        value={formData.metasComportamentais.ingestaoLiquido}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasComportamentais: { ...prev.metasComportamentais, ingestaoLiquido: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bemestar-metas">
              <Card>
                <CardHeader>
                  <CardTitle>3.3 Metas de Bem-estar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="energia-meta">Energia Física</Label>
                      <Input 
                        id="energia-meta"
                        value={formData.metasBemestar.energiaFisica}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasBemestar: { ...prev.metasBemestar, energiaFisica: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="atividade-meta">Atividade Física</Label>
                      <Input 
                        id="atividade-meta"
                        value={formData.metasBemestar.atividadeFisica}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasBemestar: { ...prev.metasBemestar, atividadeFisica: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sono-meta">Qualidade do Sono</Label>
                      <Input 
                        id="sono-meta"
                        value={formData.metasBemestar.qualidadeSono}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasBemestar: { ...prev.metasBemestar, qualidadeSono: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confianca-meta">Confiança na Jornada</Label>
                      <Input 
                        id="confianca-meta"
                        value={formData.metasBemestar.confiancaJornada}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasBemestar: { ...prev.metasBemestar, confiancaJornada: e.target.value }
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="satisfacao-meta">Satisfação com o Corpo Atual</Label>
                      <Input 
                        id="satisfacao-meta"
                        value={formData.metasBemestar.satisfacaoCorpo}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          metasBemestar: { ...prev.metasBemestar, satisfacaoCorpo: e.target.value }
                        }))}
                        disabled={!isEditing}
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
