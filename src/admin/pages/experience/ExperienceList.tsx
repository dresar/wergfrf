
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../services/api';
import { Loader2, Plus, Trash2, Edit, Calendar, MapPin, Briefcase, Image as ImageIcon, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await api.experience.getAll();
      setExperiences(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal memuat data", description: "Tidak dapat mengambil data pengalaman." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.experience.delete(id);
      toast({ title: "Berhasil", description: "Data pengalaman dihapus." });
      loadExperiences();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data." });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pengalaman Kerja</h1>
        <Button onClick={() => navigate('/admin/experience/new')}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pengalaman
        </Button>
      </div>

      <div className="grid gap-4">
        {experiences.length === 0 ? (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Belum ada data pengalaman kerja.</p>
                    <Button onClick={() => navigate('/admin/experience/new')}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Sekarang
                    </Button>
                </CardContent>
            </Card>
        ) : (
            experiences.map((exp) => (
            <Card key={exp.id} className="overflow-hidden">
                <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                        {exp.image ? (
                            <div className="h-12 w-12 rounded border overflow-hidden shrink-0">
                                <img src={exp.image} alt={exp.company} className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center shrink-0">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{exp.role}</h3>
                                {exp.isCurrent && <Badge variant="secondary">Saat Ini</Badge>}
                                <Badge variant="outline" className="capitalize">{exp.type === 'work' ? 'Kerja' : exp.type === 'internship' ? 'Magang' : 'Organisasi'}</Badge>
                            </div>
                            <div className="text-muted-foreground font-medium">{exp.company}</div>
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Sekarang' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>{exp.location}</span>
                                    </div>
                                )}
                            </div>
                            
                            {exp.description && (
                                <p className="mt-3 text-sm line-clamp-2">{exp.description}</p>
                            )}

                            {exp.gallery && (
                                <div className="flex gap-2 mt-3">
                                    <Badge variant="outline" className="text-xs">
                                        <ImageIcon className="h-3 w-3 mr-1" />
                                        Dokumentasi Tersedia
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                        <Button variant="secondary" size="sm" onClick={() => {
                            setSelectedExperience(exp);
                            setIsDetailOpen(true);
                        }}>
                            <Eye className="h-4 w-4 mr-2" /> Detail
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/experience/edit/${exp.id}`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" /> Hapus
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Pengalaman?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Data pengalaman ini akan dihapus permanen dari database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(exp.id)}>Ya, Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>

      <ExperienceDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        experience={selectedExperience} 
      />
    </div>
  );
}
