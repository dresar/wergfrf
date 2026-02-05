
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Award, 
  Calendar, 
  Link as LinkIcon, 
  Loader2, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CertificateList() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialUrl: '',
    image: '',
    verified: false,
    credentialId: ''
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const data = await api.certificates.getAll();
      setCertificates(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat sertifikat." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (cert?: any) => {
    if (cert) {
      setEditingId(cert.id);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
        credentialUrl: cert.credentialUrl || '',
        image: cert.image || '',
        verified: cert.verified || false,
        credentialId: cert.credentialId || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialUrl: '',
        image: '',
        verified: false,
        credentialId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus sertifikat ini?")) return;
    try {
      await api.certificates.delete(id);
      toast({ title: "Berhasil", description: "Sertifikat dihapus." });
      loadCertificates();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        issueDate: new Date(formData.issueDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        image: formData.image === '' ? null : formData.image,
        credentialUrl: formData.credentialUrl === '' ? null : formData.credentialUrl,
        credentialId: formData.credentialId === '' ? null : formData.credentialId,
      };

      if (editingId) {
        await api.certificates.update(editingId, payload);
        toast({ title: "Berhasil", description: "Sertifikat diperbarui." });
      } else {
        await api.certificates.create(payload);
        toast({ title: "Berhasil", description: "Sertifikat ditambahkan." });
      }
      setIsModalOpen(false);
      loadCertificates();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(certificates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = certificates.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sertifikat</h2>
          <p className="text-muted-foreground">Lisensi & Sertifikasi Profesional.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Tambah Sertifikat</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Sertifikat</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Contoh: AWS Certified Cloud Practitioner" />
                </div>
                <div className="space-y-2">
                  <Label>Penerbit (Issuer)</Label>
                  <Input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required placeholder="Contoh: Amazon Web Services" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Terbit</Label>
                  <Input type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Kadaluarsa (Opsional)</Label>
                  <Input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ID Kredensial</Label>
                <Input value={formData.credentialId} onChange={e => setFormData({...formData, credentialId: e.target.value})} placeholder="Contoh: AKIAIOSFODNN7EXAMPLE" />
              </div>
              <div className="space-y-2">
                <Label>URL Kredensial</Label>
                <Input value={formData.credentialUrl} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Gambar Sertifikat (URL)</Label>
                <div className="flex gap-2">
                    <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                    {formData.image && (
                        <div className="h-10 w-10 rounded border overflow-hidden flex-shrink-0">
                            <img src={formData.image} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
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
        {currentItems.map((cert) => (
          <Card key={cert.id} className="relative group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="aspect-video bg-muted relative overflow-hidden">
                {cert.image ? (
                    <img src={cert.image} alt={cert.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                        <Award className="h-16 w-16 text-yellow-500/50" />
                    </div>
                )}
                {cert.verified && (
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                    </div>
                )}
            </div>
            <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold line-clamp-2 leading-tight mb-1">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-muted-foreground flex-grow">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Issued: {new Date(cert.issueDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    {cert.credentialId && (
                        <div className="font-mono text-xs bg-muted p-1 rounded inline-block">
                            ID: {cert.credentialId}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    {cert.credentialUrl ? (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center text-primary hover:underline">
                            <LinkIcon className="h-3 w-3 mr-1" /> Lihat Kredensial
                        </a>
                    ) : <span></span>}
                    
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(cert)}>
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cert.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
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
