
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../services/api';
import { Loader2, Plus, Trash2, Edit, ExternalLink, Github, Youtube, Layers, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { normalizeMediaUrl } from '@/lib/utils';

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.projects.getAll();
      // Handle both array (legacy) and paginated response { data: [], meta: {} }
      if (Array.isArray(response)) {
          setProjects(response);
      } else if (response && Array.isArray(response.data)) {
          setProjects(response.data);
      } else {
          setProjects([]);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal memuat data", description: "Tidak dapat mengambil data project." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
      if (!window.confirm("Yakin hapus project ini?")) return;
      
    try {
      await api.projects.delete(id);
      toast({ title: "Berhasil", description: "Project dihapus." });
      loadProjects();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data." });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
      return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Project</h1>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentItems.length === 0 ? (
            <div className="col-span-full">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Belum ada data project.</p>
                        <Button onClick={() => navigate('/admin/projects/new')}>
                            <Plus className="mr-2 h-4 w-4" /> Buat Project Baru
                        </Button>
                    </CardContent>
                </Card>
            </div>
        ) : (
            currentItems.map((proj) => (
            <Card key={proj.id} className="overflow-hidden flex flex-col group relative">
                <div className="relative aspect-video bg-muted">
                    {proj.coverImage ? (
                        <img src={normalizeMediaUrl(proj.coverImage)} alt={proj.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                            <Layers className="h-10 w-10 opacity-20" />
                        </div>
                    )}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md bg-background/80 backdrop-blur-sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/admin/projects/edit/${proj.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(proj.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                
                <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1 flex-1" title={proj.title}>{proj.title}</h3>
                        <Badge variant={proj.is_published ? "default" : "secondary"} className="shrink-0">
                            {proj.is_published ? "Publik" : "Draft"}
                        </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {proj.description || "Tidak ada deskripsi singkat."}
                    </p>
                    
                    <div className="flex items-center gap-2 pt-2 border-t mt-auto">
                        {proj.repoUrl ? (
                            <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                <Github className="h-4 w-4" />
                            </a>
                        ) : <Github className="h-4 w-4 text-muted-foreground/30 p-1" />}
                        
                        {proj.demoUrl ? (
                            <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        ) : <ExternalLink className="h-4 w-4 text-muted-foreground/30 p-1" />}
                        
                        {proj.videoUrl ? (
                            <a href={proj.videoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                <Youtube className="h-4 w-4" />
                            </a>
                        ) : <Youtube className="h-4 w-4 text-muted-foreground/30 p-1" />}
                        
                        <div className="ml-auto">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate(`/admin/projects/edit/${proj.id}`)}>
                                Detail
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
