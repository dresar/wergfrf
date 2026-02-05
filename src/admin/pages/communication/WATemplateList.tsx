
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../services/api';
import { Plus, Trash2, Edit, MessageSquare, Loader2, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function WATemplateList() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    template_name: '',
    template_content: '',
    category: 'General',
    is_active: true
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await api.waTemplates.getAll();
      setTemplates(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat template." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (tpl?: any) => {
    if (tpl) {
      setEditingId(tpl.id);
      setFormData({
        template_name: tpl.template_name,
        template_content: tpl.template_content,
        category: tpl.category || 'General',
        is_active: tpl.is_active ?? true
      });
    } else {
      setEditingId(null);
      setFormData({
        template_name: '',
        template_content: '',
        category: 'General',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus template ini?")) return;
    try {
      await api.waTemplates.delete(id);
      toast({ title: "Berhasil", description: "Template dihapus." });
      loadTemplates();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData
      };

      if (editingId) {
        await api.waTemplates.update(editingId, payload);
        toast({ title: "Berhasil", description: "Template diperbarui." });
      } else {
        await api.waTemplates.create(payload);
        toast({ title: "Berhasil", description: "Template ditambahkan." });
      }
      setIsModalOpen(false);
      loadTemplates();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Template WhatsApp</h2>
          <p className="text-muted-foreground">Kelola pesan cepat untuk balasan otomatis.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Tambah Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Template' : 'Tambah Template Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Template</Label>
                <Input value={formData.template_name} onChange={e => setFormData({...formData, template_name: e.target.value})} required placeholder="Contoh: Pesan Pembuka" />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="General, Business, Support..." />
              </div>
              <div className="space-y-2">
                <Label>Isi Pesan</Label>
                <Textarea value={formData.template_content} onChange={e => setFormData({...formData, template_content: e.target.value})} required placeholder="Halo, terima kasih sudah menghubungi..." className="min-h-[100px]" />
                <p className="text-xs text-muted-foreground">Gunakan template ini untuk mempercepat balasan di WhatsApp.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-active" 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} 
                />
                <Label htmlFor="is-active">Aktif</Label>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="relative group hover:shadow-lg transition-all duration-300 flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{tpl.template_name}</h3>
                        <Badge variant="outline" className="mt-1 text-xs">{tpl.category}</Badge>
                    </div>
                </div>
                {tpl.is_active ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                ) : (
                    <Badge variant="secondary">Non-aktif</Badge>
                )}
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm italic text-muted-foreground flex-grow whitespace-pre-wrap">
                "{tpl.template_content}"
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(tpl)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(tpl.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && !isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                <p>Belum ada template WhatsApp.</p>
                <Button variant="link" onClick={() => handleOpenModal()}>Buat Template Pertama</Button>
            </div>
        )}
      </div>
    </div>
  );
}
