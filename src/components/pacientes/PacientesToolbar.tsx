
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  FileText,
  Search
} from "lucide-react";

interface PacientesToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onAddNew: () => void;
}

export const PacientesToolbar = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  onAddNew
}: PacientesToolbarProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Barra de pesquisa */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={onAddNew} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" />
            Novo Paciente
          </Button>
        </div>

        {/* Controles de visualização e ordenação */}
        <div className="flex items-center gap-3">
          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
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
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          {/* Visualização */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-2 py-1"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-2 py-1"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
