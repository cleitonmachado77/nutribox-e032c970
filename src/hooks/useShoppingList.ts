
import { useState, useEffect } from 'react';
import { useConsultationData } from './useConsultationData';

export interface ShoppingListItem {
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
}

export interface ShoppingListData {
  items: ShoppingListItem[];
  generatedFrom: string;
  generatedAt: Date;
}

export const useShoppingList = (patientId: string, consultationId?: string) => {
  const { getSavedNutritionalPlan } = useConsultationData(patientId, consultationId);
  const [shoppingList, setShoppingList] = useState<ShoppingListData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateShoppingList = async () => {
    if (!consultationId) return null;
    
    setIsLoading(true);
    try {
      const nutritionalPlan = await getSavedNutritionalPlan();
      if (!nutritionalPlan) return null;

      const items = extractIngredientsFromPlan(nutritionalPlan);
      const consolidatedItems = consolidateItems(items);
      
      const shoppingListData: ShoppingListData = {
        items: consolidatedItems,
        generatedFrom: `Plano Alimentar - Consulta ${consultationId}`,
        generatedAt: new Date()
      };

      setShoppingList(shoppingListData);
      return shoppingListData;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const extractIngredientsFromPlan = (planContent: string): ShoppingListItem[] => {
    const items: ShoppingListItem[] = [];
    
    // Definir categorias de alimentos
    const foodCategories = {
      'Proteínas': ['frango', 'peixe', 'carne', 'ovos', 'salmão', 'tilápia', 'peito de frango', 'carne magra', 'patinho', 'alcatra', 'atum', 'sardinha'],
      'Carboidratos': ['arroz', 'quinoa', 'aveia', 'pão', 'batata doce', 'batata', 'macarrão', 'tapioca', 'mandioca', 'inhame'],
      'Vegetais': ['brócolis', 'couve', 'alface', 'tomate', 'cenoura', 'abobrinha', 'berinjela', 'pepino', 'rúcula', 'espinafre', 'chuchu', 'vagem'],
      'Frutas': ['banana', 'maçã', 'laranja', 'morango', 'abacaxi', 'mamão', 'pêra', 'uva', 'melancia', 'manga', 'frutas vermelhas'],
      'Laticínios': ['iogurte', 'leite', 'queijo', 'ricota', 'cottage', 'requeijão'],
      'Oleaginosas': ['castanha', 'amêndoa', 'nozes', 'amendoim', 'chia', 'linhaça'],
      'Temperos/Condimentos': ['azeite', 'óleo', 'sal', 'açúcar', 'mel', 'canela', 'orégano', 'alho', 'cebola'],
      'Outros': ['granola', 'proteína', 'whey', 'suplemento']
    };

    // Normalizar o texto do plano
    const normalizedPlan = planContent.toLowerCase();
    
    // Buscar alimentos em cada categoria
    Object.entries(foodCategories).forEach(([category, foods]) => {
      foods.forEach(food => {
        if (normalizedPlan.includes(food)) {
          // Evitar duplicatas
          if (!items.some(item => item.name.toLowerCase() === food)) {
            items.push({
              name: food.charAt(0).toUpperCase() + food.slice(1),
              category: category
            });
          }
        }
      });
    });

    return items;
  };

  const consolidateItems = (items: ShoppingListItem[]): ShoppingListItem[] => {
    // Agrupar por categoria e ordenar
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);

    // Ordenar categorias e itens dentro de cada categoria
    const orderedCategories = ['Proteínas', 'Carboidratos', 'Vegetais', 'Frutas', 'Laticínios', 'Oleaginosas', 'Temperos/Condimentos', 'Outros'];
    const consolidatedItems: ShoppingListItem[] = [];

    orderedCategories.forEach(category => {
      if (groupedItems[category]) {
        consolidatedItems.push(...groupedItems[category].sort((a, b) => a.name.localeCompare(b.name)));
      }
    });

    return consolidatedItems;
  };

  const exportShoppingList = () => {
    if (!shoppingList) return;

    const content = generateShoppingListContent(shoppingList);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista_compras_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateShoppingListContent = (data: ShoppingListData): string => {
    let content = `LISTA DE COMPRAS\n`;
    content += `Gerada em: ${data.generatedAt.toLocaleDateString('pt-BR')}\n`;
    content += `Baseada em: ${data.generatedFrom}\n\n`;

    const itemsByCategory = data.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);

    Object.entries(itemsByCategory).forEach(([category, items]) => {
      content += `${category.toUpperCase()}:\n`;
      items.forEach(item => {
        content += `- ${item.name}\n`;
      });
      content += `\n`;
    });

    return content;
  };

  return {
    shoppingList,
    generateShoppingList,
    exportShoppingList,
    isLoading
  };
};
