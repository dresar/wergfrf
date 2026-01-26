import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Github,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Star,
  Youtube,
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useProjects } from '@/hooks/useProjects';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImagePreview } from '@/components/admin/ImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Project } from '@/store/adminStore';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { Pagination } from '@/components/ui/Pagination';

// Sortable Item Component
function SortableProjectCard({ 
  project, 
  onEdit, 
  onDelete, 
  onCopyId 
}: { 
  project: Project; 
  onEdit: (id: number) => void; 
  onDelete: (id: number) => void;
  onCopyId: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = () => {
    onCopyId(project.id);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass rounded-xl overflow-hidden card-hover flex flex-col group relative",
        isDragging && "ring-2 ring-primary shadow-xl"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 right-2 z-20 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg cursor-grab active:cursor-grabbing text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Featured Badge */}
      {project.is_featured && (
        <div className="absolute top-2 left-2 z-20 p-1.5 bg-yellow-500/90 text-white rounded-full shadow-md" title="Featured Project">
          <Star className="h-4 w-4 fill-current" />
        </div>
      )}

      {/* Video Indicator */}
      {project.video_url && (
         <div className="absolute top-2 left-10 z-20 p-1.5 bg-red-600/90 text-white rounded-full shadow-md" title="Has Video">
          <Youtube className="h-4 w-4 fill-current" />
        </div>
      )}

      {/* Full Width Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.thumbnail || project.cover_image ? (
          <ImagePreview
            src={project.cover_image || project.thumbnail || ''}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate" title={project.title}>
              {project.title}
            </h3>
            <div 
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5 cursor-pointer w-fit"
            >
              ID: {project.id}
              {copiedId === project.id ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/50">
          <div className="flex gap-2">
             {project.demoUrl && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" title="View Demo">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(project.id)}
              className="h-8 w-8"
              title="Edit Project"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(project.id)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Projects = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    isLoading: loading, 
    deleteProject,
    reorderProjects
  } = useProjects();
  
  const [items, setItems] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to more rows for dnd

  // Sync projects to local state when loaded
  useEffect(() => {
    if (projects) {
      // Sort by order first, then createdAt
      // @ts-ignore
      const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sorted);
    }
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      // Prepare reorder payload
      const reorderPayload = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      // Call API
      reorderProjects(reorderPayload).catch(() => {
        toast.error('Gagal menyimpan urutan baru');
        // Revert to original items on error
        setItems(items);
      });
    }
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    return items.filter((p) =>
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProjects.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProjects, currentPage, rowsPerPage]);

  const handleDeleteSingle = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete);
        setProjectToDelete(null);
        setDeleteDialogOpen(false);
        toast.success('Proyek berhasil dihapus');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyek</h1>
          <p className="text-muted-foreground mt-1">
            Kelola proyek portofolio Anda.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Tambah Proyek
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Baris per halaman:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="Tidak ada proyek ditemukan"
          description={
            searchQuery
              ? "Tidak ada proyek yang cocok dengan kriteria pencarian Anda"
              : "Mulai dengan menambahkan proyek pertama Anda"
          }
          actionLabel={searchQuery ? "Hapus Pencarian" : "Tambah Proyek"}
          onAction={
            searchQuery
              ? () => setSearchQuery("")
              : () => navigate('/admin/projects/new')
          }
        />
      ) : (
        <>
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={paginatedProjects.map(p => p.id)} 
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProjects.map((project) => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    onEdit={(id) => navigate(`/admin/projects/${id}`)}
                    onDelete={(id) => {
                      setProjectToDelete(id);
                      setDeleteDialogOpen(true);
                    }}
                    onCopyId={(id) => {
                      navigator.clipboard.writeText(id.toString());
                      toast.success('ID Proyek disalin ke papan klip');
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Proyek"
        description="Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDeleteSingle}
      />
    </div>
  );
};

export default Projects;