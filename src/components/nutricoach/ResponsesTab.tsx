
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, AlertTriangle, Clock, Brain } from 'lucide-react';
import { QuestionnaireResponse } from '@/hooks/useNutriCoachOperations';

interface ResponsesTabProps {
  responses: QuestionnaireResponse[];
}

export function ResponsesTab({ responses }: ResponsesTabProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Histórico de Respostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma resposta registrada ainda
              </p>
            ) : (
              responses.map((response) => (
                <Card key={response.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{response.patient_name}</h4>
                          <Badge variant="outline">
                            {response.type === 'daily' ? 'Diário' : 'Semanal'}
                          </Badge>
                          {getStatusIcon(response.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(response.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm">{response.responses.join(', ')}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Score: {Math.round(response.score * 100)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">IA</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
