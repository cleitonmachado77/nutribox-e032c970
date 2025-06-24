
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Grid3x3, 
  List, 
  SortAsc, 
  SortDesc, 
  Download, 
  Upload, 
  Filter,
  RefreshCw,
  Settings,
  Plus,
  FileText
} from "lucide-react";

interface PacientesToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onExport: () => void;
  onImport: () => void;
  selectedCount: number;
  totalCount: number;
}

export const PacientesToolbar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onExport,
  onImport,
  selectedCount,
  totalCount
}: PacientesToolbarProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Lado esquerdo - Informações e ações principais */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {totalCount} pacientes
            </span>
            {selectedCount > 0 && (
              <Badge variant="secondary">
                {selectedCount} selecionados
              </Badge>
            )}
          </div>

          {/* Botões de ação principal */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-1" />
              Novo Paciente
            </Button>
            
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-1" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Lado direito - Controles de visualização e ações */}
        <div className="flex items-center gap-3">
          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Data de Cadastro</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="progresso">Progresso</SelectItem>
                <SelectItem value="ultima_consulta">Última Consulta</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          {/* Visualização */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="px-2 py-1"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-2 py-1"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Ações de dados */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onImport}>
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Ações em lote quando há seleções */}
      {selectedCount > 0 && (
        <div className="mt-4 pt-4 border-t flex items-center gap-2">
          <span className="text-sm text-gray-600">Ações em lote:</span>
          <Button size="sm" variant="outline">
            Exportar Selecionados
          </Button>
          <Button size="sm" variant="outline">
            Agendar Consultas
          </Button>
          <Button size="sm" variant="outline">
            Enviar Mensagem
          </Button>
          <Button size="sm" variant="destructive">
            Arquivar
          </Button>
        </div>
      )}
    </div>
  );
};
