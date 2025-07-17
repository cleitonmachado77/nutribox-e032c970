
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, MessageSquare, CheckCircle } from 'lucide-react';
import { PatientData, QuestionnaireResponse } from '@/hooks/useNutriCoachOperations';

interface StatsCardsProps {
  patients: PatientData[];
  responses: QuestionnaireResponse[];
}

export function StatsCards({ patients, responses }: StatsCardsProps) {
  const today = new Date().toDateString();
  const responsesToday = responses.filter(r => {
    const responseDate = new Date(r.created_at).toDateString();
    return today === responseDate;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Pacientes</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Planos Ativos</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => p.planStatus === 'active').length}
              </p>
            </div>
            <Target className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Respostas Hoje</p>
              <p className="text-2xl font-bold">{responsesToday}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selecionados</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => p.isSelected).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
