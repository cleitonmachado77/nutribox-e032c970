
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import { Paciente } from "@/hooks/usePacientes";

interface PacientesStatsProps {
  pacientes: Paciente[];
}

export const PacientesStats = ({ pacientes }: PacientesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-violet-100">Total de Pacientes</CardTitle>
          <Users className="h-5 w-5 text-violet-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{pacientes.length}</div>
          <p className="text-xs text-violet-200">Convertidos de leads</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none text-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-100">Em Acompanhamento</CardTitle>
          <UserCheck className="h-5 w-5 text-emerald-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {pacientes.filter(p => p.status_tratamento === "ativo").length}
          </div>
          <p className="text-xs text-emerald-200">Pacientes ativos</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-rose-500 to-red-600 border-none text-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-100">Inativos</CardTitle>
          <UserX className="h-5 w-5 text-rose-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {pacientes.filter(p => p.status_tratamento === "inativo").length}
          </div>
          <p className="text-xs text-rose-200">Necessitam atenção</p>
        </CardContent>
      </Card>
    </div>
  );
};
