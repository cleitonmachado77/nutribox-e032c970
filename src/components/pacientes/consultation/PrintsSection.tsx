
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer, FileText, ShoppingCart, Pill, Target, Eye, Download } from "lucide-react";
import { useConsultationData } from "@/hooks/useConsultationData";
import { usePatientCurrentData } from "@/hooks/usePatientCurrentData";
import { usePacientes } from "@/hooks/usePacientes";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PrintsSectionProps {
  patientId: string;
  consultationId?: string;
}

export const PrintsSection = ({ patientId, consultationId }: PrintsSectionProps) => {
  const { getSavedNutritionalPlan } = useConsultationData(patientId, consultationId);
  const { currentData } = usePatientCurrentData(patientId);
  const { data: pacientes = [] } = usePacientes();
  const [nutritionalPlan, setNutritionalPlan] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedPatient = pacientes.find(p => p.id === patientId);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const plan = await getSavedNutritionalPlan();
        if (plan) {
          setNutritionalPlan(plan);
        }
      } catch (error) {
        console.error("Error loading nutritional plan:", error);
      }
    };

    if (consultationId) {
      loadPlan();
    }
  }, [consultationId, getSavedNutritionalPlan]);

  const generatePDF = () => {
    if (!nutritionalPlan || !selectedPatient) {
      toast.error("Nenhum plano alimentar encontrado para imprimir");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Plano Alimentar - ${selectedPatient.lead.nome}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #7C3AED; 
            padding-bottom: 20px; 
          }
          .patient-info { 
            background-color: #F8F9FA; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 25px;
            border-left: 5px solid #7C3AED;
          }
          .current-data {
            background-color: #EFF6FF;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .content { 
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.8;
          }
          h1 { 
            color: #7C3AED; 
            margin: 0; 
            font-size: 28px;
          }
          h2 { 
            color: #5B21B6; 
            margin-top: 25px; 
            font-size: 20px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 5px;
          }
          h3 {
            color: #6366F1;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 2px solid #E5E7EB; 
            padding-top: 20px; 
          }
          .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
          }
          .data-item {
            background: #FFFFFF;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #E5E7EB;
          }
          .data-label {
            font-weight: bold;
            color: #374151;
            font-size: 12px;
          }
          .data-value {
            color: #6B7280;
            font-size: 14px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PLANO ALIMENTAR PERSONALIZADO</h1>
          <p style="font-size: 16px; color: #6B7280; margin: 10px 0;">Desenvolvido especialmente para você</p>
        </div>
        
        <div class="patient-info">
          <h2>Informações do Paciente</h2>
          <div class="data-grid">
            <div class="data-item">
              <div class="data-label">Nome:</div>
              <div class="data-value">${selectedPatient.lead.nome}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Telefone:</div>
              <div class="data-value">${selectedPatient.lead.telefone}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Email:</div>
              <div class="data-value">${selectedPatient.lead.email || 'Não informado'}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Objetivo:</div>
              <div class="data-value">${selectedPatient.lead.objetivo || 'Não definido'}</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        ${currentData && Object.keys(currentData).some(key => currentData[key as keyof typeof currentData]) ? `
        <div class="current-data">
          <h2>Dados Atuais do Paciente</h2>
          <div class="data-grid">
            ${currentData.peso_atual ? `
            <div class="data-item">
              <div class="data-label">Peso Atual:</div>
              <div class="data-value">${currentData.peso_atual}</div>
            </div>` : ''}
            ${currentData.altura ? `
            <div class="data-item">
              <div class="data-label">Altura:</div>
              <div class="data-value">${currentData.altura}</div>
            </div>` : ''}
            ${currentData.imc ? `
            <div class="data-item">
              <div class="data-label">IMC:</div>
              <div class="data-value">${currentData.imc}</div>
            </div>` : ''}
            ${currentData.gordura_corporal ? `
            <div class="data-item">
              <div class="data-label">% Gordura Corporal:</div>
              <div class="data-value">${currentData.gordura_corporal}</div>
            </div>` : ''}
          </div>
        </div>` : ''}

        <h2>Plano Alimentar Detalhado</h2>
        <div class="content">${nutritionalPlan || 'Plano alimentar ainda não foi gerado para esta consulta.'}</div>
        
        <div class="footer">
          <p><strong>Orientações Importantes:</strong></p>
          <p>• Este plano foi elaborado especialmente para você com base em suas necessidades individuais</p>
          <p>• Siga as orientações respeitando suas sensações de fome e saciedade</p>
          <p>• Em caso de dúvidas, entre em contato com seu profissional</p>
          <p>• Realize acompanhamento regular conforme orientado</p>
          <br>
          <p>© ${new Date().getFullYear()} - Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `plano_alimentar_${selectedPatient.lead.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Plano alimentar exportado com sucesso!");
  };

  const handlePrint = (type: string) => {
    if (type === "plano-alimentar") {
      generatePDF();
    } else {
      console.log(`Printing ${type} for patient:`, patientId);
      toast.info(`Funcionalidade de ${type} será implementada em breve`);
    }
  };

  const printOptions = [
    {
      id: "plano-alimentar",
      title: "Plano Alimentar",
      description: "Imprime o plano alimentar completo do paciente",
      icon: FileText,
      hasContent: !!nutritionalPlan
    },
    {
      id: "lista-compras",
      title: "Lista de Compras",
      description: "Imprime a lista de compras consolidada",
      icon: ShoppingCart,
      hasContent: false
    },
    {
      id: "prescricoes",
      title: "Prescrições",
      description: "Imprime prescrições e orientações",
      icon: Pill,
      hasContent: false
    },
    {
      id: "metas-checklist",
      title: "Metas e Checklist",
      description: "Imprime as metas e checklist do paciente",
      icon: Target,
      hasContent: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="w-5 h-5" />
          Documentos para Impressão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Todas as edições devem ter sido feitas e salvas nas seções anteriores. 
          Aqui você pode imprimir e visualizar os documentos gerados.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {printOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.id} className={`border-2 transition-colors ${
                option.hasContent 
                  ? 'hover:border-purple-300 border-purple-200' 
                  : 'hover:border-gray-300 border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className={`w-5 h-5 ${
                      option.hasContent ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <h3 className="font-medium">{option.title}</h3>
                    {option.hasContent && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Disponível
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  
                  <div className="flex gap-2">
                    {option.id === "plano-alimentar" && nutritionalPlan && (
                      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Pré-visualização - Plano Alimentar</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-medium mb-2">Paciente: {selectedPatient?.lead.nome}</h3>
                              <p className="text-sm text-gray-600">
                                Data: {new Date().toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-sm font-mono">
                                {nutritionalPlan}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    <Button 
                      onClick={() => handlePrint(option.id)}
                      className={`flex-1 ${
                        option.hasContent 
                          ? '' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      variant={option.hasContent ? "default" : "outline"}
                      disabled={!option.hasContent && option.id !== "plano-alimentar"}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {option.hasContent ? 'Baixar PDF' : 'Indisponível'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!consultationId && (
          <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              Selecione uma consulta para gerar e visualizar os documentos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
