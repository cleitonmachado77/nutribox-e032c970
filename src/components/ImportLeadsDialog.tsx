
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateLead } from "@/hooks/useLeads";

interface ImportLeadsDialogProps {
  children: React.ReactNode;
}

export const ImportLeadsDialog = ({ children }: ImportLeadsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createLead = useCreateLead();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          selectedFile.type === "application/vnd.ms-excel" ||
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.",
          variant: "destructive",
        });
      }
    }
  };

  const processExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          
          // Para CSV simples - em produção você usaria uma biblioteca como xlsx ou papa-parse
          if (file.name.endsWith('.csv')) {
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            const leads = [];
            
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const lead: any = {};
                
                headers.forEach((header, index) => {
                  const value = values[index] || '';
                  switch (header.toLowerCase()) {
                    case 'nome':
                    case 'name':
                      lead.nome = value;
                      break;
                    case 'telefone':
                    case 'phone':
                      lead.telefone = value;
                      break;
                    case 'email':
                      lead.email = value;
                      break;
                    case 'cidade':
                    case 'city':
                      lead.cidade = value;
                      break;
                    case 'estado':
                    case 'state':
                      lead.estado = value;
                      break;
                    case 'objetivo':
                    case 'goal':
                      lead.objetivo = value;
                      break;
                    case 'peso':
                    case 'weight':
                      lead.peso = value;
                      break;
                    case 'altura':
                    case 'height':
                      lead.altura = value;
                      break;
                    case 'anotacoes':
                    case 'notes':
                      lead.anotacoes = value;
                      break;
                  }
                });
                
                if (lead.nome && lead.telefone) {
                  leads.push(lead);
                }
              }
            }
            resolve(leads);
          } else {
            // Para arquivos Excel, você precisaria da biblioteca xlsx
            toast({
              title: "Formato não suportado",
              description: "Atualmente apenas arquivos CSV são suportados. Use o modelo para baixar um exemplo.",
              variant: "destructive",
            });
            resolve([]);
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao processar o arquivo. Verifique o formato.",
            variant: "destructive",
          });
          resolve([]);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const leads = await processExcelFile(file);
      
      if (leads.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum lead válido encontrado no arquivo.",
          variant: "destructive",
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const leadData of leads) {
        try {
          // Calcular IMC se peso e altura estiverem disponíveis
          let imc = "";
          if (leadData.peso && leadData.altura) {
            const pesoNum = parseFloat(leadData.peso);
            const alturaNum = parseFloat(leadData.altura) / 100;
            if (pesoNum > 0 && alturaNum > 0) {
              imc = (pesoNum / (alturaNum * alturaNum)).toFixed(1);
            }
          }

          await createLead.mutateAsync({
            ...leadData,
            imc,
            status: "novo",
            progresso: 0,
            foto_perfil: "",
            objetivo_tag_id: null,
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Erro ao criar lead:', error);
        }
      }

      toast({
        title: "Importação concluída",
        description: `${successCount} leads importados com sucesso. ${errorCount > 0 ? `${errorCount} leads falharam.` : ''}`,
      });

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro durante a importação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "nome,telefone,email,cidade,estado,objetivo,peso,altura,anotacoes\n" +
                      "João Silva,11999999999,joao@email.com,São Paulo,SP,Perda de peso,80,175,Cliente interessado em emagrecimento\n" +
                      "Maria Santos,21888888888,maria@email.com,Rio de Janeiro,RJ,Ganho de massa,60,165,Quer ganhar massa muscular";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'modelo_leads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Leads</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Arquivo Excel/CSV</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              Selecione um arquivo Excel (.xlsx, .xls) ou CSV com os dados dos leads.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Colunas necessárias:</h4>
            <p className="text-sm text-gray-600">
              nome, telefone, email, cidade, estado, objetivo, peso, altura, anotacoes
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="mt-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Modelo
            </Button>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{file.name}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleImport} 
              disabled={!file || isProcessing}
              className="flex-1"
            >
              {isProcessing ? "Importando..." : "Importar Leads"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
