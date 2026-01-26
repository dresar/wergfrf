import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Search,
} from 'lucide-react';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { type WATemplate, useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

const WATemplateManager = () => {
  const { 
    waTemplates, 
    addWATemplate, 
    updateWATemplate, 
    deleteWATemplate 
  } = useAdminStore();
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Partial<WATemplate> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditDialog = (template?: WATemplate) => {
    setEditingTemplate(
      template
        ? { ...template }
        : {
            template_name: '',
            template_content: '',
            category: 'General',
            is_active: true,
          }
    );
    setDialogOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingTemplate) return;

    if (!editingTemplate.template_name || !editingTemplate.template_content) {
      toast.error('Harap isi nama dan konten template');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTemplate.id) {
        await updateWATemplate(editingTemplate.id, editingTemplate);
        toast.success('Template berhasil diperbarui');
      } else {
        await addWATemplate(editingTemplate as Omit<WATemplate, 'id'>);
        toast.success('Template berhasil ditambahkan');
      }
      setDialogOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (templateToDelete) {
      try {
        await deleteWATemplate(templateToDelete);
        toast.success('Template berhasil dihapus');
        setTemplateToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        toast.error('Gagal menghapus template');
      }
    }
  };

  const filteredTemplates = waTemplates.filter((t) => {
    const matchesSearch = t.template_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.template_content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(waTemplates.map((t) => t.category)));

  const FormContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Template *</Label>
        <Input
          id="name"
          placeholder="misal: Salam Pembuka"
          value={editingTemplate?.template_name || ''}
          onChange={(e) =>
            setEditingTemplate((prev) => ({ ...prev, template_name: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Input
          id="category"
          placeholder="misal: General, Inquiry, Support"
          value={editingTemplate?.category || ''}
          onChange={(e) =>
            setEditingTemplate((prev) => ({ ...prev, category: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Konten Pesan *</Label>
        <Textarea
          id="content"
          placeholder="Tulis pesan template di sini..."
          value={editingTemplate?.template_content || ''}
          onChange={(e) =>
            setEditingTemplate((prev) => ({ ...prev, template_content: e.target.value }))
          }
          className="min-h-[150px]"
        />
        <p className="text-xs text-muted-foreground">
          Gunakan template ini untuk membalas pesan dengan cepat.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-active"
          checked={editingTemplate?.is_active || false}
          onCheckedChange={(checked) =>
            setEditingTemplate((prev) => ({ ...prev, is_active: checked }))
          }
        />
        <Label htmlFor="is-active">Status Aktif</Label>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Template WhatsApp</h1>
            <p className="text-muted-foreground mt-1">Kelola template pesan untuk balasan cepat</p>
          </div>
          <Button onClick={() => openEditDialog()} className="btn-neon">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Template
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length === 0 ? (
          <EmptyState
            icon="message-square"
            title="Tidak ada template ditemukan"
            description={searchQuery ? "Coba kata kunci lain" : "Belum ada template yang dibuat"}
            action={!searchQuery ? { label: 'Tambah Template', onClick: () => openEditDialog() } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl overflow-hidden card-hover group flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {template.category}
                      </Badge>
                      <h3 className="font-semibold text-lg">{template.template_name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {template.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground line-clamp-4 min-h-[5rem]">
                    {template.template_content}
                  </div>
                </div>

                <div className="p-4 border-t bg-card/50 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(template)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setTemplateToDelete(template.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Dialog/Drawer */}
        {isMobile ? (
          <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{editingTemplate?.id ? 'Edit' : 'Tambah'} Template</DrawerTitle>
                <DrawerDescription>
                  {editingTemplate?.id ? 'Perbarui detail template pesan' : 'Buat template pesan baru'}
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <FormContent />
              </div>
              <DrawerFooter>
                <Button onClick={() => handleSave()} className="btn-neon" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : (editingTemplate?.id ? 'Simpan Perubahan' : 'Tambah Template')}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTemplate?.id ? 'Edit' : 'Tambah'} Template</DialogTitle>
                <DialogDescription>
                  {editingTemplate?.id ? 'Perbarui detail template pesan' : 'Buat template pesan baru'}
                </DialogDescription>
              </DialogHeader>
              <FormContent />
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button onClick={() => handleSave()} className="btn-neon" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : (editingTemplate?.id ? 'Simpan Perubahan' : 'Tambah Template')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Hapus Template"
          description="Apakah Anda yakin ingin menghapus template ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDelete}
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
};

export default WATemplateManager;
