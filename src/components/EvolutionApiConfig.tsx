import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Server, 
  CheckCircle, 
  AlertCircle, 
  Monitor,
  Shield,
  Zap
} from "lucide-react";
import { EVOLUTION_CONFIG, validateEvolutionConfig } from "@/config/evolutionApi";

export const EvolutionApiConfig = () => {
  const [serverUrl, setServerUrl] = useState(EVOLUTION_CONFIG.API_URL);
  const [apiToken, setApiToken] = useState(EVOLUTION_CONFIG.API_TOKEN);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setConnectionStatus('idle');

    try {
      // Test basic connectivity
      const response = await fetch(`${serverUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiToken
        }
      });

      if (response.ok) {
        setConnectionStatus('success');
        toast({
          title: "Conexão bem-sucedida!",
          description: "Servidor Evolution API conectado com sucesso"
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      toast({
        title: "Erro de conexão",
        description: `Falha ao conectar: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const { valid, errors } = validateEvolutionConfig();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6 text-blue-500" />
          <div>
            <CardTitle>Configuração Evolution API</CardTitle>
            <p className="text-sm text-gray-600">
              Configure a conexão com seu servidor DigitalOcean
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status da Validação */}
        <Alert className={valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {valid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className={valid ? "text-green-800" : "text-red-800"}>
              {valid ? (
                "Configuração válida - pronto para usar!"
              ) : (
                <div>
                  <p className="font-medium mb-1">Configuração incompleta:</p>
                  <ul className="list-disc list-inside text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>

        {/* Configurações do Servidor */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serverUrl">URL do Servidor Evolution API</Label>
            <Input
              id="serverUrl"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://143.198.50.100:8080"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Ex: http://SEU_IP_DIGITALOCEAN:8080 (sem barra no final)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiToken">Token de Acesso</Label>
            <Input
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="seu-token-de-acesso"
              className="font-mono text-sm"
              type="password"
            />
            <p className="text-xs text-gray-500">
              Token configurado no seu servidor Evolution API
            </p>
          </div>
        </div>

        {/* Teste de Conexão */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Teste de Conexão</Label>
            <Badge 
              variant={
                connectionStatus === 'success' ? 'default' : 
                connectionStatus === 'error' ? 'destructive' : 'secondary'
              }
            >
              {connectionStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
              {connectionStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
              {connectionStatus === 'success' ? 'Conectado' : 
               connectionStatus === 'error' ? 'Erro' : 'Não testado'}
            </Badge>
          </div>
          
          <Button 
            onClick={testConnection} 
            disabled={testing || !serverUrl || !apiToken}
            className="w-full"
            variant="outline"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                Testando conexão...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Testar Conexão
              </>
            )}
          </Button>
        </div>

        {/* Recursos Disponíveis */}
        <div className="space-y-3">
          <Label>Recursos Evolution API</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <Monitor className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Multi-tenant</p>
              <p className="text-xs text-gray-600">Instância por usuário</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Seguro</p>
              <p className="text-xs text-gray-600">Conexão protegida</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium">Tempo Real</p>
              <p className="text-xs text-gray-600">Mensagens instantâneas</p>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <Alert>
          <Settings className="w-4 h-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Para configurar seu servidor:</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Edite o arquivo <code>src/config/evolutionApi.ts</code></li>
              <li>Substitua <code>API_URL</code> pela URL do seu servidor</li>
              <li>Configure o <code>API_TOKEN</code> com seu token</li>
              <li>Teste a conexão usando o botão acima</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};