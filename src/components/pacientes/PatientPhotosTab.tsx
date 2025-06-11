
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Plus, Trash2, Download, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paciente } from "@/hooks/usePacientes";
import { ImageUpload } from "@/components/ImageUpload";
import { usePatientPhotos } from "@/hooks/usePatientPhotos";

interface PatientPhotosTabProps {
  selectedPatient: Paciente;
}

export const PatientPhotosTab = ({ selectedPatient }: PatientPhotosTabProps) => {
  const { photos, isLoading, addPhoto, deletePhoto } = usePatientPhotos(selectedPatient.id);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [photoType, setPhotoType] = useState<'antes' | 'depois' | 'progresso'>('antes');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleAddPhoto = async (url: string) => {
    await addPhoto(url, photoType);
    setIsUploadDialogOpen(false);
  };

  const handleUpdateProfilePhoto = async (url: string) => {
    if (url) {
      await addPhoto(url, 'perfil', 'Foto de Perfil');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhoto(photoId);
  };

  const handleDownloadPhoto = (photo: any) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${selectedPatient.lead.nome}_${photo.tipo}_${photo.data.split('T')[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const profilePhoto = photos.find(p => p.tipo === 'perfil') || { url: selectedPatient.lead.foto_perfil };
  const bodyPhotos = photos.filter(p => p.tipo !== 'perfil');

  const getPhotosByType = (tipo: 'antes' | 'depois' | 'progresso') => {
    return bodyPhotos.filter(p => p.tipo === tipo);
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'antes': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'depois': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'progresso': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default: return 'bg-gradient-to-r from-purple-500 to-violet-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seção Foto de Perfil */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Foto de Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32 ring-4 ring-purple-200 shadow-xl">
              <AvatarImage src={profilePhoto?.url} className="object-cover" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white">
                {selectedPatient.lead.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  Alterar Foto de Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Alterar Foto de Perfil</DialogTitle>
                </DialogHeader>
                <ImageUpload
                  value={profilePhoto?.url || ""}
                  onChange={handleUpdateProfilePhoto}
                  label="Nova Foto de Perfil"
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Seção Galeria de Fotos do Corpo - Layout Horizontal */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Galeria de Fotos do Progresso ({bodyPhotos.length} fotos)
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Foto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo da Foto</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['antes', 'depois', 'progresso'] as const).map((tipo) => (
                        <Button
                          key={tipo}
                          variant={photoType === tipo ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPhotoType(tipo)}
                          className={photoType === tipo ? getTypeColor(tipo) : ""}
                        >
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <ImageUpload
                    value=""
                    onChange={handleAddPhoto}
                    label={`Foto ${photoType.charAt(0).toUpperCase() + photoType.slice(1)}`}
                    placeholder="Adicione uma nova foto do progresso"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {bodyPhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma foto adicionada</h3>
              <p className="text-gray-500 mb-4">Comece adicionando fotos do progresso do paciente</p>
              <Button 
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Foto
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {(['antes', 'depois', 'progresso'] as const).map((tipo) => {
                const typedPhotos = getPhotosByType(tipo);
                if (typedPhotos.length === 0) return null;
                
                return (
                  <div key={tipo} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getTypeColor(tipo)}`}></div>
                      <h4 className="text-lg font-semibold text-gray-800 capitalize">
                        Fotos {tipo} ({typedPhotos.length})
                      </h4>
                    </div>
                    
                    {/* Layout horizontal forçado */}
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                      <div 
                        className="flex gap-4 pb-4" 
                        style={{ 
                          width: `${typedPhotos.length * 200}px`, 
                          minWidth: '100%' 
                        }}
                      >
                        {typedPhotos.map((photo) => (
                          <div key={photo.id} className="group relative flex-shrink-0" style={{ width: '192px' }}>
                            <div className="w-48 h-64 overflow-hidden rounded-lg border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-200">
                              <img
                                src={photo.url}
                                alt={photo.descricao}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              
                              {/* Overlay com ações */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedPhoto(photo);
                                    setIsViewerOpen(true);
                                  }}
                                  className="bg-white/90 hover:bg-white text-gray-800"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleDownloadPhoto(photo)}
                                  className="bg-white/90 hover:bg-white text-gray-800"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="bg-red-500/90 hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Label do tipo */}
                            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white ${getTypeColor(tipo)}`}>
                              {tipo}
                            </div>
                            
                            {/* Data */}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {new Date(photo.data).toLocaleDateString('pt-BR')}
                            </div>
                            
                            {/* Descrição abaixo da foto */}
                            <div className="mt-2 text-center" style={{ width: '192px' }}>
                              <p className="text-sm text-gray-600 truncate" title={photo.descricao}>
                                {photo.descricao}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Indicador de scroll quando há muitas fotos */}
                    {typedPhotos.length > 3 && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500">← Deslize horizontalmente para ver mais fotos →</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Visualizador de Foto */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto?.descricao} - {selectedPhoto && new Date(selectedPhoto.data).toLocaleDateString('pt-BR')}
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.descricao}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
