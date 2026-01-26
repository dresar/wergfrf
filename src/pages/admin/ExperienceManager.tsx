import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Briefcase,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useExperience } from '@/hooks/useExperience';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Pagination } from '@/components/ui/Pagination';

interface Experience {
  id: number;
  role: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

type EmploymentType = 'full-time' | 'part-time' | 'freelance' | 'internship' | 'contract';

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

const typeColors: Record<EmploymentType, string> = {
  'full-time': 'bg-success/20 text-success border-success/30',
  'part-time': 'bg-warning/20 text-warning border-warning/30',
  'freelance': 'bg-primary/20 text-primary border-primary/30',
  'internship': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'contract': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const ExperienceManager = () => {
  const isMobile = useIsMobile();
  const { 
    experiences = [], 
    isLoading: loading, 
    addExperience, 
    updateExperience, 
    deleteExperience,
    isAdding,
    isUpdating
  } = useExperience();

  const isSubmitting = isAdding || isUpdating;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<number | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const handleSave = () => {
    if (!editingExperience) return;

    if (!editingExperience.role || !editingExperience.company) {
      toast.error('Harap isi kolom yang wajib diisi');
      return;
    }

    const experienceData = {
      role: editingExperience.role,
      company: editingExperience.company,
      description: editingExperience.description || '',
      startDate: editingExperience.startDate || new Date().toISOString().split('T')[0],
      endDate: editingExperience.endDate || null,
      isCurrent: editingExperience.isCurrent || false
    };

    if (editingExperience.id) {
      updateExperience({ id: editingExperience.id, data: experienceData }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingExperience(null);
        }
      });
    } else {
      addExperience(experienceData, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingExperience(null);
        }
      });
    }
  };

  const handleDelete = () => {
    if (experienceToDelete) {
      deleteExperience(experienceToDelete, {
        onSuccess: () => {
          setExperienceToDelete(null);
          setDeleteDialogOpen(false);
        }
      });
    }
  };

  const openEditDialog = (experience?: Experience) => {
    setEditingExperience(
      experience
        ? { ...experience }
        : { 
            role: '', 
            company: '', 
            description: '', 
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            isCurrent: false,
          }
    );
    setDialogOpen(true);
  };

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [experiences]);

  const totalPages = Math.ceil(sortedExperiences.length / ITEMS_PER_PAGE);
  const paginatedExperiences = useMemo(() => {
    return sortedExperiences.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedExperiences, currentPage]);

  const FormContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Peran / Posisi *</Label>
          <Input
            id="role"
            placeholder="misal: Senior Frontend Developer"
            value={editingExperience?.role || ''}
            onChange={(e) =>
              setEditingExperience((prev) => ({ ...prev, role: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Perusahaan *</Label>
          <Input
            id="company"
            placeholder="misal: Tech Corp"
            value={editingExperience?.company || ''}
            onChange={(e) =>
              setEditingExperience((prev) => ({ ...prev, company: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          placeholder="Jelaskan peran dan tanggung jawab Anda"
          value={editingExperience?.description || ''}
          onChange={(e) =>
            setEditingExperience((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tanggal Mulai</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {editingExperience?.startDate
                  ? format(new Date(editingExperience.startDate), 'MMM yyyy')
                  : 'Pilih tanggal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={editingExperience?.startDate ? new Date(editingExperience.startDate) : undefined}
                onSelect={(date) =>
                  setEditingExperience((prev) => ({
                    ...prev,
                    startDate: date?.toISOString().split('T')[0] || '',
                  }))
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Tanggal Berakhir</Label>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={editingExperience?.isCurrent}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {editingExperience?.isCurrent
                    ? 'Saat Ini'
                    : editingExperience?.endDate
                    ? format(new Date(editingExperience.endDate), 'MMM yyyy')
                    : 'Pilih tanggal'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={editingExperience?.endDate ? new Date(editingExperience.endDate) : undefined}
                  onSelect={(date) =>
                    setEditingExperience((prev) => ({
                      ...prev,
                      endDate: date?.toISOString().split('T')[0] || null,
                    }))
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isCurrent"
                checked={editingExperience?.isCurrent || false}
                onCheckedChange={(checked) =>
                  setEditingExperience((prev) => ({
                    ...prev,
                    isCurrent: !!checked,
                    endDate: checked ? null : prev?.endDate,
                  }))
                }
              />
              <Label htmlFor="isCurrent" className="text-sm cursor-pointer">
                Saya masih bekerja di sini
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Memuat pengalaman...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengalaman</h1>
            <p className="text-muted-foreground mt-1">Kelola riwayat pekerjaan dan linimasa karir Anda</p>
          </div>
          <Button onClick={() => openEditDialog()} className="btn-neon">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengalaman
          </Button>
        </motion.div>

        {/* Experience List */}
        {sortedExperiences.length === 0 ? (
          <EmptyState
            icon="briefcase"
            title="Belum ada pengalaman ditambahkan"
            description="Tambahkan pengalaman kerja Anda untuk menampilkan perjalanan karir Anda"
            action={{ label: 'Tambah Pengalaman', onClick: () => openEditDialog() }}
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-6 card-hover relative overflow-hidden flex flex-col gap-4"
              >
                {exp.isCurrent && (
                  <div className="absolute top-0 right-0 bg-success text-success-foreground text-xs font-medium px-3 py-1 rounded-bl-lg z-10">
                    Saat Ini
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setExperienceToDelete(exp.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate" title={exp.role}>{exp.role}</h3>
                  <p className="text-muted-foreground font-medium truncate" title={exp.company}>{exp.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                      {exp.isCurrent ? 'Saat Ini' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{exp.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {sortedExperiences.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Edit Dialog/Drawer */}
        {isMobile ? (
          <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>{editingExperience?.id ? 'Ubah' : 'Tambah'} Pengalaman</DrawerTitle>
              </DrawerHeader>
              <form onSubmit={handleSave}>
                <div className="px-4 overflow-y-auto max-h-[60vh]">
                  <FormContent />
                </div>
                <DrawerFooter>
                  <Button type="submit" className="btn-neon" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingExperience?.id ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExperience?.id ? 'Ubah' : 'Tambah'} Pengalaman</DialogTitle>
                <DialogDescription>
                  {editingExperience?.id ? 'Perbarui pengalaman kerja Anda' : 'Tambahkan pengalaman kerja baru ke linimasa Anda'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave}>
                <FormContent />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="btn-neon" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingExperience?.id ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Hapus Pengalaman"
          description="Apakah Anda yakin ingin menghapus pengalaman ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
  );
};

export default ExperienceManager;