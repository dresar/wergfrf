import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  GraduationCap,
  Edit,
  Trash2,
  Calendar,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useEducation } from '@/hooks/useEducation';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImagePreview } from '@/components/admin/ImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Education } from '@/store/adminStore';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Pagination } from '@/components/ui/pagination';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const EducationManager = () => {
  const { 
    education = [], 
    isLoading: loading, 
    addEducation, 
    updateEducation, 
    deleteEducation,
    isAdding,
    isUpdating
  } = useEducation();
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<number | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<Education> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const openEditDialog = (edu?: Education) => {
    setEditingEducation(
      edu
        ? { ...edu }
        : {
            institution: '',
            degree: '',
            field: '',
            startDate: `${currentYear}-09-01`,
            endDate: `${currentYear}-06-30`,
            gpa: '',
            logo: '',
            attachments: [],
            gallery: [],
          }
    );
    setDialogOpen(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingEducation) return;

    if (!editingEducation.institution || !editingEducation.degree) {
      toast.error('Harap isi kolom yang wajib diisi');
      return;
    }

    const educationData = {
      ...editingEducation,
      attachments: editingEducation.attachments || [],
      gallery: editingEducation.gallery || [],
    } as any; // Cast to any to avoid strict type checking for now, assuming hook handles it

    if (editingEducation.id) {
      updateEducation({ id: editingEducation.id, data: educationData }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingEducation(null);
        }
      });
    } else {
      addEducation(educationData, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingEducation(null);
        }
      });
    }
  };

  const handleDelete = () => {
    if (educationToDelete) {
      deleteEducation(educationToDelete, {
        onSuccess: () => {
          setEducationToDelete(null);
          setDeleteDialogOpen(false);
        }
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, type: 'attachments' | 'gallery' | 'logo') => {
      e.preventDefault();
      setIsDragging(false);
      setIsGalleryDragging(false);

      // Handle file upload
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            if (type === 'logo') {
              setEditingEducation((prev) => ({ ...prev, logo: imageUrl }));
              toast.success('Logo berhasil diunggah');
            } else {
              setEditingEducation((prev) => ({
                ...prev,
                [type]: [...(prev?.[type] || []), imageUrl],
              }));
              toast.success(`Berkas berhasil ditambahkan ke ${type}`);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    []
  );

  const removeFromArray = (type: 'attachments' | 'gallery', index: number) => {
    setEditingEducation((prev) => ({
      ...prev,
      [type]: prev?.[type]?.filter((_, i) => i !== index) || [],
    }));
  };

  const sortedEducation = useMemo(() => {
    return [...education].sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  }, [education]);

  const totalPages = Math.ceil(sortedEducation.length / ITEMS_PER_PAGE);
  const paginatedEducation = useMemo(() => {
    return sortedEducation.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedEducation, currentPage]);

  const FormContent = () => (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Logo Institusi</Label>
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-4 text-center transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => handleDrop(e, 'logo')}
        >
          {editingEducation?.logo ? (
            <div className="flex items-center justify-center gap-4">
              <img
                src={editingEducation.logo}
                alt="Logo"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingEducation((prev) => ({ ...prev, logo: '' }))}
              >
                <X className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Seret & lepas logo di sini, atau klik untuk menelusuri
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Nama Institusi *</Label>
          <Input
            id="institution"
            placeholder="misal: Universitas Teknologi"
            value={editingEducation?.institution || ''}
            onChange={(e) =>
              setEditingEducation((prev) => ({ ...prev, institution: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Gelar *</Label>
          <Input
            id="degree"
            placeholder="misal: Sarjana Komputer"
            value={editingEducation?.degree || ''}
            onChange={(e) =>
              setEditingEducation((prev) => ({ ...prev, degree: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="field">Bidang Studi</Label>
          <Input
            id="field"
            placeholder="misal: Ilmu Komputer"
            value={editingEducation?.field || ''}
            onChange={(e) =>
              setEditingEducation((prev) => ({ ...prev, field: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpa">IPK / Nilai</Label>
          <Input
            id="gpa"
            placeholder="misal: 3.8"
            value={editingEducation?.gpa || ''}
            onChange={(e) =>
              setEditingEducation((prev) => ({ ...prev, gpa: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tahun Mulai</Label>
          <Select
            value={editingEducation?.startDate?.split('-')[0] || ''}
            onValueChange={(v) =>
              setEditingEducation((prev) => ({ ...prev, startDate: `${v}-09-01` }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tahun Lulus</Label>
          <Select
            value={editingEducation?.endDate?.split('-')[0] || ''}
            onValueChange={(v) =>
              setEditingEducation((prev) => ({ ...prev, endDate: `${v}-06-30` }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attachments (Ijazah/Transcript) */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Lampiran (Ijazah / Transkrip)
        </Label>
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-4 text-center transition-colors',
            'border-border hover:border-primary/50'
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'attachments')}
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Seret & lepas dokumen di sini
          </p>
        </div>
        {editingEducation?.attachments && editingEducation.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {editingEducation.attachments.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromArray('attachments', index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Galeri Kampus
        </Label>
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-4 text-center transition-colors',
            isGalleryDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsGalleryDragging(true);
          }}
          onDragLeave={() => setIsGalleryDragging(false)}
          onDrop={(e) => handleDrop(e, 'gallery')}
        >
          <ImageIcon className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Seret & lepas foto kampus di sini
          </p>
        </div>
        {editingEducation?.gallery && editingEducation.gallery.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {editingEducation.gallery.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromArray('gallery', index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pendidikan</h1>
            <p className="text-muted-foreground mt-1">Kelola latar belakang pendidikan Anda</p>
          </div>
          <Button onClick={() => openEditDialog()} className="btn-neon">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pendidikan
          </Button>
        </motion.div>

        {/* Education Cards */}
        {sortedEducation.length === 0 ? (
          <EmptyState
            icon="graduation-cap"
            title="Belum ada pendidikan ditambahkan"
            description="Tambahkan latar belakang pendidikan Anda untuk menampilkan kualifikasi Anda"
            action={{ label: 'Tambah Pendidikan', onClick: () => openEditDialog() }}
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedEducation.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden card-hover group"
              >
                {/* Gallery Preview or Placeholder */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                  {edu.gallery && edu.gallery.length > 0 ? (
                    <img
                      src={edu.gallery[0]}
                      alt="Campus"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <GraduationCap className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                  
                  {/* Logo */}
                  {edu.logo && (
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                      <img
                        src={edu.logo}
                        alt={edu.institution}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-background shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <div className={cn('p-4', edu.logo && 'pt-8')}>
                  <h3 className="font-semibold text-lg">{edu.institution}</h3>
                  <p className="text-primary font-medium">{edu.degree}</p>
                  {edu.field && (
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.startDate.split('-')[0]} - {edu.endDate.split('-')[0]}
                    </Badge>
                    {edu.gpa && (
                      <Badge variant="outline">IPK: {edu.gpa}</Badge>
                    )}
                  </div>

                  {/* Attachments indicator */}
                  {edu.attachments && edu.attachments.length > 0 && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {edu.attachments.length} lampiran
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(edu)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Ubah
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setEducationToDelete(edu.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {sortedEducation.length > 0 && (
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
                <DrawerTitle>{editingEducation?.id ? 'Ubah' : 'Tambah'} Pendidikan</DrawerTitle>
                <DrawerDescription>
                  {editingEducation?.id ? 'Perbarui detail pendidikan Anda' : 'Tambahkan entri pendidikan baru'}
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 overflow-y-auto max-h-[60vh]">
                <FormContent />
              </div>
              <DrawerFooter>
                <Button onClick={handleSave} className="btn-neon">
                  {editingEducation?.id ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle>{editingEducation?.id ? 'Ubah' : 'Tambah'} Pendidikan</DialogTitle>
                  <DialogDescription>
                    {editingEducation?.id ? 'Perbarui detail pendidikan Anda' : 'Tambahkan entri pendidikan baru'}
                  </DialogDescription>
                </DialogHeader>
                <FormContent />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="btn-neon" disabled={isAdding || isUpdating}>
                    {(isAdding || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingEducation?.id ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
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
          title="Hapus Pendidikan"
          description="Apakah Anda yakin ingin menghapus entri pendidikan ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
  );
};

export default EducationManager;
