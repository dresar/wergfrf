import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Globe,
  Share2,
  Palette,
  Shield,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Pencil,
  Key,
  Upload,
  FileJson,
  FileSpreadsheet,
  Sparkles,
  MoreVertical,
  Play
} from 'lucide-react';

import { useSettings } from '@/hooks/useSettings';
import { normalizeMediaUrl } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { aiKeysAPI, apiCall } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { AIAssistantModal } from '@/components/admin/AIAssistantModal';

const socialIcons = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
];

const accentColors = [
  { value: '#06b6d4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#8b5cf6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#10b981', label: 'Emerald', class: 'bg-emerald-500' },
  { value: '#f59e0b', label: 'Amber', class: 'bg-amber-500' },
  { value: '#ef4444', label: 'Red', class: 'bg-red-500' },
  { value: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
];

const Settings = () => {
  const { settings, updateSettings, createSettings, isUpdating: isUpdatingSettings } = useSettings();
  const { profile, updateProfile, isUpdating: isUpdatingProfile } = useProfile();
  const {
    socialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    isAdding: isAddingLink,
    isDeleting: isDeletingLink
  } = useSocialLinks();

  const [localProfile, setLocalProfile] = useState(profile || { fullName: '', greeting: '', role: '', bio: '', heroImage: '', resumeUrl: '' });
  const [localSettings, setLocalSettings] = useState(settings || { 
    id: 0, 
    theme: 'dark', 
    seoTitle: '', 
    seoDesc: '',
    cdn_url: '',
    primaryColor: '#0ea5e9',
    secondaryColor: '#64748b',
    accentColor: '#f43f5e',
    maintenanceMode: false,
    ai_provider: 'gemini'
  });
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // API Key Upload State
  const [isUploadingKeys, setIsUploadingKeys] = useState(false);
  const [keyFile, setKeyFile] = useState<File | null>(null);

  // Manual Key Add State
  const [newKey, setNewKey] = useState({ provider: 'gemini', key: '' });
  const [isAddingKey, setIsAddingKey] = useState(false);

  // API Health Check State
  const [apiStatus, setApiStatus] = useState<Record<string, { status: 'loading' | 'ok' | 'error'; code?: number; message?: string }>>({});
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const checkApiHealth = async () => {
    setIsCheckingApi(true);
    const endpoints = [
      'profile',
      'settings',
      'social-links',
      'skills',
      'experience',
      'education',
      'projects',
      'certificates',
      'messages'
    ];

    const newStatus: typeof apiStatus = {};
    
    // Initialize loading state
    endpoints.forEach(ep => {
      newStatus[ep] = { status: 'loading' };
    });
    setApiStatus(newStatus);

    // Check each endpoint
    for (const endpoint of endpoints) {
      try {
        await apiCall(`/${endpoint}/`);
        setApiStatus(prev => ({
          ...prev,
          [endpoint]: { status: 'ok', code: 200 }
        }));
      } catch (error: any) {
        setApiStatus(prev => ({
          ...prev,
          [endpoint]: { 
            status: 'error', 
            code: error.status || 500, 
            message: error.message 
          }
        }));
      }
    }
    setIsCheckingApi(false);
    toast.success('Pemeriksaan API selesai');
  };

  // AI Keys State
  const [aiKeys, setAiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [testingKeyId, setTestingKeyId] = useState<number | null>(null);

  const fetchAiKeys = async () => {
    try {
      setLoadingKeys(true);
      const data = await aiKeysAPI.getAll();
      setAiKeys(data);
    } catch (error) {
      console.error('Failed to fetch AI keys', error);
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchAiKeys();
  }, []);

  const [testResults, setTestResults] = useState<Record<number, { success: boolean; message: string }>>({});

  const handleTestKey = async (id: number) => {
    try {
      setTestingKeyId(id);
      const data = await aiKeysAPI.test(id);
      setTestResults(prev => ({
        ...prev,
        [id]: { success: data.success, message: data.message }
      }));
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || 'Test failed';
      setTestResults(prev => ({
        ...prev,
        [id]: { success: false, message: msg }
      }));
      // Only toast if it's a critical error, otherwise the badge shows the status
      if (!msg.includes("Quota") && !msg.includes("Limit")) {
         toast.error(msg);
      }
    } finally {
      setTestingKeyId(null);
    }
  };

  const handleDeleteKey = async (id: number) => {
    if (!confirm('Are you sure you want to delete this key?')) return;
    try {
      await aiKeysAPI.delete(id);
      toast.success('Key deleted');
      fetchAiKeys();
    } catch (error) {
      toast.error('Failed to delete key');
    }
  };

  // Sync with store data
  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (settings) {
      // Handle if settings is an array
      const settingsData = Array.isArray(settings) ? settings[0] : settings;
      if (settingsData) {
        setLocalSettings(settingsData);
      }
    }
  }, [settings]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalProfile(prev => prev ? { ...prev, heroImage: e.target?.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!localProfile) {
      toast.error('Tidak ada data profil untuk disimpan');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', localProfile.fullName || '');
    formData.append('role', localProfile.role || '');
    formData.append('greeting', localProfile.greeting || '');
    formData.append('bio', localProfile.bio || '');
    formData.append('resumeUrl', localProfile.resumeUrl || '');
    
    if (avatarFile) {
      formData.append('heroImageFile', avatarFile);
    } else {
      formData.append('heroImage', localProfile.heroImage || '');
    }

    // @ts-ignore - Assuming profile has id
    updateProfile({ id: localProfile.id || 1, data: formData }, {
      onSuccess: () => {
        setIsEditing(false);
        setAvatarFile(null);
      }
    });
  };

  const handleSaveSettings = () => {
    if (localSettings.id && localSettings.id !== 0) {
      // @ts-ignore - Assuming settings has id
      updateSettings({ id: localSettings.id, data: localSettings });
    } else {
      createSettings(localSettings);
    }
  };

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      toast.error('Harap isi semua kolom');
      return;
    }
    addSocialLink({
      platform: newSocialLink.platform,
      url: newSocialLink.url,
      icon: newSocialLink.icon || newSocialLink.platform.toLowerCase(),
    });
    setNewSocialLink({ platform: '', url: '', icon: '' });
  };

  const handleUploadKeys = async () => {
    if (!keyFile) {
      toast.error('Silakan pilih file CSV atau JSON');
      return;
    }

    const formData = new FormData();
    formData.append('file', keyFile);

    try {
      setIsUploadingKeys(true);
      const data = await aiKeysAPI.upload(formData);

      toast.success(data.message || 'Kunci API berhasil diimpor');
      setKeyFile(null);
      // Reset file input
      const fileInput = document.getElementById('key-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchAiKeys(); // Refresh list
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengunggah file');
    } finally {
      setIsUploadingKeys(false);
    }
  };

  const handleAddKey = async () => {
    if (!newKey.key) {
      toast.error('Kunci API harus diisi');
      return;
    }
    
    try {
      setIsAddingKey(true);
      await aiKeysAPI.add(newKey);
      toast.success('Kunci API berhasil ditambahkan');
      setNewKey({ ...newKey, key: '' });
      fetchAiKeys();
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || 'Gagal menambahkan kunci');
    } finally {
      setIsAddingKey(false);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground mt-1">Kelola konfigurasi portofolio Anda</p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0 w-full">
            <TabsTrigger 
              value="profile" 
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="seo"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger 
              value="social"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Sosial
            </TabsTrigger>
            <TabsTrigger 
              value="theme"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Palette className="h-4 w-4 mr-2" />
              Tema
            </TabsTrigger>
            <TabsTrigger 
              value="system"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Shield className="h-4 w-4 mr-2" />
              Sistem
            </TabsTrigger>
            <TabsTrigger 
              value="api"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Activity className="h-4 w-4 mr-2" />
              Status API
            </TabsTrigger>
            <TabsTrigger 
              value="keys"
              className="flex-1 min-w-[120px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-border/50"
            >
              <Key className="h-4 w-4 mr-2" />
              AI Keys
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pengaturan Profil</CardTitle>
                    <CardDescription>Perbarui informasi profil admin Anda</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Ubah
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setIsEditing(false);
                      if (profile) setLocalProfile(profile);
                      setAvatarFile(null);
                    }} variant="ghost" size="sm">
                      Batal
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <img
                      src={normalizeMediaUrl(localProfile?.heroImageFile || localProfile?.heroImage) || '/placeholder-avatar.jpg'}
                      alt={localProfile?.fullName || 'Profile'}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                    />
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="avatar">URL Avatar</Label>
                      <Input
                        id="avatar"
                        value={localProfile?.heroImage || ''}
                        onChange={(e) => setLocalProfile(prev => prev ? { ...prev, heroImage: e.target.value } : null)}
                        placeholder="Masukkan URL avatar"
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <div className="mt-2">
                          <Label htmlFor="avatarFile" className="text-xs text-muted-foreground">Atau unggah gambar</Label>
                          <Input
                            id="avatarFile"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="cursor-pointer mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={localProfile?.fullName || ''}
                        onChange={(e) => setLocalProfile(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                        disabled={!isEditing}
                      />
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Peran</Label>
                    <Input
                      id="role"
                      value={localProfile?.role || ''}
                      onChange={(e) => setLocalProfile(prev => prev ? { ...prev, role: e.target.value } : null)}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} className="btn-neon" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Simpan Profil
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Pengaturan SEO</CardTitle>
                  <CardDescription>Konfigurasi optimasi mesin pencari</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nama Situs</Label>
                    <Input
                      id="siteName"
                      value={localSettings.siteName}
                      onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="siteDescription">Deskripsi Meta</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAiModalOpen(true)} 
                        className="h-6 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                      id="siteDescription"
                      value={localSettings.siteDescription}
                      onChange={(e) => setLocalSettings({ ...localSettings, siteDescription: e.target.value })}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {localSettings?.siteDescription?.length || 0}/160 karakter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cdnUrl">URL CDN (Base Media URL)</Label>
                    <Input
                      id="cdnUrl"
                      value={localSettings.cdn_url || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, cdn_url: e.target.value })}
                      placeholder="https://cdn.example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Biarkan kosong jika tidak menggunakan CDN.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Kata Kunci (pisahkan dengan koma)</Label>
                    <Input
                      id="metaKeywords"
                      value={localSettings?.metaKeywords?.join(', ') || ''}
                      onChange={(e) => setLocalSettings(prev => prev ? {
                        ...prev,
                        metaKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      } : null)}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {localSettings?.metaKeywords?.map((keyword) => (
                        <Badge key={keyword} variant="secondary">{keyword}</Badge>
                      )) || null}
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="btn-neon" disabled={isUpdatingSettings}>
                    {isUpdatingSettings ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Simpan Pengaturan SEO
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Tautan Sosial Media</CardTitle>
                  <CardDescription>Kelola profil sosial media Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Existing Links */}
                  <div className="space-y-3">
                    {socialLinks?.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{link.platform}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {link.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteSocialLink(link.id)}
                          disabled={isDeletingLink}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Link */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Tambah Tautan Baru</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select
                          value={newSocialLink.platform}
                          onValueChange={(v) => setNewSocialLink({ ...newSocialLink, platform: v, icon: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {socialIcons.map((icon) => (
                              <SelectItem key={icon.value} value={icon.label}>
                                {icon.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>URL</Label>
                        <Input
                          value={newSocialLink.url}
                          onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddSocialLink} className="mt-4" disabled={isAddingLink}>
                      {isAddingLink ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                      Tambah Tautan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Konfigurasi Tema</CardTitle>
                  <CardDescription>Sesuaikan tampilan portofolio Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Tema Default</Label>
                    <div className="flex gap-4">
                      {(['dark', 'light'] as const).map((theme) => (
                        <Button
                          key={theme}
                          variant={localSettings.theme === theme ? 'default' : 'outline'}
                          onClick={() => setLocalSettings({ ...localSettings, theme })}
                          className="capitalize"
                        >
                          {theme}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Warna Utama (Primary)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={localSettings.primaryColor || '#0ea5e9'}
                          onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={localSettings.primaryColor || '#0ea5e9'}
                          onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Warna Sekunder (Secondary)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={localSettings.secondaryColor || '#64748b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={localSettings.secondaryColor || '#64748b'}
                          onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Warna Aksen (Accent)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={localSettings.accentColor || '#f43f5e'}
                          onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={localSettings.accentColor || '#f43f5e'}
                          onChange={(e) => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="btn-neon" disabled={isUpdatingSettings}>
                    {isUpdatingSettings ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Simpan Pengaturan Tema
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Pengaturan Sistem</CardTitle>
                  <CardDescription>Kelola konfigurasi tingkat sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Mode Pemeliharaan</p>
                      <p className="text-sm text-muted-foreground">
                        Kunci frontend publik untuk pemeliharaan
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.maintenanceMode}
                      onCheckedChange={(checked) => {
                        const newSettings = { ...localSettings, maintenanceMode: checked };
                        setLocalSettings(newSettings);
                        // @ts-ignore
                        updateSettings({ id: localSettings.id || 1, data: { maintenanceMode: checked } });
                      }}
                    />
                  </div>

                  {localSettings.maintenanceMode && (
                    <div className="space-y-4 p-4 bg-warning/10 border border-warning/30 rounded-lg animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-warning">
                            ⚠️ Mode pemeliharaan aktif
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Website hanya dapat diakses oleh admin yang sedang login. 
                            Pengunjung publik akan melihat halaman pemeliharaan.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <Label htmlFor="maintenanceEnd">Waktu Berakhir Otomatis (Opsional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="maintenanceEnd"
                            type="datetime-local"
                            value={localSettings.maintenance_end_time ? new Date(localSettings.maintenance_end_time).toISOString().slice(0, 16) : ''}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              setLocalSettings({ 
                                ...localSettings, 
                                maintenance_end_time: date ? date.toISOString() : null 
                              });
                            }}
                            className="max-w-xs"
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setLocalSettings({ ...localSettings, maintenance_end_time: null });
                              // @ts-ignore
                              updateSettings({ id: localSettings.id || 1, data: { maintenance_end_time: null } });
                            }}
                            disabled={!localSettings.maintenance_end_time}
                          >
                            Reset Waktu
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Jika diatur, mode pemeliharaan akan otomatis mati setelah waktu ini terlewati.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleSaveSettings} className="btn-neon" disabled={isUpdatingSettings}>
                     {isUpdatingSettings ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Simpan Pengaturan Sistem
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* API Status Tab */}
          <TabsContent value="api">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Status Sistem API</span>
                    <Button 
                      onClick={checkApiHealth} 
                      disabled={isCheckingApi}
                      variant="outline"
                      size="sm"
                    >
                      {isCheckingApi ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Cek Semua API
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Verifikasi kesehatan dan konektivitas semua endpoint API backend.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(apiStatus).length === 0 && !isCheckingApi ? (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        Klik "Cek Semua API" untuk memulai diagnostik
                      </div>
                    ) : (
                      Object.entries(apiStatus).map(([endpoint, status]) => (
                        <div 
                          key={endpoint} 
                          className={`p-4 rounded-lg border flex items-center justify-between ${
                            status.status === 'ok' 
                              ? 'bg-green-500/10 border-green-500/20' 
                              : status.status === 'error'
                              ? 'bg-red-500/10 border-red-500/20'
                              : 'bg-muted/50 border-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {status.status === 'loading' ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : status.status === 'ok' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium capitalize">{endpoint.replace('-', ' ')}</p>
                              <p className="text-xs text-muted-foreground">
                                {status.status === 'loading' ? 'Memeriksa...' : 
                                 status.status === 'ok' ? `Status: ${status.code}` : 
                                 `Error: ${status.code || 'Jaringan'}`}
                              </p>
                            </div>
                          </div>
                          <Badge variant={status.status === 'ok' ? 'default' : status.status === 'error' ? 'destructive' : 'secondary'}>
                            {status.status === 'ok' ? 'Sehat' : status.status === 'error' ? 'Gagal' : 'Memeriksa'}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* AI Keys Tab */}
          <TabsContent value="keys">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Manajemen Kunci AI</CardTitle>
                  <CardDescription>Unggah dan kelola kunci API untuk layanan AI (Gemini, Groq).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* AI Provider Selection */}
                  <div className="rounded-lg border bg-card p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Provider AI Aktif</h3>
                        <p className="text-sm text-muted-foreground">Pilih layanan AI yang akan digunakan oleh sistem.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-4">
                      <div className="w-full md:w-1/3 space-y-2">
                        <Label>Provider Utama</Label>
                        <Select
                          value={localSettings.ai_provider || 'gemini'}
                          onValueChange={(v) => {
                            setLocalSettings({ ...localSettings, ai_provider: v });
                            // @ts-ignore
                            updateSettings({ id: localSettings.id || 1, data: { ai_provider: v } });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini">Google Gemini (Recommended)</SelectItem>
                            <SelectItem value="groq">Groq (Llama 3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pb-2 text-sm text-muted-foreground">
                        <p>
                          {localSettings.ai_provider === 'gemini' 
                            ? "Menggunakan model Gemini 2.5 Flash untuk analisis dan konten." 
                            : "Menggunakan model Llama 3.1 8b Instant untuk respon cepat."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Add Section */}
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Tambah Kunci Manual</h3>
                        <p className="text-sm text-muted-foreground">Tambahkan satu kunci API untuk provider tertentu.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="w-full md:w-1/3 space-y-2">
                        <Label>Provider</Label>
                        <Select 
                          value={newKey.provider} 
                          onValueChange={(v) => setNewKey({...newKey, provider: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini">Google Gemini</SelectItem>
                            <SelectItem value="groq">Groq</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full md:flex-1 space-y-2">
                        <Label>API Key</Label>
                        <Input 
                          type="password" 
                          value={newKey.key}
                          onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                          placeholder="Masukkan API Key..." 
                        />
                      </div>
                      <Button onClick={handleAddKey} disabled={isAddingKey}>
                        {isAddingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Tambah
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Impor Kunci API</h3>
                          <p className="text-sm text-muted-foreground">Unggah file CSV atau JSON berisi daftar kunci API Anda.</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 py-4">
                        {/* Key List */}
                        {loadingKeys ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : aiKeys.length > 0 ? (
                          <div className="space-y-6 mb-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-muted-foreground">Kunci Terdaftar ({aiKeys.length})</h4>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={fetchAiKeys} 
                                  disabled={loadingKeys}
                                  className="h-8"
                                >
                                  <RefreshCw className={`h-3 w-3 mr-2 ${loadingKeys ? 'animate-spin' : ''}`} />
                                  Refresh
                                </Button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Gemini Column */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                  <Sparkles className="h-4 w-4 text-blue-500" />
                                  <h5 className="font-medium text-sm">Gemini Keys</h5>
                                </div>
                                {aiKeys.filter(k => k.provider === 'gemini').map((key, index) => (
                                  <div key={key.id} className="p-3 border rounded-md bg-card hover:bg-muted/20 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] font-mono">
                                          Gemini {index + 1}
                                        </Badge>
                                        {testResults[key.id] !== undefined && (
                                          <Badge 
                                            variant={testResults[key.id].success ? "default" : "destructive"}
                                            className={`text-[10px] h-5 px-1.5 ${testResults[key.id].success ? "bg-green-500 hover:bg-green-600" : ""}`}
                                            title={testResults[key.id].message}
                                          >
                                            {testResults[key.id].success ? "Active" : testResults[key.id].message.includes("Quota") ? "Limit" : "Error"}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                          onClick={() => handleTestKey(key.id)}
                                          disabled={testingKeyId === key.id}
                                          title="Test Connection"
                                        >
                                          {testingKeyId === key.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Play className="h-3.5 w-3.5" />
                                          )}
                                        </Button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                              <MoreVertical className="h-3.5 w-3.5" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                              className="text-destructive focus:text-destructive"
                                              onClick={() => handleDeleteKey(key.id)}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Hapus
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                                        {key.masked_key.substring(0, 4)}...
                                      </span>
                                      <span>
                                        {new Date(key.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {aiKeys.filter(k => k.provider === 'gemini').length === 0 && (
                                  <p className="text-xs text-muted-foreground italic py-2">Belum ada kunci Gemini.</p>
                                )}
                              </div>

                              {/* Groq Column */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                  <Activity className="h-4 w-4 text-orange-500" />
                                  <h5 className="font-medium text-sm">Groq Keys</h5>
                                </div>
                                {aiKeys.filter(k => k.provider === 'groq').map((key, index) => (
                                  <div key={key.id} className="p-3 border rounded-md bg-card hover:bg-muted/20 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] font-mono">
                                          Groq {index + 1}
                                        </Badge>
                                        {testResults[key.id] !== undefined && (
                                          <Badge 
                                            variant={testResults[key.id].success ? "default" : "destructive"}
                                            className={`text-[10px] h-5 px-1.5 ${testResults[key.id].success ? "bg-green-500 hover:bg-green-600" : ""}`}
                                            title={testResults[key.id].message}
                                          >
                                            {testResults[key.id].success ? "Active" : testResults[key.id].message.includes("Rate Limit") ? "Limit" : "Error"}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                          onClick={() => handleTestKey(key.id)}
                                          disabled={testingKeyId === key.id}
                                          title="Test Connection"
                                        >
                                          {testingKeyId === key.id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <Play className="h-3.5 w-3.5" />
                                          )}
                                        </Button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                              <MoreVertical className="h-3.5 w-3.5" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                              className="text-destructive focus:text-destructive"
                                              onClick={() => handleDeleteKey(key.id)}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Hapus
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                                        {key.masked_key.substring(0, 4)}...
                                      </span>
                                      <span>
                                        {new Date(key.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {aiKeys.filter(k => k.provider === 'groq').length === 0 && (
                                  <p className="text-xs text-muted-foreground italic py-2">Belum ada kunci Groq.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 p-3 border rounded-md">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                            <div className="text-sm">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Format CSV</p>
                                <a 
                                  href="#" 
                                  className="text-xs text-primary hover:underline flex items-center"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const csvContent = "gemini,groq\nAIzaSy...,gsk_...";
                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement("a");
                                    if (link.download !== undefined) {
                                      const url = URL.createObjectURL(blob);
                                      link.setAttribute("href", url);
                                      link.setAttribute("download", "ai_keys_template.csv");
                                      link.style.visibility = 'hidden';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                                >
                                  Unduh Template
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                              <code className="text-xs text-muted-foreground bg-muted px-1 rounded">gemini,groq</code>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md">
                            <FileJson className="h-5 w-5 text-yellow-600" />
                            <div className="text-sm">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Format JSON</p>
                              </div>
                              <code className="text-xs text-muted-foreground bg-muted px-1 rounded">{'[{"gemini": "...", "groq": "..."}]'}</code>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="key-file-input">Pilih Berkas</Label>
                          <Input
                            id="key-file-input"
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setKeyFile(e.target.files?.[0] || null)}
                          />
                        </div>

                        <Button 
                          onClick={handleUploadKeys} 
                          disabled={!keyFile || isUploadingKeys}
                          className="w-full sm:w-auto"
                        >
                          {isUploadingKeys ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengunggah...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Unggah Kunci
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <AIAssistantModal 
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onInsert={(text) => setLocalSettings(prev => ({ ...prev, siteDescription: text }))}
          type="seo"
          initialContext={localSettings.siteName + ' ' + localSettings.siteDescription}
        />
    </div>
  );
};
  
  export default Settings;
