import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  Clock,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlog';
import { BlogCategoryManager } from '@/components/admin/BlogCategoryManager';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { normalizeMediaUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';

export default function BlogManager() {
  const navigate = useNavigate();
  const { posts, deletePost, isLoading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Filtering
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const filteredPosts = useMemo(() => {
    return posts.filter((post: any) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'published' 
          ? post.is_published 
          : !post.is_published;
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-1">
            Kelola artikel dan konten blog Anda.
          </p>
        </div>
        <div className="flex gap-2">
            <BlogCategoryManager />
            <Button onClick={() => navigate('/admin/blog/new')}>
            <Plus className="mr-2 h-4 w-4" /> Tulis Artikel
            </Button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center border rounded-md bg-background/50 p-1">
             <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
                title="List View"
             >
                <ListIcon className="h-4 w-4" />
             </Button>
             <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
                title="Grid View"
             >
                <LayoutGrid className="h-4 w-4" />
             </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Dipublikasikan</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={Edit}
          title="Tidak ada artikel ditemukan"
          description={
            searchQuery
              ? "Tidak ada artikel yang cocok dengan kriteria pencarian Anda"
              : "Mulai dengan menulis artikel pertama Anda"
          }
          actionLabel={searchQuery ? "Hapus Pencarian" : "Tulis Artikel"}
          onAction={
            searchQuery
              ? () => setSearchQuery("")
              : () => navigate('/admin/blog/new')
          }
        />
      ) : (
        <div className={cn(
            "grid gap-4",
            viewMode === 'grid' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
            {paginatedPosts.map((post: any) => {
                const coverImage = post.coverImage || post.coverImageFile || post.cover_image;
                
                return (
                <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "group rounded-xl border bg-card hover:bg-accent/5 transition-all overflow-hidden",
                        viewMode === 'list' ? "flex flex-col sm:flex-row gap-4 p-4" : "flex flex-col"
                    )}
                >
                    {/* Thumbnail */}
                    <div className={cn(
                        "relative overflow-hidden bg-muted flex-shrink-0",
                        viewMode === 'list' ? "w-full sm:w-48 aspect-video rounded-lg" : "w-full aspect-video"
                    )}>
                        <img 
                            src={coverImage ? normalizeMediaUrl(coverImage) : "https://placehold.co/600x400?text=Blog+Post"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://placehold.co/600x400?text=Blog+Post";
                            }}
                        />
                        <div className="absolute top-2 right-2">
                             {post.is_published ? (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600 shadow-sm backdrop-blur-sm">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> 
                                    {viewMode === 'grid' ? 'Pub' : 'Published'}
                                </Badge>
                             ) : (
                                <Badge variant="secondary" className="shadow-sm backdrop-blur-sm">
                                    <Clock className="w-3 h-3 mr-1" /> Draft
                                </Badge>
                             )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className={cn(
                        "flex-1 min-w-0 flex flex-col justify-between",
                        viewMode === 'grid' && "p-4"
                    )}>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {post.category?.name || 'Uncategorized'}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {format(new Date(post.created_at), 'd MMM yyyy', { locale: idLocale })}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors" title={post.title}>
                                {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {post.excerpt || 'Tidak ada kutipan.'}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-border/50">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => navigate(`/admin/blog/${post.id}`)}
                            >
                                <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                                onClick={() => {
                                    setPostToDelete(post.id);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            {post.is_published && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    asChild
                                >
                                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
                );
            })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Artikel"
        description="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        confirmLabel="Hapus"
        variant="destructive"
      />
    </div>
  );
}
