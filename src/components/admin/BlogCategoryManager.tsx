import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlog';
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

export const BlogCategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useBlogCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await updateCategory({ id: editingId, data: { name: data.name } });
        toast.success('Kategori berhasil diperbarui');
        setEditingId(null);
      } else {
        await addCategory({ name: data.name }); // Slug handled by backend
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
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await deleteCategory(id);
        toast.success('Kategori berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus kategori');
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Plus className="mr-2 h-4 w-4" /> Kelola Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kelola Kategori Blog</DialogTitle>
          <DialogDescription>
            Tambah, ubah, atau hapus kategori untuk blog Anda.
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
                placeholder="Contoh: Tutorial"
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            <div className="flex gap-2">
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
              </Button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Daftar Kategori</h4>
            {categories.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground bg-muted/30 rounded-lg">
                Belum ada kategori
              </div>
            ) : (
              categories.map((category: any) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
