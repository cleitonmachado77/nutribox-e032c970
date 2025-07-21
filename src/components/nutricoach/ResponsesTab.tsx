
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { CoachResponse } from '@/hooks/useCoachResponses';
import { CoachQuestion } from '@/hooks/useCoachQuestions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface ResponsesTabProps {
  responses: CoachResponse[];
  questions: CoachQuestion[];
}

export function ResponsesTab({ responses, questions }: ResponsesTabProps) {
  // Gráfico de distribuição de score
  const scoreDist: { score: string; count: number }[] = [
    { score: '1', count: responses.filter(r => r.response_score === 1).length },
    { score: '2', count: responses.filter(r => r.response_score === 2).length },
    { score: '3', count: responses.filter(r => r.response_score === 3).length },
  ];

  // Gráfico de evolução do score
  const scoreTimeline = responses
    .slice()
    .reverse()
    .map((r, idx) => ({
      name: new Date(r.created_at).toLocaleDateString(),
      score: r.response_score ?? 0,
      idx,
    }));

  // Função para buscar as opções do questionário
  const getOptionsText = (questionnaire_id?: string) => {
    if (!questionnaire_id) return null;
    const q = questions.find(q => q.id === questionnaire_id);
    if (!q || !q.options) return null;
    if (Array.isArray(q.options)) return q.options.join(' | ');
    if (typeof q.options === 'string') return q.options;
    return null;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            Histórico de Respostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="font-semibold mb-2 text-white">Distribuição dos Scores</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={scoreDist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="score" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="font-semibold mb-2 text-white">Evolução do Score</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={scoreTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis domain={[0, 3]} allowDecimals={false} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            {responses.length === 0 ? (
              <p className="text-slate-300 text-center py-8">
                Nenhuma resposta registrada ainda
              </p>
            ) : (
              responses.slice(0, 20).map((r) => {
                const optionsText = getOptionsText(r.questionnaire_id);
                return (
                  <Card key={r.id} className="bg-slate-800/50 border-slate-600/50">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{r.patient_name}</span>
                          <Badge variant="outline" className="border-slate-500 text-slate-300">
                            {r.question_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(r.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="mt-2 text-xs text-slate-300">
                          <b>Pergunta:</b> {r.question_text} <br />
                          {optionsText && <span><b>Opções:</b> {optionsText} <br /></span>}
                          <b>Resposta:</b> {r.response_text} <br />
                          <b>Score:</b> {r.response_score ?? '-'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
