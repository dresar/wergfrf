
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  MoreVertical,
  Award
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function EducationList() {
  const [educationList, setEducationList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    setIsLoading(true);
    try {
      const data = await api.education.getAll();
      setEducationList(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat data pendidikan." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await api.education.delete(id);
      toast({ title: "Berhasil", description: "Data dihapus." });
      loadEducation();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pendidikan</h2>
          <p className="text-muted-foreground">Riwayat pendidikan dan sertifikasi akademis.</p>
        </div>
        <Button onClick={() => navigate('/admin/education/new')}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pendidikan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {educationList.map((edu) => (
          <Card key={edu.id} className="relative group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* Cover Image */}
            <div className="h-32 bg-muted relative">
                {edu.coverImage ? (
                    <img src={edu.coverImage} alt={edu.institution} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <GraduationCap className="h-12 w-12 text-white/50" />
                    </div>
                )}
                {/* Logo Overlay */}
                <div className="absolute -bottom-6 left-4">
                    <div className="h-16 w-16 rounded-lg border-4 border-background bg-white flex items-center justify-center overflow-hidden shadow-sm">
                        {edu.logo ? (
                            <img src={edu.logo} alt="Logo" className="h-full w-full object-contain p-1" />
                        ) : (
                            <GraduationCap className="h-8 w-8 text-primary" />
                        )}
                    </div>
                </div>
            </div>

            <CardContent className="pt-10 pb-4 px-4 flex-grow">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold text-lg leading-tight">{edu.institution}</h3>
                    <p className="text-sm text-muted-foreground">{edu.degree} in {edu.field}</p>
                 </div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/education/${edu.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(edu.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Sekarang'}
                        </span>
                    </div>
                    {edu.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{edu.location}</span>
                        </div>
                    )}
                </div>
                
                {edu.gpa && (
                    <Badge variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" /> GPA: {edu.gpa}
                    </Badge>
                )}

                {edu.description && (
                    <p className="text-sm line-clamp-3 text-muted-foreground">
                        {edu.description}
                    </p>
                )}

                {/* Gallery Preview */}
                {(() => {
                    try {
                        const gallery = JSON.parse(edu.gallery || '[]');
                        if (gallery.length > 0) {
                            return (
                                <div className="flex gap-1 mt-2 overflow-hidden">
                                    {gallery.slice(0, 3).map((img: string, i: number) => (
                                        <div key={i} className="h-8 w-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                            <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {gallery.length > 3 && (
                                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                            +{gallery.length - 3}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    } catch (e) { return null; }
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
