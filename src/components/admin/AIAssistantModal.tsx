import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, RefreshCw, Check } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  type?: 'content' | 'seo' | 'bio' | 'general';
  initialContext?: string;
}

export const AIAssistantModal = ({ 
  isOpen, 
  onClose, 
  onInsert, 
  type = 'general',
  initialContext = ''
}: AIAssistantModalProps) => {
  const { generateContent, optimizeSEO, isGenerating } = useAI();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedSEO, setGeneratedSEO] = useState<{ title?: string; description?: string; keywords?: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!prompt && type !== 'seo') return;

    try {
      if (type === 'seo') {
        // For SEO, we might use the initialContext as the content to analyze
        const res = await optimizeSEO(initialContext || prompt, prompt); // Using prompt as keyword if provided
        setGeneratedSEO(res);
        // If it returns a single string description, handle that too, but assuming object based on hook signature
      } else {
        // Map types to backend expected types
        let aiType = 'blog';
        if (type === 'bio') aiType = 'bio';
        if (type === 'content' && initialContext) aiType = 'project_detail';
        
        // Combine initialContext with prompt for rich context if available
        const finalPrompt = initialContext 
          ? `${initialContext}\n\nAdditional Instruction: ${prompt}`
          : prompt;
          
        const res = await generateContent(finalPrompt, tone, aiType);
        setGeneratedText(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInsert = () => {
    if (type === 'seo' && generatedSEO) {
      // For SEO, we might need a way to return multiple fields. 
      // But onInsert expects a string. 
      // We might need to handle this differently or just return the description.
      // For now, let's just return the description if that's what's needed, 
      // OR JSON stringify it if the parent can handle it?
      // Actually, looking at Settings.tsx, SEO is title and desc.
      // Let's assume for now we return the description, or we need to change the prop to accept flexible data.
      // But to keep it simple and compatible with Textareas, let's return the main text content.
      onInsert(generatedSEO.description || '');
    } else {
      onInsert(generatedText);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            {type === 'seo' 
              ? 'Generate SEO metadata based on your content.' 
              : 'Jelaskan apa yang ingin Anda tulis. AI akan menggunakan konteks Bahasa Indonesia dan format yang bersih (tanpa markdown bold).'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type !== 'seo' && (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label>Instruksi / Topik</Label>
                <Textarea 
                  placeholder={type === 'content' && initialContext ? "Tambahkan instruksi spesifik (contoh: Jelaskan tantangan teknisnya...)" : "Contoh: Buat biografi profesional..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24 resize-none"
                />
                {initialContext && (
                  <div className="bg-muted p-2 rounded-md text-xs text-muted-foreground max-h-20 overflow-y-auto">
                    <span className="font-semibold block mb-1">Konteks Otomatis:</span>
                    <pre className="whitespace-pre-wrap font-sans">{initialContext}</pre>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  * Sistem otomatis menyertakan tanggal hari ini dan konteks portofolio.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Nada (Tone)</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {type === 'seo' && (
             <div className="space-y-2">
                <Label>Focus Keyword (Optional)</Label>
                <Input 
                  placeholder="e.g. Portfolio, Web Development" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  AI will analyze the current page content to generate SEO tags.
                </p>
             </div>
          )}

          {(generatedText || generatedSEO) && (
            <div className="space-y-2 animate-in fade-in-0 zoom-in-95">
              <Label className="flex items-center justify-between">
                <span>Result</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                   navigator.clipboard.writeText(generatedText || generatedSEO?.description || '');
                }}>
                   <RefreshCw className="h-3 w-3" />
                </Button>
              </Label>
              <div className="p-4 rounded-md bg-muted/50 border text-sm max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                {type === 'seo' && generatedSEO ? (
                    <div className="space-y-2">
                        {generatedSEO.title && (
                            <div>
                                <span className="font-bold">Title:</span> {generatedSEO.title}
                            </div>
                        )}
                        {generatedSEO.description && (
                            <div>
                                <span className="font-bold">Description:</span> {generatedSEO.description}
                            </div>
                        )}
                         {generatedSEO.keywords && (
                            <div>
                                <span className="font-bold">Keywords:</span> {generatedSEO.keywords.join(', ')}
                            </div>
                        )}
                    </div>
                ) : (
                    generatedText
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {!generatedText && !generatedSEO ? (
            <Button onClick={handleGenerate} disabled={isGenerating || (!prompt && type !== 'seo')}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
               <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                  Try Again
               </Button>
               <Button onClick={handleInsert}>
                  <Check className="mr-2 h-4 w-4" />
                  Insert
               </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Also import Input for the SEO section
import { Input } from '@/components/ui/input';
