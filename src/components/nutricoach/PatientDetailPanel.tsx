import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatientData } from '@/hooks/useNutriCoachOperations';
import { useCoachResponses, CoachResponse } from '@/hooks/useCoachResponses';
import { CoachQuestion } from '@/hooks/useCoachQuestions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface PatientDetailPanelProps {
  patient: PatientData;
  responses: CoachResponse[];
  questions: CoachQuestion[];
}

export function PatientDetailPanel({ patient, responses: _unused, questions }: PatientDetailPanelProps) {
  // Normaliza o telefone para garantir o match com o banco
  const normalizedPhone = patient.telefone.replace(/\D/g, '');
  console.log('Telefone do paciente (normalizado):', normalizedPhone);
  const { responses: patientResponses } = useCoachResponses(normalizedPhone);
  const totalRespostas = patientResponses.length;
  const taxaResposta = totalRespostas > 0 ? Math.round((patientResponses.filter(r => (r.response_score ?? 0) > 0).length / totalRespostas) * 100) : 0;
  const mediaScore = totalRespostas > 0 ? (patientResponses.reduce((acc, r) => acc + (r.response_score ?? 0), 0) / totalRespostas).toFixed(2) : '0.00';

  // Últimas respostas (até 5)
  const ultimasRespostas = patientResponses.slice(0, 5);

  // Questionários ativos do paciente
  const activeQuestions = questions.filter(q => q.is_active && q.patient_id === patient.id);

  // Dados para gráfico de barras (distribuição dos scores)
  const scoreDist: { score: string; count: number }[] = [
    { score: '1', count: patientResponses.filter(r => r.response_score === 1).length },
    { score: '2', count: patientResponses.filter(r => r.response_score === 2).length },
    { score: '3', count: patientResponses.filter(r => r.response_score === 3).length },
  ];

  // Dados para gráfico de linha (evolução do score)
  const scoreTimeline = patientResponses
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {patient.nome}
            <Badge variant={patient.planStatus === 'active' ? 'default' : 'secondary'}>
              {patient.planStatus === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Estatísticas do paciente + gráficos */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <div className="text-2xl font-bold">{totalRespostas}</div>
              <div className="text-xs text-muted-foreground">Total de respostas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{taxaResposta}%</div>
              <div className="text-xs text-muted-foreground">Taxa de sucesso</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{mediaScore}</div>
              <div className="text-xs text-muted-foreground">Média de score</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Distribuição dos Scores</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={scoreDist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="score" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="font-semibold mb-2">Evolução do Score</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={scoreTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 3]} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Respostas recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimasRespostas.length === 0 ? (
            <div className="text-muted-foreground">Nenhuma resposta encontrada.</div>
          ) : (
            <ul className="space-y-2">
              {ultimasRespostas.map((r) => {
                const optionsText = getOptionsText(r.questionnaire_id);
                return (
                  <li key={r.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
                    <div>
                      <span className="font-medium">{r.question_type}</span> - <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs mt-1 md:mt-0">
                      Pergunta: <b>{r.question_text}</b> <br />
                      {optionsText && <span><b>Opções:</b> {optionsText} <br /></span>}
                      Resposta: <b>{r.response_text}</b> | Score: <b>{r.response_score ?? '-'}</b>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Questionários ativos */}
      <Card>
        <CardHeader>
          <CardTitle>Questionários Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          {activeQuestions.length === 0 ? (
            <div className="text-muted-foreground">Nenhum questionário ativo para este paciente.</div>
          ) : (
            <ul className="space-y-2">
              {activeQuestions.map((q) => (
                <li key={q.id} className="border rounded p-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="font-medium">{q.title}</div>
                  <div className="text-xs text-muted-foreground">Categoria: {q.category} | Frequência: {q.frequency}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
