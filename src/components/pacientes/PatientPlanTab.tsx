
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Camera, Video, Plus, Download, Save } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";
import { StandardPlansManager } from "./StandardPlansManager";
import { useToast } from "@/hooks/use-toast";

interface PatientPlanTabProps {
  selectedPatient: Paciente;
}

export const PatientPlanTab = ({ selectedPatient }: PatientPlanTabProps) => {
  const [planoAlimentar, setPlanoAlimentar] = useState("");
  const [isStandardPlansOpen, setIsStandardPlansOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar plano alimentar salvo para este paciente
    const savedPlan = localStorage.getItem(`patient_plan_${selectedPatient.id}`);
    if (savedPlan) {
      setPlanoAlimentar(savedPlan);
    } else if (selectedPatient.lead.plano_alimentar) {
      setPlanoAlimentar(selectedPatient.lead.plano_alimentar);
    }
  }, [selectedPatient.id]);

  const handleSavePlan = () => {
    localStorage.setItem(`patient_plan_${selectedPatient.id}`, planoAlimentar);
    toast({
      title: "Sucesso!",
      description: "Plano alimentar salvo com sucesso"
    });
  };

  const handleSelectStandardPlan = (plan: any) => {
    setPlanoAlimentar(plan.conteudo);
    setIsStandardPlansOpen(false);
    toast({
      title: "Plano Aplicado!",
      description: `Plano "${plan.nome}" foi aplicado ao paciente`
    });
  };

  const handleExportPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Plano Alimentar - ${selectedPatient.lead.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7C3AED; padding-bottom: 20px; }
          .patient-info { background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .content { white-space: pre-wrap; }
          h1 { color: #7C3AED; margin: 0; }
          h2 { color: #5B21B6; margin-top: 30px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Plano Alimentar Personalizado</h1>
          <p>Desenvolvido especialmente para você</p>
        </div>
        
        <div class="patient-info">
          <h2>Informações do Paciente</h2>
          <p><strong>Nome:</strong> ${selectedPatient.lead.nome}</p>
          <p><strong>Telefone:</strong> ${selectedPatient.lead.telefone}</p>
          <p><strong>Email:</strong> ${selectedPatient.lead.email || 'Não informado'}</p>
          <p><strong>Objetivo:</strong> ${selectedPatient.lead.objetivo || 'Não definido'}</p>
          <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <h2>Plano Alimentar</h2>
        <div class="content">${planoAlimentar || 'Nenhum plano alimentar definido ainda.'}</div>
        
        <div class="footer">
          <p>Este plano foi elaborado especialmente para você. Siga as orientações e em caso de dúvidas, entre em contato.</p>
          <p>© ${new Date().getFullYear()} - Plano Alimentar Personalizado</p>
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

    toast({
      title: "Sucesso!",
      description: "Plano alimentar exportado com sucesso"
    });
  };

  const handleGenerateNewPlan = () => {
    const suggestions = [
      "Considere incluir proteínas de alta qualidade em cada refeição",
      "Adicione vegetais variados para garantir vitaminas e minerais",
      "Inclua carboidratos complexos para energia sustentada",
      "Não esqueça das gorduras boas como azeite, castanhas e abacate",
      "Mantenha hidratação adequada ao longo do dia",
      "Considere o timing das refeições conforme a rotina do paciente"
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    toast({
      title: "Dica para o Plano",
      description: randomSuggestion
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-purple-800">Plano Alimentar Atual</h3>
        <div className="flex gap-2">
          <Dialog open={isStandardPlansOpen} onOpenChange={setIsStandardPlansOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Planos Padrão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gerenciar Planos Alimentares Padrão</DialogTitle>
              </DialogHeader>
              <StandardPlansManager onSelectPlan={handleSelectStandardPlan} />
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleGenerateNewPlan}
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gerar Novo Plano
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            <Camera className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Video className="w-4 h-4 mr-2" />
            Adicionar Vídeo
          </Button>
        </div>
      </div>

      <Card className="border-2 border-purple-200">
        <CardContent className="p-6">
          <Textarea 
            value={planoAlimentar}
            onChange={(e) => setPlanoAlimentar(e.target.value)}
            className="min-h-64 border-2 border-purple-200 focus:border-purple-500 focus-visible:ring-purple-500" 
            placeholder="Digite o plano alimentar do paciente..." 
          />
          
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={handleSavePlan}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Plano
            </Button>
            
            <Button 
              onClick={handleExportPDF}
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">💡 Dicas para um bom plano alimentar:</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Inclua todos os grupos alimentares</li>
          <li>• Considere as preferências e restrições do paciente</li>
          <li>• Estabeleça horários regulares para as refeições</li>
          <li>• Ajuste as porções conforme os objetivos</li>
          <li>• Monitore e ajuste conforme necessário</li>
        </ul>
      </div>
    </>
  );
};
