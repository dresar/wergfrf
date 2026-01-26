import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CategoryFormData {
  name: string;
}

export const SkillCategoryManager = () => {
  const { skillCategories, addSkillCategory, updateSkillCategory, deleteSkillCategory } = useAdminStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await updateSkillCategory(editingId, { name: data.name });
        toast.success('Kategori berhasil diperbarui');
        setEditingId(null);
      } else {
        await addSkillCategory({ name: data.name, slug: '' }); // Slug handled by backend
        toast.success('Kategori berhasil ditambahkan');
      }
      reset();
    } catch (error) {
      toast.error('Gagal menyimpan kategori');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: { id: number; name: string }) => {
    setEditingId(category.id);
    setValue('name', category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Keahlian di dalamnya mungkin akan kehilangan kategori.')) {
      try {
        await deleteSkillCategory(id);
        toast.success('Kategori berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus kategori');
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:text-primary/80">
          <Plus className="mr-1 h-3 w-3" /> Kelola Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kelola Kategori Keahlian</DialogTitle>
          <DialogDescription>
            Tambah, ubah, atau hapus kategori untuk keahlian Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-end">
            <div className="grid w-full gap-2">
              <Label htmlFor="name">{editingId ? 'Edit Kategori' : 'Kategori Baru'}</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nama kategori wajib diisi' })}
                placeholder="Contoh: Frontend, Backend"
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            <div className="flex gap-2">
              {editingId && (
                <Button type="button" variant="ghost" size="icon" onClick={handleCancelEdit} title="Batal">
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* List Categories */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <Label>Daftar Kategori</Label>
            {skillCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                Belum ada kategori.
              </div>
            ) : (
              <div className="space-y-2">
                {skillCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-md bg-card/50 hover:bg-card transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
           <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
