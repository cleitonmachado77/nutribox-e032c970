
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Table, BarChart3 } from "lucide-react";

export const ReportsExport = () => {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedSections, setSelectedSections] = useState({
    engagement: true,
    goals: true,
    performance: true,
    insights: true,
    charts: true
  });
  const { toast } = useToast();

  const handleExport = () => {
    const selectedCount = Object.values(selectedSections).filter(Boolean).length;
    
    if (selectedCount === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos uma seção para exportar",
        variant: "destructive"
      });
      return;
    }

    // Simular processo de exportação
    toast({
      title: "Exportação iniciada",
      description: `Gerando relatório em ${exportFormat.toUpperCase()} com ${selectedCount} seções...`
    });

    setTimeout(() => {
      toast({
        title: "Relatório exportado",
        description: `O relatório foi gerado e está sendo baixado automaticamente`
      });
      setOpen(false);
    }, 2000);
  };

  const handleSectionChange = (section: string, checked: boolean) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  const exportOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: Table },
    { value: 'csv', label: 'CSV', icon: BarChart3 }
  ];

  const sections = [
    { key: 'engagement', label: 'Análise de Engajamento', desc: 'Taxa de resposta e interações por paciente' },
    { key: 'goals', label: 'Relatório de Metas', desc: 'Progresso e status das metas dos pacientes' },
    { key: 'performance', label: 'Performance Semanal', desc: 'Estatísticas de mensagens e questionários' },
    { key: 'insights', label: 'Insights da IA', desc: 'Recomendações e padrões identificados' },
    { key: 'charts', label: 'Gráficos e Visualizações', desc: 'Todos os gráficos do período selecionado' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Relatório
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="format">Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Seções a Incluir</Label>
            <div className="mt-3 space-y-3">
              {sections.map((section) => (
                <div key={section.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={section.key}
                    checked={selectedSections[section.key as keyof typeof selectedSections]}
                    onCheckedChange={(checked) => 
                      handleSectionChange(section.key, checked as boolean)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={section.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {section.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {section.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
