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
const operacionalColumns = [{
  id: "realizada",
  title: "Consulta Realizada",
  color: "bg-purple-500",
  borderColor: "border-purple-300",
  status: "consulta_realizada"
}, {
  id: "acompanhamento",
  title: "Em Acompanhamento",
  color: "bg-green-600",
  borderColor: "border-green-400",
  status: "em_acompanhamento"
}, {
  id: "retorno",
  title: "Retorno Agendado",
  color: "bg-blue-600",
  borderColor: "border-blue-400",
  status: "retorno_agendado"
}, {
  id: "alta",
  title: "Alta Médica",
  color: "bg-emerald-500",
  borderColor: "border-emerald-300",
  status: "alta_medica"
}, {
  id: "pausado",
  title: "Pausado",
  color: "bg-yellow-600",
  borderColor: "border-yellow-400",
  status: "pausado"
}, {
  id: "finalizado",
  title: "Finalizado",
  color: "bg-gray-600",
  borderColor: "border-gray-400",
  status: "finalizado"
}];
const KanbanOperacional = () => {
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
    return <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Header title="Kanban Operacional" description="Gerencie o fluxo operacional dos seus pacientes" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>;
  }
  if (error) {
    return <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Header title="Kanban Operacional" description="Gerencie o fluxo operacional dos seus pacientes" />
        <div className="text-center text-red-500">
          Erro ao carregar leads: {error.message}
        </div>
      </div>;
  }
  return <div className="p-6 space-y-6 min-h-screen bg-indigo-950">
      <Header title="Kanban Operacional" description="Gerencie o fluxo operacional dos seus pacientes" />

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link to="/dashboard/kanban">COMERCIAL</Link>
        </Button>
        <Button className="bg-primary text-white">OPERACIONAL</Button>
      </div>

      <KanbanBoard leads={leads} columns={operacionalColumns} onEdit={handleEdit} onDelete={handleDelete} onAddNew={handleAddNew} />

      <NewLeadDialog open={newLeadDialogOpen} onOpenChange={setNewLeadDialogOpen} />

      {selectedLead && <>
          <EditLeadDialog open={editLeadDialogOpen} onOpenChange={setEditLeadDialogOpen} lead={selectedLead} />
          <DeleteLeadDialog open={deleteLeadDialogOpen} onOpenChange={setDeleteLeadDialogOpen} lead={selectedLead} />
        </>}
    </div>;
};
export default KanbanOperacional;