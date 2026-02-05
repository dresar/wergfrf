
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit, 
  FileText, 
  Calendar, 
  Eye,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setCurrentPage(1); // Reset to first page on search
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await api.blogPosts.getAll();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat artikel blog." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await api.blogPosts.delete(id);
      toast({ title: "Berhasil", description: "Artikel dihapus." });
      loadPosts();
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus artikel." });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog & Artikel</h2>
          <p className="text-muted-foreground">Kelola konten artikel, tutorial, dan berita.</p>
        </div>
        <Button onClick={() => navigate('/admin/blog/new')}>
          <Plus className="mr-2 h-4 w-4" /> Tulis Artikel Baru
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Cari artikel..." 
          className="border-none shadow-none focus-visible:ring-0 h-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all flex flex-col group">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                  <FileText className="h-12 w-12 opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                 <Badge variant={post.is_published ? "default" : "secondary"} className={post.is_published ? "bg-green-500/90 hover:bg-green-600 shadow-sm" : "bg-background/80 backdrop-blur shadow-sm"}>
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="mb-2">
                 <Badge variant="outline" className="text-xs mb-2">{post.category?.name || "Uncategorized"}</Badge>
                 <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                {post.excerpt || "Tidak ada ringkasan."}
              </p>

              <div className="pt-4 border-t mt-auto flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {post.published_at 
                        ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: idLocale }) 
                        : 'Draft'}
                    </span>
                 </div>

                 <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Tidak ada artikel ditemukan.</p>
            <Button variant="link" onClick={() => navigate('/admin/blog/new')}>Mulai Menulis</Button>
          </div>
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
