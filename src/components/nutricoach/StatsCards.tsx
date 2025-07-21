
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, MessageSquare, CheckCircle } from 'lucide-react';
import { PatientData } from '@/hooks/useNutriCoachOperations';
import { CoachResponse } from '@/hooks/useCoachResponses';

interface StatsCardsProps {
  patients: PatientData[];
  responses: CoachResponse[];
}

export function StatsCards({ patients, responses }: StatsCardsProps) {
  const today = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
  const responsesToday = responses.filter(r => {
    // Considera response_date ou created_at
    const responseDate = (r.response_date || r.created_at || '').slice(0, 10);
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
