import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Calendar, Tag, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useUserSettings, useUpdateUserSettings } from "@/hooks/useUserSettings";
import { useObjetivoTags, useCreateObjetivoTag } from "@/hooks/useObjetivoTags";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DeleteTagDialog } from "@/components/DeleteTagDialog";
import { useEffect } from "react";

const Settings = () => {
  const { data: userSettings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();
  const { data: objetivoTags = [] } = useObjetivoTags();
  const createTag = useCreateObjetivoTag();
  const { toast } = useToast();

  const [calendarLink, setCalendarLink] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");
  const [showNewTagDialog, setShowNewTagDialog] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<any>(null);

  // Sincronizar o estado com os dados do usuário
  useEffect(() => {
    if (userSettings?.google_calendar_link) {
      setCalendarLink(userSettings.google_calendar_link);
    }
  }, [userSettings]);

  const handleSaveCalendarLink = async () => {
    try {
      await updateSettings.mutateAsync({ google_calendar_link: calendarLink });
      toast({
        title: "Sucesso!",
        description: "Link do Google Calendar salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag.mutateAsync({
        nome: newTagName.trim(),
        cor: newTagColor,
      });
      
      setNewTagName("");
      setNewTagColor("#3B82F6");
      setShowNewTagDialog(false);
      
      toast({
        title: "Sucesso!",
        description: "Tag de objetivo criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar tag. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const colorOptions = [
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16",
    "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9",
    "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
    "#EC4899", "#F43F5E"
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Header title="Configurações" description="Gerencie suas configurações de perfil e sistema" />

      {/* Configurações do Google Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="calendar-link">Link do Google Calendar</Label>
            <p className="text-sm text-gray-600 mb-2">
              Cole aqui o link do seu Google Calendar para agendamento automático de consultas.
            </p>
            <Input
              id="calendar-link"
              value={calendarLink}
              onChange={(e) => setCalendarLink(e.target.value)}
              placeholder="https://calendar.google.com/calendar/u/0/..."
              className="mb-3"
            />
            <Button 
              onClick={handleSaveCalendarLink}
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? "Salvando..." : "Salvar Link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags de Objetivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags de Objetivos
            </div>
            <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tag de Objetivo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tag-name">Nome da Tag</Label>
                    <Input
                      id="tag-name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Ex: Hipertrofia, Cutting..."
                    />
                  </div>
                  <div>
                    <Label>Cor da Tag</Label>
                    <div className="grid grid-cols-8 gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            newTagColor === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateTag} 
                      disabled={createTag.isPending || !newTagName.trim()}
                      className="flex-1"
                    >
                      {createTag.isPending ? "Criando..." : "Criar Tag"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTagDialog(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {objetivoTags.map((tag) => (
              <div key={tag.id} className="relative group">
                <Badge
                  className="justify-center py-2 text-white w-full"
                  style={{ backgroundColor: tag.cor }}
                >
                  {tag.nome}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTagToDelete(tag)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {objetivoTags.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Nenhuma tag criada ainda. Clique em "Nova Tag" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      <DeleteTagDialog 
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
        tag={tagToDelete}
      />
    </div>
  );
};

export default Settings;
