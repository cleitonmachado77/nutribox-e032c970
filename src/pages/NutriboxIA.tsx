import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";

export default function NutriboxIA() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header title="Nutribox IA" description="Configure sua inteligência artificial" />

      <Tabs defaultValue="configuracoes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="configuracoes" className="bg-primary text-primary-foreground data-[state=active]:bg-primary">
            Configurações da IA
          </TabsTrigger>
          <TabsTrigger value="qualificacao">Qualificação</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configurações da IA</CardTitle>
              <p className="text-sm text-muted-foreground">
                Personalize como a inteligência artificial vai interagir com seus clientes
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ia-name" className="text-foreground">
                  Nome da IA
                </Label>
                <Input
                  id="ia-name"
                  defaultValue="Yasha"
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Este nome será exibido para os clientes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalidade" className="text-foreground">
                  Personalidade da IA
                </Label>
                <Select defaultValue="profissional">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="amigavel">Amigável</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Define como a IA se comunica
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem-saudacao" className="text-foreground">
                  Mensagem de Saudação
                </Label>
                <Textarea
                  id="mensagem-saudacao"
                  defaultValue="Olá! Sou a Yasha, assistente virtual do escritório Lex Co. Como posso ajudá-lo hoje com questões previdenciárias?"
                  className="bg-background border-border min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Confirmação de Qualificação</h3>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">Qualificação de leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite que a IA qualifique leads automaticamente
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">Fechamento de contratos</h4>
                    <p className="text-sm text-muted-foreground">
                      Permite que a IA feche contratos sem intervenção humana
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Salvar configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualificacao" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configurações de Qualificação</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure como a IA deve qualificar seus leads
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configurações de qualificação em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followup" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configurações de Follow-up</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure como a IA deve fazer follow-up dos leads
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configurações de follow-up em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Templates de Mensagens</CardTitle>
              <p className="text-sm text-muted-foreground">
                Crie e gerencie templates para a IA usar nas conversas
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Templates em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
