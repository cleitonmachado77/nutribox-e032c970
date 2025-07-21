
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-slate-800/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 font-medium">Total Pacientes</p>
              <p className="text-3xl font-bold text-white mt-2">{patients.length}</p>
            </div>
            <div className="bg-violet-500/20 p-3 rounded-2xl">
              <Users className="w-8 h-8 text-violet-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-slate-800/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 font-medium">Planos Ativos</p>
              <p className="text-3xl font-bold text-white mt-2">
                {patients.filter(p => p.planStatus === 'active').length}
              </p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-2xl">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-slate-800/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 font-medium">Respostas Hoje</p>
              <p className="text-3xl font-bold text-white mt-2">{responsesToday}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-slate-800/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 font-medium">Selecionados</p>
              <p className="text-3xl font-bold text-white mt-2">
                {patients.filter(p => p.isSelected).length}
              </p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
