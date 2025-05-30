
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const Kanban = () => {
  const columns = [
    {
      id: "novos",
      title: "Novos Leads",
      count: 3,
      color: "bg-blue-500",
      leads: [
        { id: 1, nome: "Ricardo Borges", objetivo: "Aproveitadora por idade", telefone: "(11) 99705-4321" },
        { id: 2, nome: "Juliana Ramos", objetivo: "Isenção ID", telefone: "(21) 98134-5566" },
        { id: 3, nome: "Paulo Henrique", objetivo: "Aproveitadora por idade", telefone: "(31) 97765-4321" },
      ]
    },
    {
      id: "analise",
      title: "Em Análise",
      count: 2,
      color: "bg-yellow-500",
      leads: [
        { id: 4, nome: "João Souza", objetivo: "Auxílio acidente", telefone: "(19) 98765-4321" },
        { id: 5, nome: "Ana Paula", objetivo: "Auxílio-doença", telefone: "(11) 96765-4321" },
      ]
    },
    {
      id: "qualificado",
      title: "Qualificado",
      count: 4,
      color: "bg-purple-500",
      leads: [
        { id: 6, nome: "Carlos Lima", objetivo: "Aguardando Resposta", telefone: "(21) 98765-4321" },
        { id: 7, nome: "Beatriz Gomes", objetivo: "Pensão por morte", telefone: "(31) 98765-4321" },
        { id: 8, nome: "Ricardo Silva", objetivo: "Aposentadoria especial", telefone: "(41) 98765-4321" },
        { id: 9, nome: "Mariana Costa", objetivo: "Revisão de benefício", telefone: "(51) 98765-4321" },
      ]
    },
    {
      id: "enviado",
      title: "Contr. Enviado",
      count: 1,
      color: "bg-blue-600",
      leads: [
        { id: 10, nome: "Fernando Alves", objetivo: "Planejamento Previdenciário", telefone: "(61) 98765-4321" },
      ]
    },
    {
      id: "assinado",
      title: "Contr. Assinado",
      count: 2,
      color: "bg-green-500",
      leads: [
        { id: 11, nome: "Luciana Santos", objetivo: "Revisão de benefício", telefone: "(71) 98765-4321" },
        { id: 12, nome: "Roberto Lima", objetivo: "Auxílio-doença", telefone: "(81) 98765-4321" },
      ]
    },
    {
      id: "perdido",
      title: "Perdido",
      count: 1,
      color: "bg-red-500",
      leads: [
        { id: 13, nome: "Sandra Oliveira", objetivo: "Pensão por morte", telefone: "(91) 98765-4321" },
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white">Kanban de Leads</h1>
          <p className="text-gray-400">Gerencie o fluxo dos seus leads</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <Button className="bg-primary">COMERCIAL</Button>
        <Button variant="outline">OPERACIONAL</Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                <Badge className={column.color}>{column.count}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.leads.map((lead) => (
                <Card key={lead.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{lead.telefone}</p>
                    <p className="text-xs text-gray-600">Última Resposta</p>
                    <p className="text-xs text-gray-600">Próx. Atividade</p>
                    <Badge variant="outline" className="text-xs">
                      {lead.objetivo}
                    </Badge>
                  </div>
                </Card>
              ))}
              
              {/* Add new lead button */}
              <Button 
                variant="outline" 
                className="w-full h-20 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Conversa
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
