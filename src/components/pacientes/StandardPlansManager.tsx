
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StandardPlan {
  id: string;
  nome: string;
  descricao: string;
  calorias: string;
  macros: string;
  refeicoes: string;
  conteudo: string;
  categoria: string;
  created_at: string;
}

interface StandardPlansManagerProps {
  onSelectPlan: (plan: StandardPlan) => void;
}

export const StandardPlansManager = ({ onSelectPlan }: StandardPlansManagerProps) => {
  const [plans, setPlans] = useState<StandardPlan[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StandardPlan | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    calorias: "",
    macros: "",
    refeicoes: "",
    conteudo: "",
    categoria: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const savedPlans = localStorage.getItem('standardPlans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  };

  const savePlans = (updatedPlans: StandardPlan[]) => {
    localStorage.setItem('standardPlans', JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
  };

  const handleCreatePlan = () => {
    if (!formData.nome || !formData.conteudo) {
      toast({
        title: "Erro",
        description: "Nome e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newPlan: StandardPlan = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString()
    };

    const updatedPlans = [...plans, newPlan];
    savePlans(updatedPlans);
    
    setFormData({
      nome: "",
      descricao: "",
      calorias: "",
      macros: "",
      refeicoes: "",
      conteudo: "",
      categoria: ""
    });
    setIsCreateOpen(false);
    
    toast({
      title: "Sucesso!",
      description: "Plano padrão criado com sucesso"
    });
  };

  const handleEditPlan = () => {
    if (!editingPlan || !formData.nome || !formData.conteudo) {
      toast({
        title: "Erro",
        description: "Nome e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const updatedPlans = plans.map(plan => 
      plan.id === editingPlan.id 
        ? { ...plan, ...formData }
        : plan
    );
    
    savePlans(updatedPlans);
    setEditingPlan(null);
    setFormData({
      nome: "",
      descricao: "",
      calorias: "",
      macros: "",
      refeicoes: "",
      conteudo: "",
      categoria: ""
    });
    
    toast({
      title: "Sucesso!",
      description: "Plano padrão atualizado com sucesso"
    });
  };

  const handleDeletePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    savePlans(updatedPlans);
    
    toast({
      title: "Sucesso!",
      description: "Plano padrão excluído com sucesso"
    });
  };

  const handleDuplicatePlan = (plan: StandardPlan) => {
    const duplicatedPlan: StandardPlan = {
      ...plan,
      id: Date.now().toString(),
      nome: `${plan.nome} - Cópia`,
      created_at: new Date().toISOString()
    };

    const updatedPlans = [...plans, duplicatedPlan];
    savePlans(updatedPlans);
    
    toast({
      title: "Sucesso!",
      description: "Plano duplicado com sucesso"
    });
  };

  const openEditDialog = (plan: StandardPlan) => {
    setEditingPlan(plan);
    setFormData({
      nome: plan.nome,
      descricao: plan.descricao,
      calorias: plan.calorias,
      macros: plan.macros,
      refeicoes: plan.refeicoes,
      conteudo: plan.conteudo,
      categoria: plan.categoria
    });
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      calorias: "",
      macros: "",
      refeicoes: "",
      conteudo: "",
      categoria: ""
    });
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-purple-800">Planos Alimentares Padrão</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Plano Padrão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Plano Padrão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Nome do Plano</label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Plano Emagrecimento Básico"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Categoria</label>
                  <Input
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="Ex: Emagrecimento, Ganho de Massa"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Descrição</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Breve descrição do plano"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Calorias/dia</label>
                  <Input
                    value={formData.calorias}
                    onChange={(e) => setFormData({...formData, calorias: e.target.value})}
                    placeholder="Ex: 1500-1800"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Macros</label>
                  <Input
                    value={formData.macros}
                    onChange={(e) => setFormData({...formData, macros: e.target.value})}
                    placeholder="Ex: 40/30/30"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Refeições</label>
                  <Input
                    value={formData.refeicoes}
                    onChange={(e) => setFormData({...formData, refeicoes: e.target.value})}
                    placeholder="Ex: 5 refeições"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Conteúdo do Plano</label>
                <Textarea
                  value={formData.conteudo}
                  onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                  placeholder="Digite o conteúdo completo do plano alimentar..."
                  className="min-h-64 border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreatePlan}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Criar Plano
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-purple-200 hover:border-purple-400 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-purple-800">{plan.nome}</CardTitle>
                  {plan.categoria && (
                    <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {plan.categoria}
                    </Badge>
                  )}
                </div>
              </div>
              {plan.descricao && (
                <p className="text-sm text-gray-600">{plan.descricao}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {plan.calorias && (
                  <div><strong>Calorias:</strong> {plan.calorias}</div>
                )}
                {plan.macros && (
                  <div><strong>Macros:</strong> {plan.macros}</div>
                )}
                {plan.refeicoes && (
                  <div><strong>Refeições:</strong> {plan.refeicoes}</div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  onClick={() => onSelectPlan(plan)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Aplicar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openEditDialog(plan)}
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDuplicatePlan(plan)}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeletePlan(plan.id)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={!!editingPlan} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plano Padrão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Nome do Plano</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Categoria</label>
                <Input
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Descrição</label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Calorias/dia</label>
                <Input
                  value={formData.calorias}
                  onChange={(e) => setFormData({...formData, calorias: e.target.value})}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Macros</label>
                <Input
                  value={formData.macros}
                  onChange={(e) => setFormData({...formData, macros: e.target.value})}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Refeições</label>
                <Input
                  value={formData.refeicoes}
                  onChange={(e) => setFormData({...formData, refeicoes: e.target.value})}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Conteúdo do Plano</label>
              <Textarea
                value={formData.conteudo}
                onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                className="min-h-64 border-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleEditPlan}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => resetForm()}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {plans.length === 0 && (
        <Card className="border-purple-200 border-dashed">
          <CardContent className="text-center py-12">
            <div className="text-purple-300 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-purple-800 mb-2">Nenhum plano padrão criado</h3>
            <p className="text-purple-600 mb-4">Crie planos alimentares padrão para usar com seus pacientes</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
