import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  ExternalLink,
  Copy,
  Check,
  Info,
  AlertCircle,
  TestTube,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  details?: any;
}

export const EvolutionAPIConfig = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests: TestResult[] = [];

    // Test 1: Authentication
    tests.push({
      test: 'Autenticação do Usuário',
      status: 'loading',
      message: 'Verificando autenticação...'
    });
    setTestResults([...tests]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        tests[0] = {
          test: 'Autenticação do Usuário',
          status: 'success',
          message: 'Usuário autenticado com sucesso',
          details: { userId: user?.id }
        };
      } else {
        tests[0] = {
          test: 'Autenticação do Usuário',
          status: 'error',
          message: 'Usuário não autenticado'
        };
      }
    } catch (error) {
      tests[0] = {
        test: 'Autenticação do Usuário',
        status: 'error',
        message: 'Erro na autenticação',
        details: error
      };
    }
    setTestResults([...tests]);

    // Test 2: Edge Function Availability
    tests.push({
      test: 'Edge Function Evolution API Proxy',
      status: 'loading',
      message: 'Testando Edge Function...'
    });
    setTestResults([...tests]);

    try {
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/fetchInstances',
          method: 'GET'
        }
      });

      if (error) {
        tests[1] = {
          test: 'Edge Function Evolution API Proxy',
          status: 'error',
          message: 'Erro na Edge Function',
          details: error
        };
      } else {
        tests[1] = {
          test: 'Edge Function Evolution API Proxy',
          status: 'success',
          message: 'Edge Function funcionando',
          details: data
        };
      }
    } catch (error) {
      tests[1] = {
        test: 'Edge Function Evolution API Proxy',
        status: 'error',
        message: 'Falha ao chamar Edge Function',
        details: error
      };
    }
    setTestResults([...tests]);

    // Test 3: Evolution API Connection
    tests.push({
      test: 'Conexão com Evolution API',
      status: 'loading',
      message: 'Testando conexão com servidor...'
    });
    setTestResults([...tests]);

    try {
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/fetchInstances',
          method: 'GET',
          instanceName: `nutribox-${user?.id?.slice(0, 8)}`
        }
      });

      if (error) {
        tests[2] = {
          test: 'Conexão com Evolution API',
          status: 'error',
          message: 'Erro ao conectar com Evolution API',
          details: error
        };
      } else {
        tests[2] = {
          test: 'Conexão com Evolution API',
          status: 'success',
          message: 'Conexão com Evolution API estabelecida',
          details: data
        };
      }
    } catch (error) {
      tests[2] = {
        test: 'Conexão com Evolution API',
        status: 'error',
        message: 'Falha na conexão com Evolution API',
        details: error
      };
    }
    setTestResults([...tests]);

    // Test 4: Instance Creation
    tests.push({
      test: 'Criação de Instância',
      status: 'loading',
      message: 'Testando criação de instância...'
    });
    setTestResults([...tests]);

    try {
      const instanceName = `test-${Date.now()}`;
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint: '/instance/create',
          method: 'POST',
          body: {
            instanceName,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
          },
          instanceName
        }
      });

      if (error) {
        tests[3] = {
          test: 'Criação de Instância',
          status: 'error',
          message: 'Erro ao criar instância',
          details: error
        };
      } else {
        tests[3] = {
          test: 'Criação de Instância',
          status: 'success',
          message: 'Instância criada com sucesso',
          details: { instanceName, data }
        };

        // Clean up - delete test instance
        try {
          await supabase.functions.invoke('evolution-api-proxy', {
            body: {
              endpoint: `/instance/delete/${instanceName}`,
              method: 'DELETE',
              instanceName
            }
          });
        } catch (cleanupError) {
          console.warn('Failed to cleanup test instance:', cleanupError);
        }
      }
    } catch (error) {
      tests[3] = {
        test: 'Criação de Instância',
        status: 'error',
        message: 'Falha ao criar instância',
        details: error
      };
    }
    setTestResults([...tests]);

    setIsTesting(false);
    toast({
      title: "Testes Concluídos",
      description: "Verifique os resultados abaixo"
    });
  };

  const copyConfig = () => {
    const config = `
# Evolution API Configuration
EVOLUTION_API_URL=http://134.199.202.47:8080
EVOLUTION_API_TOKEN=nutribox-evolution-key-2024

# Supabase Configuration
SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}
SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
    `.trim();

    navigator.clipboard.writeText(config);
    toast({
      title: "Configuração Copiada",
      description: "Configuração copiada para a área de transferência"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'loading': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
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
            <Settings className="w-5 h-5" />
            Configuração Evolution API
          </CardTitle>
          <CardDescription>
            Teste e configure a integração com Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Configurações Atuais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>API URL:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">http://134.199.202.47:8080</code>
                </div>
                <div className="flex justify-between">
                  <span>Token:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">nutribox-evolution-key-2024</code>
                </div>
                <div className="flex justify-between">
                  <span>Usuário ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">{user?.id?.slice(0, 8)}...</code>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Ações</h4>
              <div className="space-y-2">
                <Button 
                  onClick={runTests}
                  disabled={isTesting}
                  className="w-full"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executando Testes...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Executar Testes
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={copyConfig}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Configuração
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{result.test}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-gray-600">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          Ver detalhes
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
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

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Solução de Problemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <ExternalLink className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Problemas Comuns:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Verifique se o servidor Evolution API está rodando</li>
                    <li>Confirme se as variáveis de ambiente estão configuradas no Supabase</li>
                    <li>Verifique se a Edge Function foi deployada corretamente</li>
                    <li>Teste a conectividade com o servidor Evolution API</li>
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