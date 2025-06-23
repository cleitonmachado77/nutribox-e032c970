
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";

interface PatientGoal {
  id: string;
  patientId: string;
  patientName: string;
  goalType: 'weight' | 'hydration' | 'exercise' | 'diet' | 'custom';
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  progress: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdate: string;
  description?: string;
}

interface GoalEditDialogProps {
  goal: PatientGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalUpdated: (goal: PatientGoal) => void;
}

export const GoalEditDialog = ({ goal, open, onOpenChange, onGoalUpdated }: GoalEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: goal.patientName,
    title: goal.title,
    targetValue: goal.targetValue.toString(),
    currentValue: goal.currentValue.toString(),
    unit: goal.unit,
    deadline: goal.deadline,
    status: goal.status,
    description: goal.description || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedGoal = {
      ...goal,
      patientName: formData.patientName,
      title: formData.title,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      unit: formData.unit,
      deadline: formData.deadline,
      status: formData.status as PatientGoal['status'],
      progress: Math.min((parseFloat(formData.currentValue) / parseFloat(formData.targetValue)) * 100, 100),
      lastUpdate: new Date().toISOString().split('T')[0],
      description: formData.description
    };

    onGoalUpdated(updatedGoal);
    
    toast({
      title: "Meta atualizada",
      description: `Meta "${formData.title}" foi atualizada com sucesso`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentValue">Valor Atual</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.1"
                value={formData.currentValue}
                onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="targetValue">Valor Alvo</Label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="paused">Pausada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="overdue">Em Atraso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Prazo</Label>
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
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
