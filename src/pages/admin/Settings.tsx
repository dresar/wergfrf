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
} from 'lucide-react';

import { useSettings } from '@/hooks/useSettings';
import { normalizeMediaUrl } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { api } from '@/lib/api';
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
import { toast } from 'sonner';

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
  const { settings, updateSettings, isUpdating: isUpdatingSettings } = useSettings();
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
    primaryColor: '#0ea5e9',
    secondaryColor: '#64748b',
    accentColor: '#f43f5e'
  });
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // API Health Check State
  const [apiStatus, setApiStatus] = useState<Record<string, { status: 'loading' | 'ok' | 'error'; code?: number; message?: string }>>({});
  const [isCheckingApi, setIsCheckingApi] = useState(false);

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
        const response = await api.get(`/${endpoint}/`);
        setApiStatus(prev => ({
          ...prev,
          [endpoint]: { status: 'ok', code: response.status }
        }));
      } catch (error: any) {
        setApiStatus(prev => ({
          ...prev,
          [endpoint]: { 
            status: 'error', 
            code: error.response?.status, 
            message: error.message 
          }
        }));
      }
    }
    setIsCheckingApi(false);
    toast.success('Pemeriksaan API selesai');
  };

  // Sync with store data
  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
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
    // @ts-ignore - Assuming settings has id
    updateSettings({ id: localSettings.id || 1, data: localSettings });
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="h-4 w-4 mr-2" />
              Sosial
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="h-4 w-4 mr-2" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="system">
              <Shield className="h-4 w-4 mr-2" />
              Sistem
            </TabsTrigger>
            <TabsTrigger value="api">
              <Activity className="h-4 w-4 mr-2" />
              Status API
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
                    <Label htmlFor="siteDescription">Deskripsi Meta</Label>
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
                        setLocalSettings({ ...localSettings, maintenanceMode: checked });
                        // @ts-ignore
                        updateSettings({ id: localSettings.id || 1, data: { maintenanceMode: checked } });
                      }}
                    />
                  </div>

                  {localSettings.maintenanceMode && (
                    <div className="p-4 bg-warning/20 border border-warning/30 rounded-lg">
                      <p className="text-sm text-warning">
                        ⚠️ Mode pemeliharaan aktif. Portofolio Anda saat ini terkunci.
                      </p>
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
        </Tabs>
      </div>
  );
};

export default Settings;
