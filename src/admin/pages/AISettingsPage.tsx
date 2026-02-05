import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { api } from '../services/api';
import { Loader2, Save, Bot, RefreshCw, CheckCircle, Play, MessageSquare, Eye, EyeOff } from 'lucide-react';

const aiSettingsSchema = z.object({
  ai_provider: z.string().default('apprentice'),
  ai_model: z.string().min(1, "Model AI harus dipilih"),
  ai_base_url: z.string().url("URL Base API harus valid").min(1, "Base URL diperlukan"),
  ai_api_key: z.string().min(1, "API Key diperlukan"),
});

type AISettingsFormValues = z.infer<typeof aiSettingsSchema>;

export default function AISettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Test Chat State
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // API Key Visibility State
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const form = useForm<AISettingsFormValues>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      ai_provider: 'apprentice',
      ai_model: 'gemini-2.5-flash',
      ai_base_url: 'https://one.apprentice.cyou/api/v1',
      ai_api_key: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await api.content.settings.get();
      if (data) {
        form.reset({
          ai_provider: data.ai_provider || 'apprentice',
          ai_model: data.ai_model || 'gemini-2.5-flash',
          ai_base_url: data.ai_base_url || 'https://one.apprentice.cyou/api/v1',
          ai_api_key: data.ai_api_key || '',
        });
        
        // If we have API Key loaded, try fetching models
        if (data.ai_provider === 'apprentice' && data.ai_api_key) {
            fetchModels(data.ai_api_key, data.ai_base_url);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async (apiKey?: string, endpoint?: string) => {
    const key = apiKey || form.getValues('ai_api_key');
    const url = endpoint || form.getValues('ai_base_url');

    if (!key) {
        toast({ variant: "destructive", title: "API Key Kosong", description: "Harap masukkan API Key terlebih dahulu." });
        return;
    }

    setIsFetchingModels(true);
    try {
      const response = await api.ai.fetchModels({
          apiKey: key,
          endpoint: url
      });
      
      if (response && response.data) {
          const models = response.data.map((m: any) => m.id);
          setAvailableModels(models);
          toast({ title: "Koneksi Berhasil", description: `${models.length} model berhasil dimuat.` });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal memuat model", description: "Periksa koneksi, Base URL, atau API Key." });
    } finally {
      setIsFetchingModels(false);
    }
  };

  const onSubmit = async (data: AISettingsFormValues) => {
    setIsLoading(true);
    try {
      const existing = await api.content.settings.get();
      
      const payload = {
        ...existing,
        ai_provider: data.ai_provider,
        ai_model: data.ai_model,
        ai_base_url: data.ai_base_url,
        ai_api_key: data.ai_api_key,
      };
      
      await api.content.settings.update(payload);
      
      toast({
        title: "Pengaturan disimpan",
        description: "Konfigurasi AI berhasil diperbarui.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Tidak dapat memperbarui pengaturan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestChat = async () => {
      if (!testPrompt.trim()) return;
      
      setIsTesting(true);
      setTestResponse('');
      
      try {
          if (form.formState.isDirty) {
              await onSubmit(form.getValues());
          }

          const response = await api.ai.generate({
              prompt: testPrompt,
              provider: form.getValues('ai_provider'), // Use dynamic provider
              task: 'chat'
          });
          
          setTestResponse(response.content || 'No response');
      } catch (error) {
          setTestResponse('Error: Gagal menghubungi AI. Pastikan konfigurasi benar.');
      } finally {
          setIsTesting(false);
      }
  };

  // Helper to mask API Key
  const getMaskedApiKey = (key: string) => {
    if (!key) return '';
    if (key.length < 10) return '***';
    return `${key.slice(0, 3)}***${key.slice(-3)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pengaturan AI</h2>
          <p className="text-muted-foreground">Konfigurasi Model dan Provider AI Global.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Configuration Section */}
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5"/> Konfigurasi Provider</CardTitle>
            <CardDescription>Atur koneksi ke API Provider AI (Default: Apprentice / One Key Hub).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Provider Selection */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Pilih Provider AI</Label>
                        <Select 
                            onValueChange={(val) => form.setValue('ai_provider', val)}
                            defaultValue={form.watch('ai_provider')}
                            value={form.watch('ai_provider')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Penyedia AI" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="apprentice">Apprentice (GPT-4o/Gemini)</SelectItem>
                                <SelectItem value="gemini">Google Gemini</SelectItem>
                                <SelectItem value="groq">Groq (Llama 3)</SelectItem>
                                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Provider ini akan digunakan secara global di seluruh sistem.
                        </p>
                    </div>

                    {/* Connection Config */}
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                        <h3 className="font-medium flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2"/> Koneksi API</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="ai_base_url">Base URL API</Label>
                            <Input id="ai_base_url" {...form.register('ai_base_url')} placeholder="https://api.example.com/v1" />
                            {form.formState.errors.ai_base_url && <p className="text-xs text-destructive">{form.formState.errors.ai_base_url.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ai_api_key">API Key</Label>
                            <div className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <Input 
                                        id="ai_api_key" 
                                        type={isApiKeyVisible ? "text" : "text"} 
                                        value={isApiKeyVisible ? form.watch('ai_api_key') : getMaskedApiKey(form.watch('ai_api_key'))}
                                        onChange={(e) => {
                                            // Only allow editing if visible, OR if it was empty/masked and user is typing
                                            // But standard behavior for masked fields is you must clear/reset to edit
                                            // However, to be user friendly:
                                            if (isApiKeyVisible) {
                                                form.setValue('ai_api_key', e.target.value, { shouldDirty: true });
                                            } else {
                                                // If trying to edit while masked, we can either block it or auto-show
                                                // Let's auto-show and set value
                                                // But if value is masked 'sk-***123', we don't want to set that as value
                                                // So we should only allow editing when visible.
                                                // Unless the field is empty.
                                                if (!form.getValues('ai_api_key')) {
                                                    form.setValue('ai_api_key', e.target.value, { shouldDirty: true });
                                                }
                                            }
                                        }}
                                        readOnly={!isApiKeyVisible && !!form.watch('ai_api_key')}
                                        placeholder="sk-..." 
                                        className={!isApiKeyVisible && !!form.watch('ai_api_key') ? "text-muted-foreground bg-muted" : ""}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                                    title={isApiKeyVisible ? "Sembunyikan API Key" : "Lihat API Key Penuh"}
                                >
                                    {isApiKeyVisible ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isApiKeyVisible ? "Mode Edit: Masukkan API Key baru Anda." : "Mode Aman: API Key disembunyikan. Klik ikon mata untuk melihat/mengedit."}
                            </p>
                            {form.formState.errors.ai_api_key && <p className="text-xs text-destructive">{form.formState.errors.ai_api_key.message}</p>}
                        </div>

                        <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            className="w-full"
                            onClick={() => fetchModels()}
                            disabled={isFetchingModels}
                        >
                            {isFetchingModels ? <Loader2 className="w-3 h-3 animate-spin mr-2"/> : <RefreshCw className="w-3 h-3 mr-2"/>}
                            Test Koneksi & Load Model
                        </Button>
                    </div>

                    {/* Model Selection - Always show if we have models, or allow manual entry if fetch fails? Better stick to fetch */}
                    {availableModels.length > 0 && (
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h3 className="font-medium flex items-center text-sm"><Bot className="w-4 h-4 mr-2"/> Pilih Model</h3>
                            
                            <Select 
                                onValueChange={(val) => form.setValue('ai_model', val)}
                                value={form.watch('ai_model')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableModels.map((model) => (
                                        <SelectItem key={model} value={model}>{model}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Model terpilih: <span className="font-mono text-primary">{form.watch('ai_model')}</span>
                            </p>

                            <div className="pt-2">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Simpan Konfigurasi
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>

        {/* Test Interface */}
        {availableModels.length > 0 && (
            <Card className="flex flex-col animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Test Chat</CardTitle>
                    <CardDescription>Uji coba konfigurasi AI Anda secara langsung.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                    <div className="flex-1 min-h-[200px] bg-muted/30 rounded-lg p-4 border overflow-y-auto">
                        {testResponse ? (
                            <div className="prose dark:prose-invert text-sm">
                                <p>{testResponse}</p>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                                Hasil respons AI akan muncul di sini...
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Prompt Test</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={testPrompt} 
                                onChange={(e) => setTestPrompt(e.target.value)} 
                                placeholder="Ketik pesan untuk tes..." 
                                onKeyDown={(e) => e.key === 'Enter' && handleTestChat()}
                            />
                            <Button onClick={handleTestChat} disabled={isTesting || !testPrompt}>
                                {isTesting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4"/>}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            *Konfigurasi akan otomatis disimpan sebelum tes dijalankan.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
