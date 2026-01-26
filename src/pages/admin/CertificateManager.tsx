import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Award,
  Edit,
  Trash2,
  Calendar,
  Upload,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCertificates } from '@/hooks/useCertificates';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ImagePreview } from '@/components/admin/ImagePreview';
import { type Certificate, useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { CertificateCategoryManager } from '@/components/admin/CertificateCategoryManager';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Pagination } from '@/components/ui/pagination';

const CertificateManager = () => {
  const { 
    certificates = [], 
    isLoading: loading, 
    addCertificate, 
    updateCertificate, 
    deleteCertificate,
    isAdding,
    isUpdating,
    refetch
  } = useCertificates();
  const { certificateCategories } = useAdminStore();
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<number | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTestingLink, setIsTestingLink] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const openEditDialog = (cert?: Certificate) => {
    setEditingCertificate(
      cert
        ? { ...cert }
        : {
            name: '',
            issuer: '',
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: undefined,
            credentialUrl: '',
            image: '',
            verified: false,
          }
    );
    setDialogOpen(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingCertificate) return;

    if (!editingCertificate.name || !editingCertificate.issuer) {
      toast.error('Harap isi kolom yang wajib diisi');
      return;
    }

    if (editingCertificate.id) {
      updateCertificate({ id: editingCertificate.id, data: editingCertificate }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingCertificate(null);
        }
      });
    } else {
      addCertificate(editingCertificate as Omit<Certificate, 'id'>, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingCertificate(null);
        }
      });
    }
  };

  const handleDelete = () => {
    if (certificateToDelete) {
      deleteCertificate(certificateToDelete, {
        onSuccess: () => {
          setCertificateToDelete(null);
          setDeleteDialogOpen(false);
        }
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Handle file upload
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setEditingCertificate((prev) => ({ ...prev, image: imageUrl }));
          toast.success('Gambar sertifikat berhasil diunggah');
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const testCredentialLink = async () => {
    if (!editingCertificate?.credentialUrl) {
      toast.error('Harap masukkan URL kredensial terlebih dahulu');
      return;
    }

    setIsTestingLink(true);
    
    // Simulate link verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock verification result
    const isValid = editingCertificate.credentialUrl.startsWith('https://');
    
    setEditingCertificate((prev) => ({ ...prev, verified: isValid }));
    
    if (isValid) {
      toast.success('Tautan kredensial berhasil diverifikasi!');
    } else {
      toast.error('Tidak dapat memverifikasi tautan kredensial. Pastikan menggunakan HTTPS.');
    }
    
    setIsTestingLink(false);
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort(
      (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );
  }, [certificates]);

  const totalPages = Math.ceil(sortedCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = useMemo(() => {
    return sortedCertificates.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedCertificates, currentPage]);

  const FormContent = () => (
    <div className="space-y-6">
      {/* Certificate Image Upload */}
      <div className="space-y-2">
        <Label>Gambar Sertifikat</Label>
        <div
          className={cn(
            'border-2 border-dashed rounded-xl overflow-hidden transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {editingCertificate?.image ? (
            <div className="relative">
              <img
                src={editingCertificate.image}
                alt="Certificate"
                className="w-full h-48 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setEditingCertificate((prev) => ({ ...prev, image: '' }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Seret & lepas gambar sertifikat di sini
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, atau PDF hingga 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL Gambar (Opsional - jika menggunakan CDN)</Label>
        <Input
          id="imageUrl"
          placeholder="https://example.com/certificate.png"
          value={editingCertificate?.image || ''}
          onChange={(e) =>
            setEditingCertificate((prev) => ({ ...prev, image: e.target.value }))
          }
        />
        <p className="text-xs text-muted-foreground">
          Anda dapat mengunggah gambar atau menempelkan URL gambar langsung di sini.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Kategori</Label>
        <Select
          value={editingCertificate?.category?.toString() || "0"}
          onValueChange={(value) =>
            setEditingCertificate((prev) => ({
              ...prev,
              category: value === "0" ? null : parseInt(value),
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kategori (Opsional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tanpa Kategori</SelectItem>
            {certificateCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Sertifikat *</Label>
          <Input
            id="name"
            placeholder="misal: AWS Solutions Architect"
            value={editingCertificate?.name || ''}
            onChange={(e) =>
              setEditingCertificate((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer">Organisasi Penerbit *</Label>
          <Input
            id="issuer"
            placeholder="misal: Amazon Web Services"
            value={editingCertificate?.issuer || ''}
            onChange={(e) =>
              setEditingCertificate((prev) => ({ ...prev, issuer: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tanggal Terbit</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {editingCertificate?.issueDate
                  ? format(new Date(editingCertificate.issueDate), 'MMM dd, yyyy')
                  : 'Pilih tanggal'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={editingCertificate?.issueDate ? new Date(editingCertificate.issueDate) : undefined}
                onSelect={(date) =>
                  setEditingCertificate((prev) => ({
                    ...prev,
                    issueDate: date?.toISOString().split('T')[0] || '',
                  }))
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Tanggal Kadaluarsa (Opsional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {editingCertificate?.expiryDate
                  ? format(new Date(editingCertificate.expiryDate), 'MMM dd, yyyy')
                  : 'Tidak kadaluarsa'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={editingCertificate?.expiryDate ? new Date(editingCertificate.expiryDate) : undefined}
                onSelect={(date) =>
                  setEditingCertificate((prev) => ({
                    ...prev,
                    expiryDate: date?.toISOString().split('T')[0],
                  }))
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {editingCertificate?.expiryDate && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setEditingCertificate((prev) => ({ ...prev, expiryDate: undefined }))}
            >
              Hapus tanggal kadaluarsa
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentialUrl">URL Kredensial</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="credentialUrl"
              placeholder="https://www.credly.com/badges/..."
              className="pl-10"
              value={editingCertificate?.credentialUrl || ''}
              onChange={(e) =>
                setEditingCertificate((prev) => ({ 
                  ...prev, 
                  credentialUrl: e.target.value,
                  verified: false,
                }))
              }
            />
          </div>
          <Button
            variant="outline"
            onClick={testCredentialLink}
            disabled={isTestingLink}
          >
            {isTestingLink ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                />
                Menguji...
              </span>
            ) : (
              'Uji Tautan'
            )}
          </Button>
        </div>
        {editingCertificate?.verified && (
          <div className="flex items-center gap-1 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Kredensial terverifikasi
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
            <h1 className="text-3xl font-bold tracking-tight">Sertifikat</h1>
            <p className="text-muted-foreground mt-1">Kelola sertifikasi profesional Anda</p>
          </div>
          <div className="flex gap-2 items-center">
            <CertificateCategoryManager />
            <Button onClick={() => openEditDialog()} className="btn-neon">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sertifikat
            </Button>
          </div>
        </motion.div>

        {/* Certificate Grid */}
        {sortedCertificates.length === 0 ? (
          <EmptyState
            icon="award"
            title="Belum ada sertifikat ditambahkan"
            description="Tambahkan sertifikasi Anda untuk menampilkan kepakaran Anda"
            action={{ label: 'Tambah Sertifikat', onClick: () => openEditDialog() }}
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden card-hover group"
              >
                {/* Certificate Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImagePreview
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {cert.verified && (
                      <Badge className="bg-success/90 text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Terverifikasi
                      </Badge>
                    )}
                    {isExpired(cert.expiryDate) && (
                      <Badge className="bg-destructive/90 text-destructive-foreground">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Kadaluarsa
                      </Badge>
                    )}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => openEditDialog(cert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {cert.credentialUrl && (
                      <Button
                        variant="secondary"
                        size="icon"
                        asChild
                      >
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setCertificateToDelete(cert.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                  
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Diterbitkan {format(new Date(cert.issueDate), 'MMM yyyy')}</span>
                  </div>
                  
                  {cert.expiryDate && (
                    <div className={cn(
                      'flex items-center gap-2 mt-1 text-xs',
                      isExpired(cert.expiryDate) ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        {isExpired(cert.expiryDate) ? 'Kadaluarsa' : 'Kadaluarsa pada'}{' '}
                        {format(new Date(cert.expiryDate), 'MMM yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && sortedCertificates.length > 0 && (
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
                <DrawerTitle>{editingCertificate?.id ? 'Ubah' : 'Tambah'} Sertifikat</DrawerTitle>
                <DrawerDescription>
                  {editingCertificate?.id ? 'Perbarui sertifikasi Anda' : 'Tambahkan sertifikasi baru'}
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 overflow-y-auto max-h-[60vh]">
                <FormContent />
              </div>
              <DrawerFooter>
                <Button onClick={handleSave} className="btn-neon">
                  {editingCertificate?.id ? 'Simpan Perubahan' : 'Tambah Sertifikat'}
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
                  <DialogTitle>{editingCertificate?.id ? 'Ubah' : 'Tambah'} Sertifikat</DialogTitle>
                  <DialogDescription>
                    {editingCertificate?.id ? 'Perbarui sertifikasi Anda' : 'Tambahkan sertifikasi baru'}
                  </DialogDescription>
                </DialogHeader>
                <FormContent />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="btn-neon" disabled={isAdding || isUpdating}>
                    {(isAdding || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingCertificate?.id ? 'Simpan Perubahan' : 'Tambah Sertifikat'}
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
          title="Hapus Sertifikat"
          description="Apakah Anda yakin ingin menghapus sertifikat ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
  );
};

export default CertificateManager;
