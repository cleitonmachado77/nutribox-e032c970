import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Copy,
  Check,
  Terminal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { generateInstanceName } from '@/config/evolutionApi';

interface DebugResult {
  test: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  details?: any;
  timestamp: string;
}

export const ConnectionDebugger = () => {
  const [debugResults, setDebugResults] = useState<DebugResult[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const runDebugTests = async () => {
    setIsDebugging(true);
    setDebugResults([]);

    const results: DebugResult[] = [];

    // Test 1: User Authentication
    results.push({
      test: 'Autenticação do Usuário',
      status: 'loading',
      message: 'Verificando autenticação...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        results[0] = {
          test: 'Autenticação do Usuário',
          status: 'success',
          message: 'Usuário autenticado com sucesso',
          details: { 
            userId: user?.id,
            email: user?.email,
            sessionId: session.access_token.slice(0, 20) + '...'
          },
          timestamp: new Date().toISOString()
        };
      } else {
        results[0] = {
          test: 'Autenticação do Usuário',
          status: 'error',
          message: 'Usuário não autenticado',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      results[0] = {
        test: 'Autenticação do Usuário',
        status: 'error',
        message: 'Erro na autenticação',
        details: error,
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    // Test 2: Instance Name Generation
    results.push({
      test: 'Geração do Nome da Instância',
      status: 'loading',
      message: 'Gerando nome da instância...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const instanceName = generateInstanceName(user?.id || '');
      results[1] = {
        test: 'Geração do Nome da Instância',
        status: 'success',
        message: `Nome da instância gerado: ${instanceName}`,
        details: { 
          userId: user?.id,
          instanceName,
          expectedFormat: 'nutribox-{userId.slice(0, 8)}'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      results[1] = {
        test: 'Geração do Nome da Instância',
        status: 'error',
        message: 'Erro ao gerar nome da instância',
        details: error,
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    // Test 3: Edge Function Basic Test
    results.push({
      test: 'Teste Básico da Edge Function',
      status: 'loading',
      message: 'Testando Edge Function...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/fetchInstances',
          method: 'GET'
        }
      });

      if (error) {
        results[2] = {
          test: 'Teste Básico da Edge Function',
          status: 'error',
          message: 'Erro na Edge Function',
          details: {
            error: error.message,
            status: error.status,
            name: error.name,
            suggestion: 'Verifique se a Edge Function está deployada e as variáveis de ambiente estão configuradas'
          },
          timestamp: new Date().toISOString()
        };
      } else {
        results[2] = {
          test: 'Teste Básico da Edge Function',
          status: 'success',
          message: 'Edge Function funcionando',
          details: {
            responseType: typeof data,
            hasData: !!data,
            dataPreview: data ? JSON.stringify(data).slice(0, 100) + '...' : 'null'
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      results[2] = {
        test: 'Teste Básico da Edge Function',
        status: 'error',
        message: 'Falha ao chamar Edge Function',
        details: {
          error: error instanceof Error ? error.message : String(error),
          type: typeof error,
          suggestion: 'A Edge Function pode não estar deployada ou há problemas de configuração'
        },
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    // Test 3.5: Environment Variables Test
    results.push({
      test: 'Verificação de Variáveis de Ambiente',
      status: 'loading',
      message: 'Verificando configuração...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/fetchInstances',
          method: 'GET'
        }
      });

      if (error && error.message.includes('environment variable')) {
        results[3] = {
          test: 'Verificação de Variáveis de Ambiente',
          status: 'error',
          message: 'Variáveis de ambiente não configuradas',
          details: {
            error: error.message,
            required: [
              'EVOLUTION_API_URL=http://134.199.202.47:8080',
              'EVOLUTION_API_TOKEN=nutribox-evolution-key-2024'
            ],
            solution: 'Configure as variáveis no painel do Supabase > Settings > Edge Functions'
          },
          timestamp: new Date().toISOString()
        };
      } else if (error) {
        results[3] = {
          test: 'Verificação de Variáveis de Ambiente',
          status: 'error',
          message: 'Erro na Edge Function',
          details: {
            error: error.message,
            status: error.status,
            suggestion: 'Verifique os logs da Edge Function no painel do Supabase'
          },
          timestamp: new Date().toISOString()
        };
      } else {
        results[3] = {
          test: 'Verificação de Variáveis de Ambiente',
          status: 'success',
          message: 'Variáveis de ambiente configuradas corretamente',
          details: {
            response: 'Edge Function respondeu com sucesso',
            dataPreview: data ? JSON.stringify(data).slice(0, 100) + '...' : 'null'
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      results[3] = {
        test: 'Verificação de Variáveis de Ambiente',
        status: 'error',
        message: 'Falha ao verificar configuração',
        details: {
          error: error instanceof Error ? error.message : String(error),
          suggestion: 'Verifique se a Edge Function está deployada'
        },
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    // Test 4: Instance Creation Test
    results.push({
      test: 'Teste de Criação de Instância',
      status: 'loading',
      message: 'Testando criação de instância...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const testInstanceName = `debug-${Date.now()}`;
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/create',
          method: 'POST',
          body: {
            instanceName: testInstanceName,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
          },
          instanceName: testInstanceName
        }
      });

      if (error) {
        results[4] = {
          test: 'Teste de Criação de Instância',
          status: 'error',
          message: 'Erro ao criar instância de teste',
          details: {
            error: error.message,
            status: error.status,
            instanceName: testInstanceName
          },
          timestamp: new Date().toISOString()
        };
      } else {
        results[4] = {
          test: 'Teste de Criação de Instância',
          status: 'success',
          message: 'Instância de teste criada com sucesso',
          details: {
            instanceName: testInstanceName,
            hasQRCode: !!data?.qrcode?.base64,
            responseKeys: Object.keys(data || {}),
            dataPreview: JSON.stringify(data).slice(0, 200) + '...'
          },
          timestamp: new Date().toISOString()
        };

        // Clean up - delete test instance
        try {
          await supabase.functions.invoke('evolution-api-proxy', {
            body: {
              endpoint: `/instance/delete/${testInstanceName}`,
              method: 'DELETE',
              instanceName: testInstanceName
            }
          });
          console.log('✅ Test instance cleaned up');
        } catch (cleanupError) {
          console.warn('⚠️ Failed to cleanup test instance:', cleanupError);
        }
      }
    } catch (error) {
      results[4] = {
        test: 'Teste de Criação de Instância',
        status: 'error',
        message: 'Falha ao criar instância de teste',
        details: {
          error: error instanceof Error ? error.message : String(error),
          type: typeof error
        },
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    // Test 5: Direct Evolution API Server Test
    results.push({
      test: 'Teste Direto do Servidor Evolution API',
      status: 'loading',
      message: 'Testando conectividade direta...',
      timestamp: new Date().toISOString()
    });
    setDebugResults([...results]);

    try {
      const response = await fetch('http://134.199.202.47:8080/instance/fetchInstances', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'nutribox-evolution-key-2024'
        }
      });

      if (response.ok) {
        const data = await response.json();
        results[5] = {
          test: 'Teste Direto do Servidor Evolution API',
          status: 'success',
          message: 'Servidor Evolution API acessível diretamente',
          details: {
            status: response.status,
            statusText: response.statusText,
            hasData: !!data,
            dataPreview: data ? JSON.stringify(data).slice(0, 100) + '...' : 'null'
          },
          timestamp: new Date().toISOString()
        };
      } else {
        results[5] = {
          test: 'Teste Direto do Servidor Evolution API',
          status: 'error',
          message: `Servidor respondeu com erro: ${response.status}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            suggestion: 'Verifique se o servidor Evolution API está rodando'
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      results[5] = {
        test: 'Teste Direto do Servidor Evolution API',
        status: 'error',
        message: 'Não foi possível conectar ao servidor',
        details: {
          error: error instanceof Error ? error.message : String(error),
          suggestion: 'Verifique se o servidor Evolution API está online e acessível'
        },
        timestamp: new Date().toISOString()
      };
    }
    setDebugResults([...results]);

    setIsDebugging(false);
    toast({
      title: "Debug Concluído",
      description: "Verifique os resultados abaixo"
    });
  };

  const copyDebugReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email
      },
      results: debugResults
    };

    const reportText = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(reportText);
    toast({
      title: "Relatório Copiado",
      description: "Relatório de debug copiado para a área de transferência"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'loading': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Bug className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'error': return <Badge variant="destructive">Erro</Badge>;
      case 'loading': return <Badge variant="secondary">Testando...</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug da Conexão Evolution API
          </CardTitle>
          <CardDescription>
            Ferramenta para diagnosticar problemas de conexão com Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Informações do Usuário</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ID do Usuário:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{user?.id || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{user?.email || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span>Instância Esperada:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{generateInstanceName(user?.id || '')}</code>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Ações</h4>
              <div className="space-y-2">
                <Button 
                  onClick={runDebugTests}
                  disabled={isDebugging}
                  className="w-full"
                >
                  {isDebugging ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executando Debug...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Executar Debug
                    </>
                  )}
                </Button>
                
                {debugResults.length > 0 && (
                  <Button 
                    onClick={copyDebugReport}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Relatório
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Results */}
      {debugResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debugResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{result.test}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(result.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          Ver detalhes técnicos
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas de Solução de Problemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Terminal className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Problemas Comuns e Soluções:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Erro 500:</strong> Verifique se a Edge Function está deployada e as variáveis de ambiente estão configuradas</li>
                    <li><strong>Erro de Autenticação:</strong> Faça logout e login novamente</li>
                    <li><strong>Instância não encontrada:</strong> A instância pode ter sido deletada no servidor Evolution API</li>
                    <li><strong>QR Code não aparece:</strong> Verifique se o servidor Evolution API está rodando</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}; 