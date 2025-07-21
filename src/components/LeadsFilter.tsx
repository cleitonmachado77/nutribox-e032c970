
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, X } from "lucide-react";
import { useObjetivoTags } from "@/hooks/useObjetivoTags";

interface LeadsFilterProps {
  onFilter: (filters: FilterCriteria) => void;
  onClearFilters: () => void;
}

export interface FilterCriteria {
  status?: string;
  estado?: string;
  objetivo_tag_id?: string;
  progresso_min?: number;
  progresso_max?: number;
  data_inicio?: string;
  data_fim?: string;
}

export const LeadsFilter = ({ onFilter, onClearFilters }: LeadsFilterProps) => {
  const [open, setOpen] = useState(false);
  const { data: objetivoTags = [] } = useObjetivoTags();
  
  const [filters, setFilters] = useState<FilterCriteria>({});

  const statusOptions = [
    { value: "novo", label: "Novo" },
    { value: "qualificado", label: "Qualificado" },
    { value: "consulta_agendada", label: "Consulta Agendada" },
    { value: "em_acompanhamento", label: "Em Acompanhamento" },
    { value: "perdido", label: "Perdido" },
  ];

  const handleApplyFilters = () => {
    // Convert "all" values back to undefined
    const processedFilters = {
      ...filters,
      status: filters.status === "all" ? undefined : filters.status,
      objetivo_tag_id: filters.objetivo_tag_id === "all" ? undefined : filters.objetivo_tag_id,
    };
    onFilter(processedFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar Leads</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select 
              value={filters.status || "all"} 
              onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Estado</Label>
            <Input
              value={filters.estado || ""}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value || undefined })}
              placeholder="Ex: SP, RJ, MG..."
            />
          </div>

          <div>
            <Label>Tag de Objetivo</Label>
            <Select 
              value={filters.objetivo_tag_id || "all"} 
              onValueChange={(value) => setFilters({ ...filters, objetivo_tag_id: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {objetivoTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.cor }}
                      />
                      {tag.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Progresso Mín. (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={filters.progresso_min || ""}
                onChange={(e) => setFilters({ ...filters, progresso_min: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Progresso Máx. (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={filters.progresso_max || ""}
                onChange={(e) => setFilters({ ...filters, progresso_max: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filters.data_inicio || ""}
                onChange={(e) => setFilters({ ...filters, data_inicio: e.target.value || undefined })}
              />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filters.data_fim || ""}
                onChange={(e) => setFilters({ ...filters, data_fim: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
