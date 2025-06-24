
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, ChevronDown, X } from "lucide-react";

interface PacientesFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: {
    status: string;
    objetivo: string;
    progresso: string;
    dataRange: any;
  };
}

export const PacientesFilters = ({ onFiltersChange, activeFilters }: PacientesFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      objetivo: '',
      progresso: '',
      dataRange: null
    };
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(activeFilters).filter(value => 
    value !== '' && value !== null
  ).length;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filtros Avançados</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}>
                    <X className="w-3 h-3 mr-1" />
                    Limpar
                  </Button>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status do Tratamento */}
              <div>
                <Label>Status do Tratamento</Label>
                <Select 
                  value={activeFilters.status || "all"} 
                  onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Objetivo */}
              <div>
                <Label>Objetivo</Label>
                <Select 
                  value={activeFilters.objetivo || "all"} 
                  onValueChange={(value) => handleFilterChange("objetivo", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Perda de Peso">Perda de Peso</SelectItem>
                    <SelectItem value="Ganho de Massa">Ganho de Massa</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                    <SelectItem value="Definição">Definição</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nível de Progresso */}
              <div>
                <Label>Nível de Progresso</Label>
                <Select 
                  value={activeFilters.progresso || "all"} 
                  onValueChange={(value) => handleFilterChange("progresso", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="low">Baixo (&lt; 30%)</SelectItem>
                    <SelectItem value="medium">Médio (30-70%)</SelectItem>
                    <SelectItem value="high">Alto (&gt; 70%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Período de Acompanhamento */}
              <div>
                <Label>Tempo de Acompanhamento</Label>
                <Select 
                  value="all" 
                  onValueChange={() => {}}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="new">Novos (&lt; 1 mês)</SelectItem>
                    <SelectItem value="recent">Recentes (1-3 meses)</SelectItem>
                    <SelectItem value="established">Estabelecidos (3-6 meses)</SelectItem>
                    <SelectItem value="long-term">Longo prazo (&gt; 6 meses)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtros rápidos */}
            <div className="mt-4 pt-4 border-t">
              <Label className="text-sm font-medium mb-2 block">Filtros Rápidos:</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  🔥 Alta Prioridade
                </Button>
                <Button variant="outline" size="sm">
                  📅 Consulta Hoje
                </Button>
                <Button variant="outline" size="sm">
                  ⚠️ Sem Interação (7 dias)
                </Button>
                <Button variant="outline" size="sm">
                  🎯 Meta Próxima
                </Button>
                <Button variant="outline" size="sm">
                  📈 Alto Progresso
                </Button>
                <Button variant="outline" size="sm">
                  📉 Progresso Estagnado
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
