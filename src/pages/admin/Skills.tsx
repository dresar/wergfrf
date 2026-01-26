import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Code2, Brain, Wrench, Loader2, Layers } from 'lucide-react';

import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { type Skill, useAdminStore } from '@/store/adminStore';
import { useSkills } from '@/hooks/useSkills';
import { SkillCategoryManager } from '@/components/admin/SkillCategoryManager';

const COLORS = [
  { bg: 'bg-blue-500/20', text: 'text-blue-500', bar: 'bg-blue-500' },
  { bg: 'bg-green-500/20', text: 'text-green-500', bar: 'bg-green-500' },
  { bg: 'bg-purple-500/20', text: 'text-purple-500', bar: 'bg-purple-500' },
  { bg: 'bg-orange-500/20', text: 'text-orange-500', bar: 'bg-orange-500' },
  { bg: 'bg-pink-500/20', text: 'text-pink-500', bar: 'bg-pink-500' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-500', bar: 'bg-cyan-500' },
  { bg: 'bg-yellow-500/20', text: 'text-yellow-500', bar: 'bg-yellow-500' }
];

const Skills = () => {
  const { skillCategories } = useAdminStore();
  const { 
    skills = [], 
    isLoading: loading, 
    addSkill, 
    updateSkill, 
    deleteSkill,
    isAdding,
    isUpdating
  } = useSkills();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Group skills by category ID
  const groupedSkills = skills.reduce((acc, skill) => {
    const categoryId = skill.category; // Now a number
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(skill);
    return acc;
  }, {} as Record<number, Skill[]>);

  // Identify uncategorized skills (if any, though model enforces valid ID usually, but maybe deleted categories)
  const uncategorizedSkills = skills.filter(s => !s.category || !skillCategories.find(c => c.id === s.category));

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSkill?.name) return toast.error('Harap masukkan nama keahlian');
    if (!editingSkill?.category) return toast.error('Harap pilih kategori');
    
    if (editingSkill.id) {
      updateSkill({ 
        id: editingSkill.id, 
        data: {
          name: editingSkill.name,
          category: Number(editingSkill.category),
          percentage: editingSkill.percentage || 50
        } 
      }, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingSkill(null);
        }
      });
    } else {
      addSkill({
        name: editingSkill.name,
        category: Number(editingSkill.category),
        percentage: editingSkill.percentage || 50
      } as Omit<Skill, 'id'>, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingSkill(null);
        }
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    
    deleteSkill(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Memuat keahlian...</div>
      </div>
    );
  }

  const getSkillColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  return (
    <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Keahlian</h1>
            <p className="text-muted-foreground mt-1">Kelola keahlian dan kepakaran Anda</p>
          </div>
          <div className="flex gap-2">
            <SkillCategoryManager />
            <Button onClick={() => { setEditingSkill({ percentage: 50 }); setEditDialogOpen(true); }} className="btn-neon">
              <Plus className="h-4 w-4 mr-2" />Tambah Keahlian
            </Button>
          </div>
        </motion.div>

        {skills.length === 0 ? (
          <EmptyState icon="file" title="Tidak ada keahlian" description="Tambahkan keahlian pertama Anda" action={{ label: 'Tambah Keahlian', onClick: () => { setEditingSkill({ percentage: 50 }); setEditDialogOpen(true); } }} />
        ) : (
          <div className="space-y-8">
            {skillCategories.map((category, index) => {
              const items = groupedSkills[category.id] || [];
              if (items.length === 0) return null; // Skip empty categories
              
              const colorClass = COLORS[index % COLORS.length];

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-2 rounded-lg', colorClass.bg, colorClass.text)}>
                      <Layers className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold capitalize text-lg">{category.name}</h3>
                    <Badge variant="secondary" className="ml-2">{items.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((skill, sIndex) => {
                      const skillColor = getSkillColor(skill.name);
                      
                      return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: sIndex * 0.05 }}
                        className="glass rounded-xl p-4 card-hover group relative overflow-hidden"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between relative z-10">
                            <h4 className="font-medium truncate pr-2" title={skill.name}>{skill.name}</h4>
                            <span className={cn("text-xs font-mono font-bold", skillColor.text)}>{skill.percentage}%</span>
                          </div>
                          
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden relative z-10">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${skill.percentage}%` }} 
                              transition={{ duration: 0.8, delay: 0.2 }} 
                              className={cn("h-full rounded-full", skillColor.bar)}
                            />
                          </div>

                          {/* Decorative glow based on skill color */}
                          <div className={cn("absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-10", skillColor.bar)} />

                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-lg p-1 z-20">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => { setEditingSkill(skill); setEditDialogOpen(true); }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive hover:text-destructive" 
                              onClick={() => setDeleteId(skill.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )})}
                  </div>
                </div>
              );
            })}

            {/* Uncategorized Skills */}
            {uncategorizedSkills.length > 0 && (
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-500/20 text-gray-500">
                      <Brain className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold capitalize text-lg">Lainnya / Tanpa Kategori</h3>
                    <Badge variant="secondary" className="ml-2">{uncategorizedSkills.length}</Badge>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {uncategorizedSkills.map((skill, index) => (
                        <motion.div key={skill.id} className="glass rounded-xl p-4 card-hover group relative overflow-hidden">
                           <div className="flex flex-col gap-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium truncate pr-2">{skill.name}</h4>
                                <span className="text-xs font-mono text-muted-foreground">{skill.percentage}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-gray-500" style={{ width: `${skill.percentage}%` }} />
                              </div>
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-lg p-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingSkill(skill); setEditDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => setDeleteId(skill.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingSkill?.id ? 'Ubah Keahlian' : 'Tambah Keahlian'}</DialogTitle></DialogHeader>
          {editingSkill && (
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Nama</Label><Input value={editingSkill.name || ''} onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })} placeholder="React, Python..." /></div>
              <div className="space-y-2"><Label>Kategori</Label>
                <Select 
                  value={editingSkill.category ? String(editingSkill.category) : undefined} 
                  onValueChange={(v) => setEditingSkill({ ...editingSkill, category: Number(v) })}
                >
                  <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent>
                    {skillCategories.map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Kecakapan: {editingSkill.percentage}%</Label><Slider value={[editingSkill.percentage || 50]} onValueChange={([v]) => setEditingSkill({ ...editingSkill, percentage: v })} max={100} step={5} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditDialogOpen(false)}>Batal</Button><Button onClick={handleSave} className="btn-neon">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Hapus Keahlian" description="Apakah Anda yakin?" onConfirm={handleDelete} confirmText="Hapus" variant="destructive" />
    </div>
  );
};

export default Skills;
