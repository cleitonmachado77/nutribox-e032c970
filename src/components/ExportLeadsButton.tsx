
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/hooks/useLeads";

interface ExportLeadsButtonProps {
  leads: Lead[];
}

export const ExportLeadsButton = ({ leads }: ExportLeadsButtonProps) => {
  const { toast } = useToast();

  const generatePDF = () => {
    try {
      // Criar conteúdo HTML para o PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório de Leads</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
            .status-novo { background-color: #06B6D4; }
            .status-qualificado { background-color: #14B8A6; }
            .status-consulta_agendada { background-color: #F59E0B; }
            .status-em_acompanhamento { background-color: #10B981; }
            .status-perdido { background-color: #EF4444; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Relatório de Leads</h1>
          <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          <p><strong>Total de Leads:</strong> ${leads.length}</p>
          
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Cidade/Estado</th>
                <th>Objetivo</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Data Cadastro</th>
              </tr>
            </thead>
            <tbody>
              ${leads.map(lead => `
                <tr>
                  <td>${lead.nome}</td>
                  <td>${lead.telefone}</td>
                  <td>${lead.email || '-'}</td>
                  <td>${lead.cidade || '-'}${lead.estado ? `, ${lead.estado}` : ''}</td>
                  <td>${lead.objetivo_tag?.nome || lead.objetivo || '-'}</td>
                  <td>
                    <span class="status status-${lead.status}">
                      ${formatStatusDisplay(lead.status)}
                    </span>
                  </td>
                  <td>${lead.progresso}%</td>
                  <td>${new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema de gestão de leads</p>
          </div>
        </body>
        </html>
      `;

      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Para uma implementação mais robusta, você usaria uma biblioteca como jsPDF ou html2pdf
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso!",
        description: "Relatório de leads exportado com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar relatório. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatStatusDisplay = (status: string) => {
    switch (status) {
      case "novo":
        return "Novo";
      case "qualificado":
        return "Qualificado";
      case "consulta_agendada":
        return "Consulta Agendada";
      case "em_acompanhamento":
        return "Em Acompanhamento";
      case "perdido":
        return "Perdido";
      default:
        return status;
    }
  };

  return (
    <Button variant="outline" onClick={generatePDF}>
      <Download className="w-4 h-4 mr-2" />
      Exportar
    </Button>
  );
};
