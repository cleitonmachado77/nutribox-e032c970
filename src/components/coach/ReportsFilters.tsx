
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportsFiltersProps {
  onFiltersChange: (filters: any) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const ReportsFilters = ({ onFiltersChange, selectedPeriod, onPeriodChange }: ReportsFiltersProps) => {
  const [filters, setFilters] = useState({
    dateRange: null as { from: Date; to: Date } | null,
    patientType: "",
    engagementLevel: "",
    goalStatus: "",
    customPeriod: false
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      dateRange: null,
      patientType: "",
      engagementLevel: "",
      goalStatus: "",
      customPeriod: false
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onPeriodChange('last-30-days');
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== "" && value !== false && value !== null
  ).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h3 className="font-medium">Filtros Avançados</h3>
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Período Padrão */}
          <div>
            <Label>Período</Label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Período Personalizado */}
          {selectedPeriod === 'custom' && (
            <div>
              <Label>Data Personalizada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      "Selecionar período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={filters.dateRange || undefined}
                    onSelect={(range) => handleFilterChange("dateRange", range)}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Tipo de Paciente */}
          <div>
            <Label>Tipo de Paciente</Label>
            <Select 
              value={filters.patientType || "all"} 
              onValueChange={(value) => handleFilterChange("patientType", value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos (< 30 dias)</SelectItem>
                <SelectItem value="regular">Regulares</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nível de Engajamento */}
          <div>
            <Label>Engajamento</Label>
            <Select 
              value={filters.engagementLevel || "all"} 
              onValueChange={(value) => handleFilterChange("engagementLevel", value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="high">Alto (>80%)</SelectItem>
                <SelectItem value="medium">Médio (40-80%)</SelectItem>
                <SelectItem value="low">Baixo (<40%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status das Metas */}
          <div>
            <Label>Status das Metas</Label>
            <Select 
              value={filters.goalStatus || "all"} 
              onValueChange={(value) => handleFilterChange("goalStatus", value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="on-track">No prazo</SelectItem>
                <SelectItem value="behind">Atrasadas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
