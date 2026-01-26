import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Loader2,
  Trash2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { mediaAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';

interface MediaFile {
  name: string;
  path: string;
  url: string;
  size: number;
  modified: number;
  type: 'image' | 'file';
}

const MediaManager = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await mediaAPI.getAll();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch media files:', error);
      toast.error('Gagal memuat file media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL disalin ke clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    let successCount = 0;
    
    for (const file of acceptedFiles) {
      try {
        await mediaAPI.upload(file);
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast.error(`Gagal mengunggah ${file.name}`);
      }
    }
    
    if (successCount > 0) {
      toast.success(`${successCount} file berhasil diunggah`);
      setUploadDialogOpen(false);
      fetchFiles();
    }
    
    setIsUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajer Media</h1>
          <p className="text-muted-foreground mt-1">
            Kelola gambar dan file yang tersimpan di server
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchFiles} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File Baru</DialogTitle>
              </DialogHeader>
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors mt-4",
                  isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                  isUploading && "pointer-events-none opacity-50"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground font-medium">
                    {isUploading 
                      ? "Sedang mengunggah..." 
                      : isDragActive 
                        ? "Lepaskan file di sini" 
                        : "Drag & drop file di sini, atau klik untuk memilih"}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari file..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading && files.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? "Tidak ada file yang cocok dengan pencarian" : "Belum ada file media"}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-all h-full flex flex-col">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => window.open(file.url, '_blank')}
                      title="Buka File"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleCopyUrl(file.url)}
                      title="Salin URL"
                    >
                      {copiedUrl === file.url ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatSize(file.size)}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t text-[10px] text-muted-foreground flex justify-between">
                    <span>{formatDate(file.modified)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
