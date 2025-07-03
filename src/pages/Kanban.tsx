
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { EditLeadDialog } from "@/components/EditLeadDialog";
import { DeleteLeadDialog } from "@/components/DeleteLeadDialog";
import { useLeads } from "@/hooks/useLeads";
import { Lead } from "@/types/lead";
import { Link } from "react-router-dom";

const comercialColumns = [{
  id: "novos",
  title: "Novos Leads",
  color: "bg-blue-500",
  borderColor: "border-blue-300",
  status: "novo"
}, {
  id: "qualificado",
  title: "Qualificado",
  color: "bg-green-500",
  borderColor: "border-green-300",
  status: "qualificado"
}, {
  id: "agendado",
  title: "Consulta Agendada",
  color: "bg-yellow-500",
  borderColor: "border-yellow-300",
  status: "consulta_agendada"
}, {
  id: "realizada",
  title: "Consulta Realizada",
  color: "bg-purple-500",
  borderColor: "border-purple-300",
  status: "consulta_realizada"
}, {
  id: "perdido",
  title: "Perdido",
  color: "bg-red-500",
  borderColor: "border-red-300",
  status: "perdido"
}, {
  id: "arquivado",
  title: "Arquivado",
  color: "bg-gray-500",
  borderColor: "border-gray-300",
  status: "arquivado"
}];

const Kanban = () => {
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);
  const [editLeadDialogOpen, setEditLeadDialogOpen] = useState(false);
  const [deleteLeadDialogOpen, setDeleteLeadDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const {
    data: leads = [],
    isLoading,
    error
  } = useLeads();

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setEditLeadDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteLeadDialogOpen(true);
  };

  const handleAddNew = () => {
    setNewLeadDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Kanban de Leads" description="Gerencie o fluxo dos seus leads" />
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-500 text-sm">Carregando leads...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Header title="Kanban de Leads" description="Gerencie o fluxo dos seus leads" />
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erro ao carregar leads: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Header title="Kanban de Leads" description="Gerencie o fluxo dos seus leads" />

        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-soft">
            COMERCIAL
          </Button>
          <Button variant="outline" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50">
            <Link to="/dashboard/kanban-operacional">OPERACIONAL</Link>
          </Button>
        </div>

        <KanbanBoard 
          leads={leads} 
          columns={comercialColumns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onAddNew={handleAddNew} 
        />

        <NewLeadDialog open={newLeadDialogOpen} onOpenChange={setNewLeadDialogOpen} />

        {selectedLead && (
          <>
            <EditLeadDialog 
              open={editLeadDialogOpen} 
              onOpenChange={setEditLeadDialogOpen} 
              lead={selectedLead} 
            />
            <DeleteLeadDialog 
              open={deleteLeadDialogOpen} 
              onOpenChange={setDeleteLeadDialogOpen} 
              lead={selectedLead} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Kanban;
