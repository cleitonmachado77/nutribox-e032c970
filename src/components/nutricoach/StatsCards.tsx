
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
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Total Pacientes</p>
              <p className="text-2xl font-bold text-white">{patients.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Planos Ativos</p>
              <p className="text-2xl font-bold text-white">
                {patients.filter(p => p.planStatus === 'active').length}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Respostas Hoje</p>
              <p className="text-2xl font-bold text-white">{responsesToday}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Selecionados</p>
              <p className="text-2xl font-bold text-white">
                {patients.filter(p => p.isSelected).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
