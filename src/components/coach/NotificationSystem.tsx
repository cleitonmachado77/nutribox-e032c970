
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Users,
  TrendingDown,
  Calendar,
  X,
  Eye,
  Settings,
  Filter,
  Search,
  RotateCcw,
  Send,
  Archive
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Notification {
  id: string;
  type: 'low_engagement' | 'goal_missed' | 'no_response' | 'system' | 'success';
  title: string;
  message: string;
  patientName?: string;
  patientId?: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: string;
  actionRequired: boolean;
}

export const NotificationSystem = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'low_engagement',
      title: 'Baixo Engajamento Detectado',
      message: 'Ana Costa não responde há 5 dias. Taxa de resposta caiu para 30%.',
      patientName: 'Ana Costa',
      patientId: 'p3',
      priority: 'high',
      isRead: false,
      createdAt: '2024-01-14T09:30:00Z',
      actionRequired: true
    },
    {
      id: '2',
      type: 'goal_missed',
      title: 'Meta Não Atingida',
      message: 'João Santos não atingiu a meta de hidratação desta semana.',
      patientName: 'João Santos',
      patientId: 'p2',
      priority: 'medium',
      isRead: false,
      createdAt: '2024-01-14T08:15:00Z',
      actionRequired: true
    },
    {
      id: '3',
      type: 'success',
      title: 'Meta Concluída',
      message: 'Maria Silva atingiu 100% da meta de exercícios semanais!',
      patientName: 'Maria Silva',
      patientId: 'p1',
      priority: 'low',
      isRead: true,
      createdAt: '2024-01-13T18:00:00Z',
      actionRequired: false
    },
    {
      id: '4',
      type: 'system',
      title: 'Relatório Semanal Pronto',
      message: 'O relatório semanal de engajamento foi gerado e está disponível.',
      priority: 'low',
      isRead: false,
      createdAt: '2024-01-13T10:00:00Z',
      actionRequired: false
    },
    {
      id: '5',
      type: 'no_response',
      title: 'Sem Resposta há 3 dias',
      message: 'Pedro Oliveira não responde às mensagens há 3 dias consecutivos.',
      patientName: 'Pedro Oliveira',
      patientId: 'p4',
      priority: 'medium',
      isRead: false,
      createdAt: '2024-01-12T16:20:00Z',
      actionRequired: true
    }
  ]);

  const [settings, setSettings] = useState({
    lowEngagementAlerts: true,
    goalMissedAlerts: true,
    noResponseAlerts: true,
    weeklyReports: true,
    successNotifications: true,
    emailNotifications: false,
    pushNotifications: true
  });

  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_engagement': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'goal_missed': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'no_response': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'system': return <Bell className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida com sucesso."
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: `${unreadCount} notificações foram marcadas como lidas.`
    });
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida da lista."
    });
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast({
      title: "Notificação arquivada",
      description: "A notificação foi arquivada com sucesso."
    });
  };

  const handleAction = (notification: Notification) => {
    if (notification.type === 'low_engagement' && notification.patientId) {
      toast({
        title: "Ação sugerida",
        description: `Enviando mensagem motivacional personalizada para ${notification.patientName}`
      });
    } else if (notification.type === 'goal_missed' && notification.patientId) {
      toast({
        title: "Ação sugerida",
        description: `Agendando check-in com ${notification.patientName} para revisar metas`
      });
    } else if (notification.type === 'no_response' && notification.patientId) {
      toast({
        title: "Ação realizada",
        description: `Enviando lembrete personalizado para ${notification.patientName}`
      });
    }
    markAsRead(notification.id);
  };

  const sendBulkMessage = () => {
    const unreadActionRequired = notifications.filter(n => !n.isRead && n.actionRequired);
    toast({
      title: "Mensagens em lote enviadas",
      description: `${unreadActionRequired.length} mensagens de follow-up foram enviadas.`
    });
  };

  const refreshNotifications = () => {
    toast({
      title: "Notificações atualizadas",
      description: "A lista de notificações foi atualizada com sucesso."
    });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Central de Notificações
          </h2>
          <p className="text-gray-600">
            {unreadCount} notificações não lidas
            {highPriorityCount > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                ({highPriorityCount} de alta prioridade)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshNotifications}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          {actionRequiredCount > 0 && (
            <Button variant="outline" size="sm" onClick={sendBulkMessage}>
              <Send className="w-4 h-4 mr-2" />
              Enviar Follow-ups ({actionRequiredCount})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Alta Prioridade</p>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Baixo Engajamento</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'low_engagement').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Ação Necessária</p>
                <p className="text-2xl font-bold">{actionRequiredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Sucessos</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'success').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Notificações */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notificações Recentes</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar notificações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-48"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="low_engagement">Baixo Engajamento</SelectItem>
                    <SelectItem value="goal_missed">Metas Perdidas</SelectItem>
                    <SelectItem value="no_response">Sem Resposta</SelectItem>
                    <SelectItem value="success">Sucessos</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as prioridades</SelectItem>
                    <SelectItem value="high">Alta prioridade</SelectItem>
                    <SelectItem value="medium">Média prioridade</SelectItem>
                    <SelectItem value="low">Baixa prioridade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'opacity-100' : 'opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(notification.createdAt).toLocaleString('pt-BR')}
                              </span>
                              {notification.patientName && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {notification.patientName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {notification.actionRequired && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAction(notification)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Ação
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              title="Marcar como lida"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => archiveNotification(notification.id)}
                            title="Arquivar"
                          >
                            <Archive className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissNotification(notification.id)}
                            title="Remover"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurações de Notificações */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Baixo Engajamento</p>
                    <p className="text-xs text-gray-600">Alertas de pacientes inativos</p>
                  </div>
                  <Switch
                    checked={settings.lowEngagementAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, lowEngagementAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Metas Perdidas</p>
                    <p className="text-xs text-gray-600">Quando metas não são atingidas</p>
                  </div>
                  <Switch
                    checked={settings.goalMissedAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, goalMissedAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sem Resposta</p>
                    <p className="text-xs text-gray-600">Pacientes que não respondem</p>
                  </div>
                  <Switch
                    checked={settings.noResponseAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, noResponseAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Relatórios Semanais</p>
                    <p className="text-xs text-gray-600">Resumo semanal automático</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sucessos</p>
                    <p className="text-xs text-gray-600">Metas atingidas e conquistas</p>
                  </div>
                  <Switch
                    checked={settings.successNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, successNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-xs text-gray-600">Alertas em tempo real</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-xs text-gray-600">Resumo diário por email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações Avançadas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
