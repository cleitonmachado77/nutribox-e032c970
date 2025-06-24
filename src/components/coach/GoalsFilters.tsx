
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface GoalsFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const GoalsFilters = ({ onFiltersChange }: GoalsFiltersProps) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    goalType: "",
    patient: ""
  });

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" values back to empty strings for filtering logic
    const filterValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      status: "",
      goalType: "",
      patient: ""
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h3 className="font-medium">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar metas..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="paused">Pausada</SelectItem>
              <SelectItem value="overdue">Em Atraso</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.goalType || "all"} onValueChange={(value) => handleFilterChange("goalType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Meta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="weight">Peso</SelectItem>
              <SelectItem value="hydration">Hidratação</SelectItem>
              <SelectItem value="exercise">Exercício</SelectItem>
              <SelectItem value="diet">Dieta</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Paciente..."
            value={filters.patient}
            onChange={(e) => handleFilterChange("patient", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
