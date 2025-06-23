
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Target } from "lucide-react";

interface GoalCreateDialogProps {
  onGoalCreated: (goal: any) => void;
}

export const GoalCreateDialog = ({ onGoalCreated }: GoalCreateDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    goalType: "",
    title: "",
    targetValue: "",
    unit: "",
    deadline: "",
    description: ""
  });

  const goalTypes = [
    { value: 'weight', label: 'Peso', unit: 'kg' },
    { value: 'hydration', label: 'Hidratação', unit: 'ml' },
    { value: 'exercise', label: 'Exercício', unit: 'vezes/semana' },
    { value: 'diet', label: 'Dieta', unit: 'pontos' },
    { value: 'custom', label: 'Personalizado', unit: '' }
  ];

  const handleGoalTypeChange = (value: string) => {
    const selectedType = goalTypes.find(type => type.value === value);
    setFormData({
      ...formData,
      goalType: value,
      unit: selectedType?.unit || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.goalType || !formData.title || !formData.targetValue || !formData.deadline) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: `p${Math.random().toString(36).substr(2, 3)}`,
      patientName: formData.patientName,
      goalType: formData.goalType as 'weight' | 'hydration' | 'exercise' | 'diet' | 'custom',
      title: formData.title,
      targetValue: parseFloat(formData.targetValue),
      currentValue: 0,
      unit: formData.unit,
      deadline: formData.deadline,
      status: 'active' as const,
      progress: 0,
      trend: 'stable' as const,
      lastUpdate: new Date().toISOString().split('T')[0],
      description: formData.description
    };

    onGoalCreated(newGoal);
    
    toast({
      title: "Meta criada",
      description: `Meta "${formData.title}" criada para ${formData.patientName}`
    });

    setFormData({
      patientName: "",
      goalType: "",
      title: "",
      targetValue: "",
      unit: "",
      deadline: "",
      description: ""
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Nova Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              placeholder="Digite o nome do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="goalType">Tipo de Meta *</Label>
            <Select value={formData.goalType} onValueChange={handleGoalTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de meta" />
              </SelectTrigger>
              <SelectContent>
                {goalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título da Meta *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Perder 5kg em 3 meses"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetValue">Valor Alvo *</Label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="kg, ml, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Prazo *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição adicional da meta..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Criar Meta
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
