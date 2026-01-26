import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Image as ImageIcon,
  Type,
  FileText,
  Plus,
  X,
  GripVertical,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  Upload,
  Pencil,
} from 'lucide-react';
import { Reorder } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAdminStore } from '@/store/adminStore';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

const ContentEditor = () => {
  const { profile, aboutContent, updateProfile, updateAboutContent, fetchInitialData } = useAdminStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroRoles, setHeroRoles] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState('');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  
  // About Content States
  const [aboutImage, setAboutImage] = useState('');
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutShortDesc, setAboutShortDesc] = useState('');
  const [aboutLongDesc, setAboutLongDesc] = useState('');
  
  const [resumeUrl, setResumeUrl] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statsProjectCount, setStatsProjectCount] = useState('');
  const [statsExpYears, setStatsExpYears] = useState('');
  const [newRole, setNewRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Rich text formatting states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!profile || !aboutContent) {
        await fetchInitialData();
      }
      setLoading(false);
    };
    loadData();
  }, [fetchInitialData, profile, aboutContent]);

  useEffect(() => {
    if (profile) {
      setHeroTitle(profile.fullName || '');
      setHeroSubtitle(profile.greeting || '');
      try {
        const roles = typeof profile.role === 'string' ? JSON.parse(profile.role) : profile.role;
        setHeroRoles(Array.isArray(roles) ? roles : []);
      } catch {
        setHeroRoles([]);
      }
      setHeroImage(profile.heroImageFile || profile.heroImage || '');
      setResumeUrl(profile.resumeUrl || '');
      setLocation(profile.location || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setStatsProjectCount(profile.stats_project_count || '');
      setStatsExpYears(profile.stats_exp_years || '');
    }
    
    if (aboutContent) {
        setAboutShortDesc(aboutContent.short_description_id || '');
        setAboutLongDesc(aboutContent.long_description_id || '');
        setAboutImage(aboutContent.aboutImageFile || aboutContent.aboutImage || '');
    } else if (profile) {
        // Fallback to profile data if aboutContent is empty
        setAboutLongDesc(profile.bio || '');
        setAboutImage(profile.aboutImageFile || profile.aboutImage || '');
    }
  }, [profile, aboutContent]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAboutImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAboutImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 1. Save Profile Data
      const profileFormData = new FormData();
      profileFormData.append('fullName', heroTitle);
      profileFormData.append('greeting', heroSubtitle);
      profileFormData.append('role', JSON.stringify(heroRoles));
      // Bio removed from Profile, moved to AboutContent
       
       if (heroImageFile) {
         profileFormData.append('heroImageFile', heroImageFile);
       } else {
         profileFormData.append('heroImage', heroImage);
       }

       profileFormData.append('resumeUrl', resumeUrl);
      profileFormData.append('location', location);
      profileFormData.append('email', email);
      profileFormData.append('phone', phone);
      profileFormData.append('stats_project_count', statsProjectCount);
      profileFormData.append('stats_exp_years', statsExpYears);
      
      if (resumeFile) {
        profileFormData.append('resumeFile', resumeFile);
      }

      await updateProfile(profileFormData);

      // 2. Save AboutContent Data
      const aboutFormData = new FormData();
      aboutFormData.append('short_description_id', aboutShortDesc);
      aboutFormData.append('long_description_id', aboutLongDesc);
      
      if (aboutImageFile) {
        aboutFormData.append('aboutImageFile', aboutImageFile);
      } else {
        aboutFormData.append('aboutImage', aboutImage);
      }
      
      await updateAboutContent(aboutFormData);

      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const addRole = () => {
    if (newRole.trim()) {
      setHeroRoles([...heroRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const removeRole = (index: number) => {
    setHeroRoles(heroRoles.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Memuat data profil...</div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tentang Saya</h1>
            <p className="text-muted-foreground mt-1">Kelola profil dan konten portofolio Anda</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Ubah
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hero">Bagian Hero</TabsTrigger>
            <TabsTrigger value="about">Bagian Tentang</TabsTrigger>
            <TabsTrigger value="contact">Info Kontak</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Hero Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Konten Hero</CardTitle>
                  <CardDescription>Ubah konten bagian hero Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Nama Lengkap</Label>
                    <Input
                      id="heroTitle"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Salam Pembuka</Label>
                    <Input
                      id="heroSubtitle"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="Masukkan salam pembuka Anda"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Peran</Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          placeholder="Tambah peran"
                          onKeyPress={(e) => e.key === 'Enter' && addRole()}
                        />
                        <Button onClick={addRole} size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Reorder.Group values={heroRoles} onReorder={isEditing ? setHeroRoles : () => {}} className="space-y-2">
                      {heroRoles.map((role, index) => (
                        <Reorder.Item
                          key={index}
                          value={role}
                          className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                          onDragStart={() => isEditing && setIsDragging(true)}
                          onDragEnd={() => isEditing && setIsDragging(false)}
                          dragListener={isEditing}
                        >
                          {isEditing && <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />}
                          <span className="flex-1">{role}</span>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRole(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="statsProjectCount">Jumlah Proyek (Teks)</Label>
                      <Input
                        id="statsProjectCount"
                        value={statsProjectCount}
                        onChange={(e) => setStatsProjectCount(e.target.value)}
                        placeholder="e.g. 15+"
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground">Kosongkan untuk hitung otomatis</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statsExpYears">Tahun Pengalaman (Teks)</Label>
                      <Input
                        id="statsExpYears"
                        value={statsExpYears}
                        onChange={(e) => setStatsExpYears(e.target.value)}
                        placeholder="e.g. 5+"
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground">Kosongkan untuk hitung otomatis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hero Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Gambar Hero</CardTitle>
                  <CardDescription>Unggah gambar bagian hero Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroImage">URL Gambar</Label>
                    <Input
                      id="heroImage"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="Masukkan URL gambar"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <Label>Atau unggah gambar</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </div>
                  )}

                  {heroImage && (
                    <div className="mt-4">
                      <img
                        src={heroImage}
                        alt="Pratinjau Hero"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Konten Tentang (Tentang Saya)</CardTitle>
                  <CardDescription>Ubah konten bagian tentang Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label htmlFor="aboutShortDesc">Deskripsi Singkat (Subjudul)</Label>
                    <Input
                      id="aboutShortDesc"
                      value={aboutShortDesc}
                      onChange={(e) => setAboutShortDesc(e.target.value)}
                      placeholder="Contoh: Saya adalah pengembang web..."
                      disabled={!isEditing}
                      maxLength={150}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maksimal 150 karakter. Ditampilkan sebagai judul kecil di bagian Tentang.
                    </p>
                  </div>

                  {/* Long Description */}
                  <div className="space-y-2">
                    <Label htmlFor="aboutLongDesc">Biografi Lengkap</Label>
                    {isEditing ? (
                      <RichTextEditor 
                        content={aboutLongDesc} 
                        onChange={setAboutLongDesc} 
                      />
                    ) : (
                      <div className="p-4 border rounded-md bg-muted/50 min-h-[100px] prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aboutLongDesc }} />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Konten ini akan ditampilkan di bagian Tentang. Anda dapat menggunakan pemformatan teks kaya.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume & Statistik</CardTitle>
                  <CardDescription>Kelola resume dan statistik profil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resumeUrl">URL Resume</Label>
                    <Input
                      id="resumeUrl"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="Masukkan URL resume"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resumeFile">Atau Unggah Resume (PDF)</Label>
                    {isEditing && (
                      <div className="flex items-center gap-4">
                        <Input
                          id="resumeFile"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="cursor-pointer"
                        />
                        {resumeFile && (
                          <span className="text-sm text-green-600 flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {resumeFile.name}
                          </span>
                        )}
                      </div>
                    )}
                    {profile?.resumeFile && !resumeFile && (
                       <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                         <span>Berkas saat ini:</span>
                         <a 
                           href={profile.resumeFile} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="flex items-center gap-1 text-primary hover:underline"
                         >
                           <FileText className="w-4 h-4" />
                           Lihat Resume
                         </a>
                       </div>
                    )}
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="statsProjectCount">Jumlah Proyek (Teks)</Label>
                      <Input
                        id="statsProjectCount"
                        value={statsProjectCount}
                        onChange={(e) => setStatsProjectCount(e.target.value)}
                        placeholder="e.g. 15+"
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground">Kosongkan untuk hitung otomatis</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statsExpYears">Tahun Pengalaman (Teks)</Label>
                      <Input
                        id="statsExpYears"
                        value={statsExpYears}
                        onChange={(e) => setStatsExpYears(e.target.value)}
                        placeholder="e.g. 5+"
                        disabled={!isEditing}
                      />
                      <p className="text-xs text-muted-foreground">Kosongkan untuk hitung otomatis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gambar Tentang</CardTitle>
                  <CardDescription>Unggah gambar bagian tentang Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aboutImage">URL Gambar</Label>
                    <Input
                      id="aboutImage"
                      value={aboutImage}
                      onChange={(e) => setAboutImage(e.target.value)}
                      placeholder="Masukkan URL gambar"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <Label>Atau unggah gambar</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageUpload}
                        className="cursor-pointer"
                      />
                    </div>
                  )}

                  {aboutImage && (
                    <div className="mt-4">
                      <img
                        src={aboutImage}
                        alt="Pratinjau Tentang"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>Kelola detail kontak Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="misal: nama@email.com"
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="misal: +62 812 3456 7890"
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="misal: Jakarta, Indonesia"
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default ContentEditor;