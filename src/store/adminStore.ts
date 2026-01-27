import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  projectsAPI, messagesAPI, subscribersAPI, skillsAPI, experienceAPI,
  educationAPI, certificatesAPI, socialLinksAPI, projectCategoriesAPI,
  skillCategoriesAPI, certificateCategoriesAPI, siteSettingsAPI,
  profileAPI, homeContentAPI, aboutContentAPI, waTemplatesAPI
} from '@/services/api';

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

export interface ProjectSummary {
  id?: number;
  content: string;
  version: number;
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
  is_published?: boolean;
  publish_at?: string | null;
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
  total_certificates?: number;
  total_skills?: number;
  map_embed_url?: string | null;
}

export interface SiteSettings {
  id: number;
  theme: 'dark' | 'light';
  seoTitle: string;
  seoDesc: string;
  cdn_url?: string;
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
          projects,
          messages,
          subscribers,
          skills,
          experiences,
          education,
          certificates,
          socialLinks,
          projectCategories,
          skillCategories,
          certificateCategories,
          settings,
          profile,
          homeContent,
          aboutContent,
          waTemplates,
        ] = await Promise.all([
          projectsAPI.getAll(),
          messagesAPI.getAll(),
          subscribersAPI.getAll().catch(() => []),
          skillsAPI.getAll(),
          experienceAPI.getAll(),
          educationAPI.getAll(),
          certificatesAPI.getAll(),
          socialLinksAPI.getAll(),
          projectCategoriesAPI.getAll(),
          skillCategoriesAPI.getAll(),
          certificateCategoriesAPI.getAll(),
          siteSettingsAPI.get(),
          profileAPI.get(),
          homeContentAPI.get().catch(() => null),
          aboutContentAPI.get().catch(() => null),
          waTemplatesAPI.getAll(),
        ]);

        set({
          projects,
          messages,
          subscribers: subscribers ?? [],
          skills,
          experiences,
          education,
          certificates,
          socialLinks,
          projectCategories,
          skillCategories,
          certificateCategories,
          settings: settings || emptySiteSettings,
          profile,
          homeContent,
          aboutContent,
          waTemplates,
        });
      },

      // WA Template Actions
      addWATemplate: async (template) => {
        const data = await waTemplatesAPI.create(template);
        set((state) => ({
          waTemplates: [...state.waTemplates, data],
        }));
      },

      updateWATemplate: async (id, data) => {
        const updated = await waTemplatesAPI.update(id, data);
        set((state) => ({
          waTemplates: state.waTemplates.map((t) => (t.id === id ? updated : t)),
        }));
      },

      deleteWATemplate: async (id) => {
        await waTemplatesAPI.delete(id);
        set((state) => ({
          waTemplates: state.waTemplates.filter((t) => t.id !== id),
        }));
      },

      // Project Category Actions
      addProjectCategory: async (category) => {
        const data = await projectCategoriesAPI.create(category);
        set((state) => ({
          projectCategories: [...state.projectCategories, data],
        }));
      },

      updateProjectCategory: async (id, data) => {
        const updated = await projectCategoriesAPI.update(id, data);
        set((state) => ({
          projectCategories: state.projectCategories.map((c) => (c.id === id ? updated : c)),
        }));
      },

      deleteProjectCategory: async (id) => {
        await projectCategoriesAPI.delete(id);
        set((state) => ({
          projectCategories: state.projectCategories.filter((c) => c.id !== id),
        }));
      },

      // Skill Category Actions
      addSkillCategory: async (category) => {
        const data = await skillCategoriesAPI.create(category);
        set((state) => ({
          skillCategories: [...state.skillCategories, data],
        }));
      },

      updateSkillCategory: async (id, data) => {
        const updated = await skillCategoriesAPI.update(id, data);
        set((state) => ({
          skillCategories: state.skillCategories.map((c) => (c.id === id ? updated : c)),
        }));
      },

      deleteSkillCategory: async (id) => {
        await skillCategoriesAPI.delete(id);
        set((state) => ({
          skillCategories: state.skillCategories.filter((c) => c.id !== id),
        }));
      },

      // Certificate Category Actions
      addCertificateCategory: async (category) => {
        const data = await certificateCategoriesAPI.create(category);
        set((state) => ({
          certificateCategories: [...state.certificateCategories, data],
        }));
      },

      updateCertificateCategory: async (id, data) => {
        const updated = await certificateCategoriesAPI.update(id, data);
        set((state) => ({
          certificateCategories: state.certificateCategories.map((c) => (c.id === id ? updated : c)),
        }));
      },

      deleteCertificateCategory: async (id) => {
        await certificateCategoriesAPI.delete(id);
        set((state) => ({
          certificateCategories: state.certificateCategories.filter((c) => c.id !== id),
        }));
      },

      // Project Actions
      addProject: async (project) => {
        const data = await projectsAPI.create(project);
        set((state) => ({
          projects: [...state.projects, data],
        }));
      },

      updateProject: async (id, data) => {
        const updated = await projectsAPI.update(id, data);
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updated : p)),
        }));
        // Re-fetch projects to ensure we have the latest category details
        try {
          const updatedProjects = await projectsAPI.getAll();
          set({ projects: updatedProjects });
        } catch (error) {
          console.error('Failed to refetch projects:', error);
        }
      },

      deleteProject: async (id) => {
        await projectsAPI.delete(id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      // Message Actions
      markMessageRead: async (id) => {
        await messagesAPI.update(id, { isRead: true });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          ),
        }));
      },
      markMessageUnread: async (id) => {
        await messagesAPI.update(id, { isRead: false });
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: false } : m
          ),
        }));
      },
      archiveMessage: async (id) => {
        await messagesAPI.delete(id);
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },

      deleteMessage: async (id) => {
        await messagesAPI.delete(id);
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },
      deleteMessages: async (ids) => {
        await Promise.all(ids.map((id) => messagesAPI.delete(id)));
        set((state) => ({
          messages: state.messages.filter((m) => !ids.includes(m.id)),
        }));
      },

      // Subscriber Actions
      deleteSubscriber: async (id) => {
        try {
          await subscribersAPI.delete(id);
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
        const data = await skillsAPI.create(skill);
        set((state) => ({
          skills: [...state.skills, data],
        }));
      },

      updateSkill: async (id, data) => {
        const updated = await skillsAPI.update(id, data);
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? updated : s)),
        }));
      },

      deleteSkill: async (id) => {
        await skillsAPI.delete(id);
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }));
      },

      // Experience Actions
      addExperience: async (exp) => {
        const data = await experienceAPI.create(exp);
        set((state) => ({
          experiences: [...state.experiences, data],
        }));
      },

      updateExperience: async (id, data) => {
        const updated = await experienceAPI.update(id, data);
        set((state) => ({
          experiences: state.experiences.map((e) =>
            e.id === id ? updated : e
          ),
        }));
      },

      deleteExperience: async (id) => {
        await experienceAPI.delete(id);
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        }));
      },

      // Education Actions
      addEducation: async (edu) => {
        const data = await educationAPI.create(edu);
        set((state) => ({
          education: [...state.education, data],
        }));
      },

      updateEducation: async (id, data) => {
        const updated = await educationAPI.update(id, data);
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? updated : e
          ),
        }));
      },

      deleteEducation: async (id) => {
        await educationAPI.delete(id);
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        }));
      },

      // Certificate Actions
      addCertificate: async (cert) => {
        const data = await certificatesAPI.create(cert);
        set((state) => ({
          certificates: [...state.certificates, data],
        }));
      },

      updateCertificate: async (id, data) => {
        const updated = await certificatesAPI.update(id, data);
        set((state) => ({
          certificates: state.certificates.map((c) =>
            c.id === id ? updated : c
          ),
        }));
      },

      deleteCertificate: async (id) => {
        await certificatesAPI.delete(id);
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        }));
      },

      // Social Link Actions
      addSocialLink: async (link) => {
        const data = await socialLinksAPI.create(link);
        set((state) => ({
          socialLinks: [...state.socialLinks, data],
        }));
      },

      updateSocialLink: async (id, data) => {
        const updated = await socialLinksAPI.update(id, data);
        set((state) => ({
          socialLinks: state.socialLinks.map((l) =>
            l.id === id ? updated : l
          ),
        }));
      },

      deleteSocialLink: async (id) => {
        await socialLinksAPI.delete(id);
        set((state) => ({
          socialLinks: state.socialLinks.filter((l) => l.id !== id),
        }));
      },

      // Settings Actions
      updateSettings: async (data) => {
        const current = get().settings ?? emptySiteSettings;
        const updated = await siteSettingsAPI.update(current.id, {
          ...current,
          ...data,
        });
        set({ settings: updated });
      },

      updateProfile: async (data: any) => {
        const current = get().profile;
        // Check if profile exists and has an ID
        if (!current || !current.id) {
          const res = await profileAPI.create(data);
          set({ profile: res });
          return;
        }
        
        // If data is FormData, send it directly. Otherwise merge with current.
        const payload = data instanceof FormData ? data : { ...current, ...data };
          
          const res = await profileAPI.update(current.id, payload);
          set({ profile: res });
      },

      updateHomeContent: async (data: any) => {
        const current = get().homeContent;
        if (!current || !current.id) {
          const res = await homeContentAPI.create(data);
          set({ homeContent: res });
          return;
        }
        const payload = data instanceof FormData ? data : { ...current, ...data };
        const res = await homeContentAPI.update(current.id, payload);
        set({ homeContent: res });
      },

      updateAboutContent: async (data: any) => {
        const current = get().aboutContent;
        if (!current || !current.id) {
          const res = await aboutContentAPI.create(data);
          set({ aboutContent: res });
          return;
        }
        const payload = data instanceof FormData ? data : { ...current, ...data };
        const res = await aboutContentAPI.update(current.id, payload);
        set({ aboutContent: res });
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
