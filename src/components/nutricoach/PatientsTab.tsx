
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Filter } from 'lucide-react';
import { PatientData } from '@/hooks/useNutriCoachOperations';

interface PatientsTabProps {
  patients: PatientData[];
  filter: string;
  setFilter: (filter: string) => void;
  togglePatientSelection: (patientId: string) => void;
}

export function PatientsTab({ patients, filter, setFilter, togglePatientSelection }: PatientsTabProps) {
  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(filter.toLowerCase()) ||
    patient.telefone.includes(filter)
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seleção de Pacientes
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Input
              placeholder="Filtrar por nome ou telefone..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className={`cursor-pointer transition-colors ${
                patient.isSelected ? 'ring-2 ring-primary' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={patient.isSelected}
                      onCheckedChange={() => togglePatientSelection(patient.id)}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{patient.nome}</h4>
                      <p className="text-sm text-muted-foreground">{patient.telefone}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={patient.planStatus === 'active' ? 'default' : 'secondary'}>
                          {patient.planStatus === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
