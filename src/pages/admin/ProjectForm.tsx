import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
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
import { ArrowLeft, Plus, Trash2, Upload, X, Link as LinkIcon, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Project, useAdminStore } from '@/store/adminStore';
import { CategoryManager } from '@/components/admin/CategoryManager';

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  demoUrl: string;
  repoUrl: string;
  video_url: string;
  is_featured: boolean;
  content: string;
  techStack: string; // Comma separated for input
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, addProject, updateProject, deleteImage } = useProjects();
  const { projectCategories } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  
  // Media handling
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Dynamic Links
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);

  const isEditing = !!id;
  const existingProject = projects.find(p => p.id === Number(id));

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      demoUrl: '',
      repoUrl: '',
      video_url: '',
      is_featured: false,
      techStack: '',
      content: '',
    }
  });

  useEffect(() => {
    if (isEditing && existingProject) {
      setValue('title', existingProject.title);
      setValue('description', existingProject.description);
      setValue('category', existingProject.category ? String(existingProject.category) : '');
      setValue('demoUrl', existingProject.demoUrl || '');
      setValue('repoUrl', existingProject.repoUrl || '');
      setValue('video_url', existingProject.video_url || '');
      setValue('is_featured', existingProject.is_featured || false);
      setValue('techStack', existingProject.techStack?.join(', ') || '');
      setContent(existingProject.content || '');
      
      if (existingProject.links) {
        setLinks(existingProject.links);
      }
      
      if (existingProject.cover_image) {
        setCoverPreview(existingProject.cover_image);
      } else if (existingProject.thumbnail) {
        setCoverPreview(existingProject.thumbnail);
      }

      if (existingProject.video_file) {
        setVideoPreview(existingProject.video_file);
      }
    }
  }, [isEditing, existingProject, setValue]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!existingProject?.id) return;
    try {
      await deleteImage({ projectId: existingProject.id, imageId });
      // The query invalidation in useProjects will update the UI
    } catch (error) {
      console.error('Failed to delete image', error);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: '', url: '' }]);
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('content', content);
      formData.append('is_featured', String(data.is_featured));
      
      if (data.demoUrl) formData.append('demoUrl', data.demoUrl);
      if (data.repoUrl) formData.append('repoUrl', data.repoUrl);
      if (data.video_url) formData.append('video_url', data.video_url);
      
      // Process Tech Stack
      if (data.techStack) {
          const techStackArray = data.techStack.split(',').map(t => t.trim()).filter(Boolean);
          // Backend expects a valid JSON string that represents a list
          formData.append('techStack', JSON.stringify(techStackArray));
      } else {
          formData.append('techStack', '[]');
      }
      
      // Process Links
      formData.append('links', JSON.stringify(links));

      // Ensure content is appended, even if empty string
      // The RichTextEditor state 'content' is used here
      formData.append('content', content || ''); 

      // Log FormData content for debugging
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

      // Files
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      
      galleryImages.forEach((file) => {
        formData.append('uploaded_images', file);
      });

      if (isEditing && id) {
        await updateProject({ id: Number(id), data: formData });
        toast.success('Proyek berhasil diperbarui');
      } else {
        await addProject(formData);
        toast.success('Proyek berhasil dibuat');
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan proyek');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Ubah Proyek' : 'Proyek Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Proyek</Label>
              <Input id="title" {...register('title', { required: true })} placeholder="Proyek Keren Saya" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Kategori</Label>
                <CategoryManager />
              </div>
              <Select 
                onValueChange={(value) => setValue('category', value)}
                value={watch('category') ? String(watch('category')) : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Ringkasan Singkat</Label>
              <Textarea 
                id="description" 
                {...register('description', { required: true })} 
                placeholder="Gambaran singkat proyek..."
                className="h-24" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Teknologi (dipisahkan koma)</Label>
              <Input 
                id="techStack" 
                {...register('techStack')} 
                placeholder="React, TypeScript, Node.js, Tailwind" 
              />
            </div>

             <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="is_featured" 
                checked={watch('is_featured')}
                onCheckedChange={(checked) => setValue('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Proyek Unggulan</Label>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="space-y-6">
             <div className="space-y-2">
              <Label>Gambar Sampul</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {coverPreview ? (
                  <div className="relative aspect-video w-full rounded-md overflow-hidden bg-background">
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Ganti Sampul
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <p>Klik untuk mengunggah gambar sampul</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gambar Galeri (Tak Terbatas)</Label>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Existing Images */}
                {isEditing && existingProject?.images && existingProject.images.map((img) => (
                  <div key={`existing-${img.id}`} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                    <img src={img.image} alt={img.caption || 'Gallery Image'} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus Gambar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* New Previews */}
                {galleryPreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                    <img src={preview} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Add Button */}
                <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Tambah Gambar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Content (Rich Text) */}
        <div className="space-y-2">
          <Label>Konten Detail (Teks Kaya)</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* URLs and Links */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold">Tautan & Sumber Daya</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demoUrl">URL Demo</Label>
              <Input id="demoUrl" {...register('demoUrl')} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repoUrl">URL Repositori</Label>
              <Input id="repoUrl" {...register('repoUrl')} placeholder="https://github.com/..." />
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="video_url" className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" /> URL Video YouTube
              </Label>
              <Input id="video_url" {...register('video_url')} placeholder="https://youtube.com/watch?v=..." />
              {watch('video_url') && (
                 <div className="mt-2 aspect-video w-full max-w-md bg-muted rounded-md overflow-hidden">
                    <iframe 
                      src={watch('video_url').replace('watch?v=', 'embed/')} 
                      className="w-full h-full" 
                      title="Video Preview"
                      allowFullScreen
                    />
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tautan Tambahan</Label>
            {links.map((link, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input 
                  placeholder="Label (e.g. File Desain)" 
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Input 
                  placeholder="URL" 
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="flex-[2]"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLink} className="gap-2">
              <Plus className="h-4 w-4" /> Tambah Tautan
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/projects')}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              'Simpan Proyek'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
