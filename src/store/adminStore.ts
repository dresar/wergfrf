import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

// Initialize dark mode
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

// Types
export interface ProjectImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CertificateCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  content?: string;
  thumbnail: string | null;
  cover_image?: string | null;
  techStack: string[] | null;
  category: number | null; // ID of the category
  category_details?: ProjectCategory; // For reading
  demoUrl?: string | null;
  repoUrl?: string | null;
  video_url?: string | null;
  is_featured?: boolean;
  links?: ProjectLink[] | null;
  images?: ProjectImage[];
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Subscriber {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category: number;
  category_details?: SkillCategory;
  percentage: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  gpa: string;
  logo: string;
  attachments: string[];
  gallery: string[];
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  image?: string;
  verified?: boolean;
  category: number | null;
  category_details?: CertificateCategory;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  id: number;
  fullName: string;
  greeting: string;
  role: string | string[];
  bio: string;
  heroImage?: string | null;
  heroImageFile?: string | null;
  aboutImage?: string | null;
  aboutImageFile?: string | null;
  resumeUrl?: string | null;
  resumeFile?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  stats_project_count?: string | null;
  stats_exp_years?: string | null;
}

export interface SiteSettings {
  id: number;
  theme: 'dark' | 'light';
  seoTitle: string;
  seoDesc: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface WATemplate {
  id: number;
  template_name: string;
  template_content: string;
  category: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HomeContent {
  id: number;
  greeting_id: string;
  greeting_en: string;
  roles_id: string;
  roles_en: string;
  heroImage?: string | null;
  heroImageFile?: string | null;
}

export interface AboutContent {
  id: number;
  short_description_id: string;
  short_description_en: string;
  long_description_id: string;
  long_description_en: string;
  aboutImage?: string | null;
  aboutImageFile?: string | null;
}

interface AdminState {
  // Data
  projects: Project[];
  messages: Message[];
  subscribers: Subscriber[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  socialLinks: SocialLink[];
  projectCategories: ProjectCategory[];
  skillCategories: SkillCategory[];
  certificateCategories: CertificateCategory[];
  waTemplates: WATemplate[];
  settings: SiteSettings | null;
  profile: Profile | null;
  homeContent: HomeContent | null;
  aboutContent: AboutContent | null;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;

  // Actions - Load
  fetchInitialData: () => Promise<void>;
 
  // Actions - Project Categories
  addProjectCategory: (category: Omit<ProjectCategory, 'id'>) => Promise<void>;
  updateProjectCategory: (id: number, data: Partial<ProjectCategory>) => Promise<void>;
  deleteProjectCategory: (id: number) => Promise<void>;

  // Actions - Skill Categories
  addSkillCategory: (category: Omit<SkillCategory, 'id'>) => Promise<void>;
  updateSkillCategory: (id: number, data: Partial<SkillCategory>) => Promise<void>;
  deleteSkillCategory: (id: number) => Promise<void>;

  // Actions - Certificate Categories
  addCertificateCategory: (category: Omit<CertificateCategory, 'id'>) => Promise<void>;
  updateCertificateCategory: (id: number, data: Partial<CertificateCategory>) => Promise<void>;
  deleteCertificateCategory: (id: number) => Promise<void>;

  // Actions - WA Templates
  addWATemplate: (template: Omit<WATemplate, 'id'>) => Promise<void>;
  updateWATemplate: (id: number, data: Partial<WATemplate>) => Promise<void>;
  deleteWATemplate: (id: number) => Promise<void>;

  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: number, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  
  // Actions - Messages
  markMessageRead: (id: number) => Promise<void>;
  markMessageUnread: (id: number) => Promise<void>;
  archiveMessage: (id: number) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  deleteMessages: (ids: number[]) => Promise<void>;
  
  // Actions - Subscribers
  deleteSubscriber: (id: number) => Promise<void>;
  exportSubscribers: () => string;

  // Actions - Skills
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: number, data: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
  
  // Actions - Experience
  addExperience: (exp: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: number, data: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>;
  
  // Actions - Education
  addEducation: (edu: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: number, data: Partial<Education>) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;
  
  // Actions - Certificates
  addCertificate: (cert: Omit<Certificate, 'id'>) => Promise<void>;
  updateCertificate: (id: number, data: Partial<Certificate>) => Promise<void>;
  deleteCertificate: (id: number) => Promise<void>;
  
  // Actions - Social Links
  addSocialLink: (link: Omit<SocialLink, 'id'>) => Promise<void>;
  updateSocialLink: (id: number, data: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (id: number) => Promise<void>;
  
  // Actions - Settings
  updateSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateProfile: (data: Partial<Profile> | FormData) => Promise<void>;
  updateHomeContent: (data: Partial<HomeContent> | FormData) => Promise<void>;
  updateAboutContent: (data: Partial<AboutContent> | FormData) => Promise<void>;
  
  // Actions - UI
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Export
  exportAllData: () => string;
}

// Utility
const emptySiteSettings: SiteSettings = {
  id: 0,
  theme: 'dark',
  seoTitle: '',
  seoDesc: '',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial State (empty, will be filled from API)
      projects: [],
      messages: [],
      subscribers: [],
      skills: [],
      experiences: [],
      education: [],
      certificates: [],
      socialLinks: [],
      projectCategories: [],
      skillCategories: [],
      certificateCategories: [],
      waTemplates: [],
      settings: null,
      profile: null,
      homeContent: null,
      aboutContent: null,
      theme: 'dark',
      sidebarCollapsed: false,

      // Load all initial data from backend
      fetchInitialData: async () => {
        const [
          projectsRes,
          messagesRes,
          subscribersRes,
          skillsRes,
          experiencesRes,
          educationRes,
          certificatesRes,
          socialLinksRes,
          projectCategoriesRes,
          skillCategoriesRes,
          certificateCategoriesRes,
          settingsRes,
          profileRes,
          homeContentRes,
          aboutContentRes,
          waTemplatesRes,
        ] = await Promise.all([
          api.get<Project[]>('/projects/'),
          api.get<Message[]>('/messages/'),
          api.get<Subscriber[]>('/subscribers/').catch(() => ({ data: [] })),
          api.get<Skill[]>('/skills/'),
          api.get<Experience[]>('/experience/'),
          api.get<Education[]>('/education/'),
          api.get<Certificate[]>('/certificates/'),
          api.get<SocialLink[]>('/social-links/'),
          api.get<ProjectCategory[]>('/project-categories/'),
          api.get<SkillCategory[]>('/skill-categories/'),
          api.get<CertificateCategory[]>('/certificate-categories/'),
          api.get<SiteSettings | null>('/settings/'),
          api.get<Profile | null>('/profile/'),
          api.get<HomeContent | null>('/home-content/').catch(() => ({ data: null })),
          api.get<AboutContent | null>('/about-content/').catch(() => ({ data: null })),
          api.get<WATemplate[]>('/wa-templates/'),
        ]);

        set({
          projects: projectsRes.data,
          messages: messagesRes.data,
          subscribers: subscribersRes.data ?? [],
          skills: skillsRes.data,
          experiences: experiencesRes.data,
          education: educationRes.data,
          certificates: certificatesRes.data,
          socialLinks: socialLinksRes.data,
          projectCategories: projectCategoriesRes.data,
          skillCategories: skillCategoriesRes.data,
          certificateCategories: certificateCategoriesRes.data,
          settings: settingsRes.data || emptySiteSettings,
          profile: profileRes.data,
          homeContent: homeContentRes.data,
          aboutContent: aboutContentRes.data,
          waTemplates: waTemplatesRes.data,
        });
      },

      // WA Template Actions
      addWATemplate: async (template) => {
        const res = await api.post<WATemplate>('/wa-templates/', template);
        set((state) => ({
          waTemplates: [...state.waTemplates, res.data],
        }));
      },

      updateWATemplate: async (id, data) => {
        const res = await api.put<WATemplate>(`/wa-templates/${id}/`, data);
        set((state) => ({
          waTemplates: state.waTemplates.map((t) => (t.id === id ? res.data : t)),
        }));
      },

      deleteWATemplate: async (id) => {
        await api.delete(`/wa-templates/${id}/`);
        set((state) => ({
          waTemplates: state.waTemplates.filter((t) => t.id !== id),
        }));
      },

      // Project Category Actions
      addProjectCategory: async (category) => {
        const res = await api.post<ProjectCategory>('/project-categories/', category);
        set((state) => ({
          projectCategories: [...state.projectCategories, res.data],
        }));
      },

      updateProjectCategory: async (id, data) => {
        const res = await api.put<ProjectCategory>(`/project-categories/${id}/`, data);
        set((state) => ({
          projectCategories: state.projectCategories.map((c) => (c.id === id ? res.data : c)),
        }));
      },

      deleteProjectCategory: async (id) => {
        await api.delete(`/project-categories/${id}/`);
        set((state) => ({
          projectCategories: state.projectCategories.filter((c) => c.id !== id),
        }));
      },

      // Skill Category Actions
      addSkillCategory: async (category) => {
        const res = await api.post<SkillCategory>('/skill-categories/', category);
        set((state) => ({
          skillCategories: [...state.skillCategories, res.data],
        }));
      },

      updateSkillCategory: async (id, data) => {
        const res = await api.put<SkillCategory>(`/skill-categories/${id}/`, data);
        set((state) => ({
          skillCategories: state.skillCategories.map((c) => (c.id === id ? res.data : c)),
        }));
      },

      deleteSkillCategory: async (id) => {
        await api.delete(`/skill-categories/${id}/`);
        set((state) => ({
          skillCategories: state.skillCategories.filter((c) => c.id !== id),
        }));
      },

      // Certificate Category Actions
      addCertificateCategory: async (category) => {
        const res = await api.post<CertificateCategory>('/certificate-categories/', category);
        set((state) => ({
          certificateCategories: [...state.certificateCategories, res.data],
        }));
      },

      updateCertificateCategory: async (id, data) => {
        const res = await api.put<CertificateCategory>(`/certificate-categories/${id}/`, data);
        set((state) => ({
          certificateCategories: state.certificateCategories.map((c) => (c.id === id ? res.data : c)),
        }));
      },

      deleteCertificateCategory: async (id) => {
        await api.delete(`/certificate-categories/${id}/`);
        set((state) => ({
          certificateCategories: state.certificateCategories.filter((c) => c.id !== id),
        }));
      },

      // Project Actions
      addProject: async (project) => {
        const res = await api.post<Project>('/projects/', project);
        set((state) => ({
          projects: [...state.projects, res.data],
        }));
      },

      updateProject: async (id, data) => {
        const res = await api.put<Project>(`/projects/${id}/`, data);
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? res.data : p)),
        }));
        // Re-fetch projects to ensure we have the latest category details
        try {
          const updatedProjectsRes = await api.get<Project[]>('/projects/');
          set({ projects: updatedProjectsRes.data });
        } catch (error) {
          console.error('Failed to refetch projects:', error);
        }
      },

      deleteProject: async (id) => {
        await api.delete(`/projects/${id}/`);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      // Message Actions
      markMessageRead: async (id) => {
        await api.put(`/messages/${id}/`, { isRead: true });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          ),
        }));
      },
      markMessageUnread: async (id) => {
        await api.put(`/messages/${id}/`, { isRead: false });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: false } : m
          ),
        }));
      },
      archiveMessage: async (id) => {
        await api.delete(`/messages/${id}/`);
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },

      deleteMessage: async (id) => {
        await api.delete(`/messages/${id}/`);
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },
      deleteMessages: async (ids) => {
        await Promise.all(ids.map((id) => api.delete(`/messages/${id}/`)));
        set((state) => ({
          messages: state.messages.filter((m) => !ids.includes(m.id)),
        }));
      },

      // Subscriber Actions
      deleteSubscriber: async (id) => {
        try {
          await api.delete(`/subscribers/${id}/`);
        } catch (error) {
          console.error(error);
        }
        set((state) => ({
          subscribers: state.subscribers.filter((s) => s.id !== id),
        }));
      },
      exportSubscribers: () => {
        const subscribers = get().subscribers;
        const headers = ['Email', 'Status', 'Subscribed At'];
        const rows = subscribers.map((subscriber) => [
          subscriber.email,
          subscriber.status,
          new Date(subscriber.subscribedAt).toLocaleDateString(),
        ]);
        return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      },

      // Skill Actions
      addSkill: async (skill) => {
        const res = await api.post<Skill>('/skills/', skill);
        set((state) => ({
          skills: [...state.skills, res.data],
        }));
      },

      updateSkill: async (id, data) => {
        const res = await api.put<Skill>(`/skills/${id}/`, data);
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? res.data : s)),
        }));
      },

      deleteSkill: async (id) => {
        await api.delete(`/skills/${id}/`);
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }));
      },

      // Experience Actions
      addExperience: async (exp) => {
        const res = await api.post<Experience>('/experience/', exp);
        set((state) => ({
          experiences: [...state.experiences, res.data],
        }));
      },

      updateExperience: async (id, data) => {
        const res = await api.put<Experience>(`/experience/${id}/`, data);
        set((state) => ({
          experiences: state.experiences.map((e) =>
            e.id === id ? res.data : e
          ),
        }));
      },

      deleteExperience: async (id) => {
        await api.delete(`/experience/${id}/`);
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        }));
      },

      // Education Actions
      addEducation: async (edu) => {
        const res = await api.post<Education>('/education/', edu);
        set((state) => ({
          education: [...state.education, res.data],
        }));
      },

      updateEducation: async (id, data) => {
        const res = await api.put<Education>(`/education/${id}/`, data);
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? res.data : e
          ),
        }));
      },

      deleteEducation: async (id) => {
        await api.delete(`/education/${id}/`);
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        }));
      },

      // Certificate Actions
      addCertificate: async (cert) => {
        const res = await api.post<Certificate>('/certificates/', cert);
        set((state) => ({
          certificates: [...state.certificates, res.data],
        }));
      },

      updateCertificate: async (id, data) => {
        const res = await api.put<Certificate>(`/certificates/${id}/`, data);
        set((state) => ({
          certificates: state.certificates.map((c) =>
            c.id === id ? res.data : c
          ),
        }));
      },

      deleteCertificate: async (id) => {
        await api.delete(`/certificates/${id}/`);
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        }));
      },

      // Social Link Actions
      addSocialLink: async (link) => {
        const res = await api.post<SocialLink>('/social-links/', link);
        set((state) => ({
          socialLinks: [...state.socialLinks, res.data],
        }));
      },

      updateSocialLink: async (id, data) => {
        const res = await api.put<SocialLink>(`/social-links/${id}/`, data);
        set((state) => ({
          socialLinks: state.socialLinks.map((l) =>
            l.id === id ? res.data : l
          ),
        }));
      },

      deleteSocialLink: async (id) => {
        await api.delete(`/social-links/${id}/`);
        set((state) => ({
          socialLinks: state.socialLinks.filter((l) => l.id !== id),
        }));
      },

      // Settings Actions
      updateSettings: async (data) => {
        const current = get().settings ?? emptySiteSettings;
        const res = await api.put<SiteSettings>(`/settings/${current.id}/`, {
          ...current,
          ...data,
        });
        set({ settings: res.data });
      },

      updateProfile: async (data: any) => {
        const current = get().profile;
        // Check if profile exists and has an ID
        if (!current || !current.id) {
          const res = await api.post<Profile>('/profile/', data);
          set({ profile: res.data });
          return;
        }
        
        // If data is FormData, send it directly. Otherwise merge with current.
        const payload = data instanceof FormData ? data : { ...current, ...data };
          
          const res = await api.patch<Profile>(`/profile/${current.id}/`, payload);
          set({ profile: res.data });
      },

      updateHomeContent: async (data: any) => {
        const current = get().homeContent;
        if (!current || !current.id) {
          const res = await api.post<HomeContent>('/home-content/', data);
          set({ homeContent: res.data });
          return;
        }
        const payload = data instanceof FormData ? data : { ...current, ...data };
        const res = await api.patch<HomeContent>(`/home-content/${current.id}/`, payload);
        set({ homeContent: res.data });
      },

      updateAboutContent: async (data: any) => {
        const current = get().aboutContent;
        if (!current || !current.id) {
          const res = await api.post<AboutContent>('/about-content/', data);
          set({ aboutContent: res.data });
          return;
        }
        const payload = data instanceof FormData ? data : { ...current, ...data };
        const res = await api.patch<AboutContent>(`/about-content/${current.id}/`, payload);
        set({ aboutContent: res.data });
      },

      // UI Actions
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        return { theme: newTheme };
      }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Export
      exportAllData: () => {
        const state = get();
        return JSON.stringify({
          projects: state.projects,
          messages: state.messages,
          subscribers: state.subscribers,
          skills: state.skills,
          experiences: state.experiences,
          education: state.education,
          certificates: state.certificates,
          socialLinks: state.socialLinks,
          settings: state.settings,
          profile: state.profile,
        }, null, 2);
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        projects: state.projects,
        messages: state.messages,
        subscribers: state.subscribers,
        skills: state.skills,
        experiences: state.experiences,
        education: state.education,
        certificates: state.certificates,
        socialLinks: state.socialLinks,
        projectCategories: state.projectCategories,
        settings: state.settings,
        profile: state.profile,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
