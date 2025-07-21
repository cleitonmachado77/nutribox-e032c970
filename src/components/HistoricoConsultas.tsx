
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConsultasRealizadas } from "@/hooks/useConsultasRealizadas";
import { Calendar, FileText, Image, Download, Scale, Ruler } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoConsultasProps {
  pacienteId: string;
}

export const HistoricoConsultas = ({ pacienteId }: HistoricoConsultasProps) => {
  const { data: consultas = [], isLoading } = useConsultasRealizadas(pacienteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (consultas.length === 0) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma consulta registrada ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Use o botão "Registrar Consulta" para adicionar o primeiro registro.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {consultas.map((consulta) => (
        <Card key={consulta.id} className="border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Consulta - {format(new Date(consulta.data_consulta), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Registrada em {format(new Date(consulta.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Realizada
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Dados corporais */}
            {(consulta.peso_atual || consulta.altura_atual) && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                {consulta.peso_atual && (
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-gray-500" />
                    <span className="text-sm"><strong>Peso:</strong> {consulta.peso_atual} kg</span>
                  </div>
                )}
                {consulta.altura_atual && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <span className="text-sm"><strong>Altura:</strong> {consulta.altura_atual} cm</span>
                  </div>
                )}
              </div>
            )}

            {/* Observações */}
            {consulta.observacoes && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Observações:</h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{consulta.observacoes}</p>
              </div>
            )}

            {/* Notas clínicas */}
            {consulta.notas_clinicas && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Notas Clínicas:</h4>
                <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg border-l-4 border-blue-300">{consulta.notas_clinicas}</p>
              </div>
            )}

            {/* Arquivos */}
            {consulta.arquivos && consulta.arquivos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Arquivos da Consulta:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {consulta.arquivos.map((arquivo) => (
                    <div key={arquivo.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        {arquivo.tipo_arquivo === 'foto' ? (
                          <Image className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-xs font-medium truncate">{arquivo.nome_arquivo}</span>
                      </div>
                      
                      {arquivo.tipo_arquivo === 'foto' && (
                        <div className="mb-2">
                          <img 
                            src={arquivo.url_arquivo} 
                            alt={arquivo.nome_arquivo}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => window.open(arquivo.url_arquivo, '_blank')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {arquivo.tipo_arquivo === 'foto' ? 'Ver' : 'Baixar'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
