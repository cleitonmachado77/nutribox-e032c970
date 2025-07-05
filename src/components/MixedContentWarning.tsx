
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";

export const MixedContentWarning = () => {
  // Só mostra o aviso se estivermos em HTTPS (produção)
  const showWarning = window.location.protocol === 'https:' && !import.meta.env.DEV;
  
  if (!showWarning) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50 mb-4">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="space-y-2">
          <p className="font-medium">⚠️ Configuração de Segurança Necessária</p>
          <p className="text-sm">
            Para funcionar corretamente em produção, configure HTTPS no servidor Evolution API 
            ou use um proxy reverso com certificado SSL.
          </p>
          <div className="text-xs bg-amber-100 p-2 rounded border border-amber-200 mt-2">
            <p className="font-medium mb-1">Soluções recomendadas:</p>
            <ul className="space-y-1">
              <li>• Configure certificado SSL no servidor: <code>https://134.199.202.47</code></li>
              <li>• Use Cloudflare ou outro proxy HTTPS</li>
              <li>• Configure um domínio com certificado Let's Encrypt</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
