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
  AlertCircle
} from "lucide-react";

export const EvolutionAPIConfig = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copiado",
      description: `${label} copiado para a área de transferência`
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const configSteps = [
    {
      title: "1. Configurar Variáveis de Ambiente",
      description: "No painel do Supabase, vá em Settings > Edge Functions e configure:",
      items: [
        {
          label: "EVOLUTION_API_URL",
          value: "http://134.199.202.47:8080",
          description: "URL do servidor Evolution API"
        },
        {
          label: "EVOLUTION_API_TOKEN", 
          value: "nutribox-evolution-key-2024",
          description: "Token de autenticação da API"
        }
      ]
    },
    {
      title: "2. Verificar Servidor Evolution API",
      description: "Confirme se o servidor está rodando e acessível:",
      items: [
        {
          label: "Status do Servidor",
          value: "http://134.199.202.47:8080",
          description: "Teste se o servidor responde"
        }
      ]
    },
    {
      title: "3. Deploy da Edge Function",
      description: "Certifique-se de que a edge function está deployada:",
      items: [
        {
          label: "Deploy Command",
          value: "supabase functions deploy evolution-api-proxy",
          description: "Comando para fazer deploy"
        }
      ]
    }
  ];

  const troubleshootingSteps = [
    {
      issue: "Erro de Autenticação (401)",
      solution: "Verifique se o EVOLUTION_API_TOKEN está correto no Supabase"
    },
    {
      issue: "Erro de Rede (503)",
      solution: "Confirme se o servidor Evolution API está online e acessível"
    },
    {
      issue: "Endpoint não encontrado (404)",
      solution: "Verifique a versão da Evolution API e os endpoints utilizados"
    },
    {
      issue: "Timeout (408)",
      solution: "O servidor está demorando para responder. Tente novamente."
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração Evolution API
          </CardTitle>
          <CardDescription>
            Configure a integração com o WhatsApp via Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {configSteps.map((step, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-medium text-sm">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              
              {step.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <Button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      variant="ghost"
                      size="sm"
                    >
                      {copied === item.label ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <code className="text-xs bg-white p-2 rounded border block">
                    {item.value}
                  </code>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Solução de Problemas
          </CardTitle>
          <CardDescription>
            Problemas comuns e suas soluções
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {troubleshootingSteps.map((step, index) => (
              <div key={index} className="border-l-4 border-orange-200 pl-4">
                <h4 className="font-medium text-sm text-orange-800">{step.issue}</h4>
                <p className="text-sm text-gray-600">{step.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Informações Técnicas
          </CardTitle>
          <CardDescription>
            Detalhes sobre a integração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Versão da API</h4>
              <Badge variant="outline">Evolution API v2.2.3</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Integração</h4>
              <Badge variant="outline">WHATSAPP-BAILEYS</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Multi-Tenant</h4>
              <Badge variant="outline" className="text-green-600">Ativo</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Segurança</h4>
              <Badge variant="outline" className="text-blue-600">Supabase Auth</Badge>
            </div>
          </div>

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Multi-Tenant:</strong> Cada usuário possui sua própria instância isolada do WhatsApp, 
                garantindo privacidade e segurança dos dados.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Links Úteis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('https://doc.evolution-api.com/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação Evolution API
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('https://supabase.com/docs/guides/functions', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação Supabase Edge Functions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('https://github.com/EvolutionAPI/evolution-api', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Repositório GitHub Evolution API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};