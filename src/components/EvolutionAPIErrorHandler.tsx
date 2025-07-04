import { useState } from 'react';
import { AlertCircle, RefreshCw, Settings, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EvolutionAPIError {
  message: string;
  status?: number;
  details?: string;
  timestamp?: string;
}

interface EvolutionAPIErrorHandlerProps {
  error: EvolutionAPIError | null;
  onRetry: () => void;
  onConfigure: () => void;
}

export const EvolutionAPIErrorHandler = ({ 
  error, 
  onRetry, 
  onConfigure 
}: EvolutionAPIErrorHandlerProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!error) return null;

  const copyErrorDetails = () => {
    const errorText = `Error: ${error.message}\nStatus: ${error.status}\nTimestamp: ${error.timestamp}\nDetails: ${error.details}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    toast({
      title: "Copiado",
      description: "Detalhes do erro copiados para a área de transferência"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getErrorType = () => {
    if (error.message.includes('Authentication failed')) return 'auth';
    if (error.message.includes('environment variable')) return 'config';
    if (error.message.includes('Network error')) return 'network';
    if (error.message.includes('timed out')) return 'timeout';
    if (error.message.includes('Endpoint not found')) return 'api';
    return 'general';
  };

  const getErrorIcon = () => {
    switch (getErrorType()) {
      case 'auth': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'config': return <Settings className="h-5 w-5 text-orange-500" />;
      case 'network': return <ExternalLink className="h-5 w-5 text-blue-500" />;
      case 'timeout': return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'api': return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getErrorColor = () => {
    switch (getErrorType()) {
      case 'auth': return 'border-red-200 bg-red-50';
      case 'config': return 'border-orange-200 bg-orange-50';
      case 'network': return 'border-blue-200 bg-blue-50';
      case 'timeout': return 'border-yellow-200 bg-yellow-50';
      case 'api': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTroubleshootingSteps = () => {
    switch (getErrorType()) {
      case 'auth':
        return [
          'Verifique se você está logado na aplicação',
          'Tente fazer logout e login novamente',
          'Verifique se sua sessão não expirou'
        ];
      case 'config':
        return [
          'Verifique as configurações do Evolution API no Supabase',
          'Confirme se as variáveis de ambiente estão configuradas',
          'Entre em contato com o suporte técnico'
        ];
      case 'network':
        return [
          'Verifique sua conexão com a internet',
          'Confirme se o servidor Evolution API está online',
          'Tente acessar a URL da API diretamente'
        ];
      case 'timeout':
        return [
          'O servidor está demorando para responder',
          'Tente novamente em alguns segundos',
          'Verifique se o servidor Evolution API não está sobrecarregado'
        ];
      case 'api':
        return [
          'Verifique a versão da Evolution API',
          'Confirme se os endpoints estão corretos',
          'Consulte a documentação da Evolution API'
        ];
      default:
        return [
          'Tente recarregar a página',
          'Verifique o console do navegador para mais detalhes',
          'Entre em contato com o suporte se o problema persistir'
        ];
    }
  };

  return (
    <Card className={`border-2 ${getErrorColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getErrorIcon()}
          Erro na Integração com Evolution API
        </CardTitle>
        <CardDescription>
          Ocorreu um problema ao conectar com o WhatsApp. Veja as soluções abaixo.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error Details */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{error.message}</p>
              {error.status && (
                <Badge variant="outline">Status: {error.status}</Badge>
              )}
              {error.timestamp && (
                <p className="text-xs text-gray-500">
                  Ocorreu em: {new Date(error.timestamp).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Troubleshooting Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Passos para resolver:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {getTroubleshootingSteps().map((step, index) => (
              <li key={index} className="text-gray-700">{step}</li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <Button 
            onClick={onConfigure}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          
          <Button 
            onClick={copyErrorDetails}
            variant="outline"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Detalhes
              </>
            )}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-sm text-blue-800 mb-2">
            💡 Precisa de ajuda?
          </h4>
          <p className="text-xs text-blue-700">
            Se o problema persistir, copie os detalhes do erro acima e entre em contato 
            com o suporte técnico incluindo essas informações.
          </p>
        </div>

        {/* Development Info */}
        {error.details && process.env.NODE_ENV === 'development' && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              Detalhes técnicos (desenvolvimento)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {error.details}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}; 