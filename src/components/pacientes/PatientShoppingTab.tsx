
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Download, RefreshCw, Calendar } from "lucide-react";
import { useShoppingList, ShoppingListItem } from "@/hooks/useShoppingList";
import { toast } from "sonner";

interface PatientShoppingTabProps {
  patientId: string;
  consultationId?: string;
}

export const PatientShoppingTab = ({ patientId, consultationId }: PatientShoppingTabProps) => {
  const { shoppingList, generateShoppingList, exportShoppingList, isLoading } = useShoppingList(patientId, consultationId);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'custom'>('all');

  useEffect(() => {
    if (consultationId) {
      handleGenerateList();
    }
  }, [consultationId]);

  const handleGenerateList = async () => {
    try {
      const result = await generateShoppingList();
      if (result) {
        toast.success("Lista de compras gerada com sucesso!");
      } else {
        toast.error("Nenhum plano alimentar encontrado para gerar a lista");
      }
    } catch (error) {
      toast.error("Erro ao gerar lista de compras");
    }
  };

  const handleExportList = () => {
    if (!shoppingList) {
      toast.error("Nenhuma lista para exportar");
      return;
    }
    
    exportShoppingList();
    toast.success("Lista exportada com sucesso!");
  };

  const groupItemsByCategory = (items: ShoppingListItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Proteínas': 'bg-red-100 text-red-800',
      'Carboidratos': 'bg-yellow-100 text-yellow-800',
      'Vegetais': 'bg-green-100 text-green-800',
      'Frutas': 'bg-orange-100 text-orange-800',
      'Laticínios': 'bg-blue-100 text-blue-800',
      'Oleaginosas': 'bg-purple-100 text-purple-800',
      'Temperos/Condimentos': 'bg-gray-100 text-gray-800',
      'Outros': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Lista de Compras</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateList}
            disabled={isLoading || !consultationId}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Gerando...' : 'Gerar Lista'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExportList}
            disabled={!shoppingList}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações da Lista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('all')}
            >
              Todo o Período
            </Button>
            <Button
              variant={selectedPeriod === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('custom')}
            >
              Data Personalizada
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Compras */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Lista Consolidada por Itens
            </CardTitle>
            {shoppingList && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Gerada em: {shoppingList.generatedAt.toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!consultationId ? (
            <div className="text-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Selecione uma consulta para gerar a lista de compras</p>
            </div>
          ) : !shoppingList ? (
            <div className="text-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma lista de compras gerada ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Clique em "Gerar Lista" para criar uma lista baseada no plano alimentar principal.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Baseado em:</strong> {shoppingList.generatedFrom}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Lista consolidada com {shoppingList.items.length} itens organizados por categoria
                </p>
              </div>

              {Object.entries(groupItemsByCategory(shoppingList.items)).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-500">({items.length} itens)</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ml-4">
                    {items.map((item, index) => (
                      <div key={`${category}-${index}`} className="bg-white border rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        </div>
                        {item.quantity && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.quantity} {item.unit}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {category !== 'Outros' && <Separator />}
                </div>
              ))}

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">
                  💡 <strong>Dica:</strong> Esta lista foi gerada automaticamente com base no plano alimentar principal. 
                  As caixas de seleção podem ser usadas para marcar itens já comprados.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
