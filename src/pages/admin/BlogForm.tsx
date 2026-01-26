import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArrowLeft, Upload, X, Loader2, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { normalizeMediaUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useAI } from '@/hooks/useAI';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { BlogCategoryManager } from '@/components/admin/BlogCategoryManager';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  seo_keywords: string; // Comma separated for input
}

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, addPost, updatePost } = useBlogPosts();
  const { categories } = useBlogCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  
  // Media handling
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Scheduling
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  
  // AI Integration
  const { generateContent, optimizeSEO, isGenerating: isAIGenerating } = useAI();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);
    if (!isEditing) {
      setValue('slug', generateSlug(newTitle));
    }
  };

  const handleGenerateExcerpt = async () => {
    const title = watch('title');
    if (!title) {
      toast.error('Mohon isi judul terlebih dahulu');
      return;
    }
    try {
      const generated = await generateContent(
        `Buat kutipan (excerpt) pendek yang menarik untuk artikel berjudul: "${title}". Maksimal 2 kalimat. Langsung ke intinya.`, 
        'engaging', 
        'excerpt'
      );
      setValue('excerpt', generated);
      toast.success('Excerpt berhasil dibuat!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateSEO = async () => {
    // Priority: Title > Excerpt > Content
    const targetText = watch('title') || watch('excerpt') || content;
    
    if (!targetText) {
      toast.error('Mohon isi judul artikel terlebih dahulu');
      return;
    }
    
    try {
      const seo = await optimizeSEO(targetText, watch('title')); // Pass title as keyword/context
      if (seo) {
        // Force update form values
        setValue('seo_title', seo.title || watch('title')); // Fallback to title if AI fails
        setValue('seo_description', seo.description || watch('excerpt') || '');
        
        const keywords = Array.isArray(seo.keywords) ? seo.keywords.join(', ') : (seo.keywords || '');
        setValue('seo_keywords', keywords);
        
        toast.success('SEO berhasil dioptimasi!');
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal mengoptimasi SEO');
    }
  };

  const isEditing = !!id;
  const existingPost = posts.find((p: any) => p.id === Number(id));

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      is_published: false,
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
    }
  });

  useEffect(() => {
    if (isEditing && existingPost) {
      setValue('title', existingPost.title);
      setValue('slug', existingPost.slug);
      setValue('excerpt', existingPost.excerpt);
      setValue('category_id', existingPost.category?.id?.toString() || '');
      setValue('is_published', existingPost.is_published);
      setValue('seo_title', existingPost.seo_title);
      setValue('seo_description', existingPost.seo_description);
      setValue('seo_keywords', Array.isArray(existingPost.seo_keywords) ? existingPost.seo_keywords.join(', ') : '');
      setContent(existingPost.content || '');
      
      if (existingPost.publish_at) {
        setPublishDate(new Date(existingPost.publish_at));
      }
      
      if (existingPost.coverImageFile || existingPost.coverImage) {
        setCoverPreview(normalizeMediaUrl(existingPost.coverImageFile || existingPost.coverImage));
      }
    }
  }, [isEditing, existingPost, setValue]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.slug) formData.append('slug', data.slug);
      formData.append('excerpt', data.excerpt);
      formData.append('content', content);
      if (data.category_id) formData.append('category_id', data.category_id);
      formData.append('is_published', data.is_published.toString());
      
      if (publishDate) {
        formData.append('publish_at', publishDate.toISOString());
      }
      
      formData.append('seo_title', data.seo_title);
      formData.append('seo_description', data.seo_description);
      
      // Handle keywords array
      const keywordsArray = data.seo_keywords.split(',').map(k => k.trim()).filter(Boolean);
      // Since FormData appends as string, backend expects JSON for JSONField. 
      // But DRF might expect multiple values for list. 
      // Actually for JSONField, we should send a JSON string if using FormData with simple fields, 
      // but DRF ModelSerializer handles JSON parsing if content-type is json.
      // With FormData, we might need to send it as a string that looks like JSON, or send multiple values if backend handles it.
      // Let's try sending JSON string for now.
      formData.append('seo_keywords', JSON.stringify(keywordsArray));

      if (coverImage) {
        formData.append('coverImageFile', coverImage);
      }

      if (isEditing) {
        await updatePost({ id: Number(id), data: formData });
      } else {
        await addPost(formData);
      }
      navigate('/admin/blog');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan artikel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Perbarui konten artikel blog Anda' : 'Buat konten menarik untuk pembaca Anda'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Artikel</Label>
              <Input
                id="title"
                {...register('title', { required: 'Judul wajib diisi' })}
                onChange={handleTitleChange}
                placeholder="Masukkan judul artikel..."
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="judul-artikel-anda (kosongkan untuk generate otomatis)"
              />
              <p className="text-xs text-muted-foreground">
                URL ramah mesin pencari. Biarkan kosong untuk generate otomatis dari judul.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="excerpt">Kutipan Pendek</Label>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-primary"
                    onClick={handleGenerateExcerpt}
                    disabled={isAIGenerating}
                >
                    {isAIGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    Generate from Title
                </Button>
              </div>
              <Textarea
                id="excerpt"
                {...register('excerpt')}
                placeholder="Ringkasan singkat artikel..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Konten</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Mulai menulis cerita Anda..."
                context={`Judul Artikel: ${watch('title')}\nExcerpt: ${watch('excerpt')}\nKategori: ${categories.find((c: any) => String(c.id) === watch('category_id'))?.name || ''}`}
              />
            </div>

            {/* SEO Section */}
            <div className="border rounded-lg p-4 bg-card/50 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center">
                        SEO Settings
                    </h3>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs gap-2"
                        onClick={handleGenerateSEO}
                        disabled={isAIGenerating}
                    >
                        {isAIGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Auto Optimize
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                        id="seo_title"
                        {...register('seo_title')}
                        placeholder="Judul untuk mesin pencari (opsional)"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                        id="seo_description"
                        {...register('seo_description')}
                        placeholder="Deskripsi untuk hasil pencarian (opsional)"
                        rows={2}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seo_keywords">Keywords</Label>
                    <Input
                        id="seo_keywords"
                        {...register('seo_keywords')}
                        placeholder="keyword1, keyword2, keyword3"
                    />
                </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Publish Status */}
            <div className="bg-card rounded-xl border p-4 space-y-4">
              <h3 className="font-semibold">Status Publikasi</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published" className="cursor-pointer">Publikasikan</Label>
                <Switch
                  id="is_published"
                  checked={watch('is_published')}
                  onCheckedChange={(checked) => setValue('is_published', checked)}
                />
              </div>

              <div className="space-y-2">
                  <Label>Jadwal Publikasi</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !publishDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {publishDate ? format(publishDate, "PPP", { locale: idLocale }) : <span>Pilih tanggal</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={publishDate}
                            onSelect={setPublishDate}
                            initialFocus
                        />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                      Kosongkan untuk publikasi segera (jika status Published).
                  </p>
              </div>
            </div>

            {/* Category */}
            <div className="bg-card rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="font-semibold">Kategori</h3>
                 <BlogCategoryManager />
              </div>
              
              <Select
                value={watch('category_id')}
                onValueChange={(value) => setValue('category_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cover Image */}
            <div className="bg-card rounded-xl border p-4 space-y-4">
              <h3 className="font-semibold">Gambar Sampul</h3>
              
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors relative group overflow-hidden",
                  coverPreview ? "border-primary" : "border-muted-foreground/25"
                )}
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                {coverPreview ? (
                  <>
                    <img 
                      src={coverPreview} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">Ganti Gambar</p>
                    </div>
                  </>
                ) : (
                  <div className="py-8">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk upload gambar
                    </p>
                  </div>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
              </div>
              {coverPreview && (
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                        setCoverPreview(null);
                        const input = document.getElementById('cover-upload') as HTMLInputElement;
                        if (input) input.value = '';
                    }}
                 >
                    Hapus Gambar
                 </Button>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
