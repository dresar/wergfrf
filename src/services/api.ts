// API Service untuk koneksi ke backend

// Implementasi Real-time Data Fetching (In-Memory Only)
const DIRECT_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

// Helper function untuk API calls langsung tanpa persistent storage
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const url = `${DIRECT_URL}${endpoint}`;

    // Menambahkan timestamp untuk mencegah browser caching pada level HTTP request
    // jika method adalah GET
    const finalUrl = (options.method === 'GET' || !options.method) 
      ? `${url}${url.includes('?') ? '&' : '?'}t=${new Date().getTime()}`
      : url;

    const response = await fetch(finalUrl, {
      ...options,
      headers,
    });

    // Check Content-Type header
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // ignore json parse error
        }
      } else {
        // Jika error tapi bukan JSON (misal HTML 404/500), ambil text sebagian
        try {
          const text = await response.text();
          // console.error(`API Error Response (${endpoint}):`, text.substring(0, 200));
          errorMessage += " (Non-JSON response)";
        } catch (e) {}
      }
      
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    if (!isJson) {
      // Jika status 200 OK tapi bukan JSON (misal HTML index.html karena proxy fail)
      const text = await response.text();
      // console.error(`API Unexpected HTML Response (${endpoint}):`, text.substring(0, 200));
      throw new Error(`API returned Non-JSON response (HTML). Check proxy/backend configuration.`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    // console.error(`API Call Error (${endpoint}):`, error);
    // Re-throw error agar bisa ditangani oleh React Query / UI
    throw error;
  }
}

import { dataManager } from './dataManager';

// Profile API
export const profileAPI = {
  get: async () => dataManager.fetchWithCache('/profile'), // Removed trailing slash
};

// Projects API
export const projectsAPI = {
  getAll: async () => dataManager.fetchWithCache('/projects'),
  getById: (id: number) => dataManager.fetchWithCache(`/projects/${id}`),
};

// Project Categories API
export const projectCategoriesAPI = {
  getAll: async () => dataManager.fetchWithCache('/projects/categories'),
};

// Experience API
export const experienceAPI = {
  getAll: async () => dataManager.fetchWithCache('/experience'),
};

// Skills API
export const skillsAPI = {
  getAll: async () => dataManager.fetchWithCache('/skills'),
};

// Skill Categories API
export const skillCategoriesAPI = {
  getAll: async () => dataManager.fetchWithCache('/skill-categories'),
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: async () => dataManager.fetchWithCache('/certificate-categories'),
};

// Education API
export const educationAPI = {
  getAll: async () => dataManager.fetchWithCache('/education'),
  create: async (data: any) => {
    const result = await apiCall('/education', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/education');
    return result;
  },
  update: async (id: number, data: any) => {
    const result = await apiCall(`/education/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/education');
    return result;
  },
  delete: async (id: number) => {
    const result = await apiCall(`/education/${id}`, {
        method: 'DELETE',
    });
    dataManager.invalidate('/education');
    return result;
  }
};

// Certificates API
export const certificatesAPI = {
  getAll: async () => dataManager.fetchWithCache('/certificates'),
  create: async (data: any) => {
    const result = await apiCall('/certificates', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/certificates');
    return result;
  },
  update: async (id: number, data: any) => {
    const result = await apiCall(`/certificates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/certificates');
    return result;
  },
  delete: async (id: number) => {
    const result = await apiCall(`/certificates/${id}`, {
        method: 'DELETE',
    });
    dataManager.invalidate('/certificates');
    return result;
  }
};

// Social Links API
export const socialLinksAPI = {
  getAll: async () => dataManager.fetchWithCache('/social-links'),
};

// Messages API (Public POST only)
export const messagesAPI = {
  create: (data: any) => apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Site Settings API
export const siteSettingsAPI = {
  get: async () => dataManager.fetchWithCache('/settings'),
  createOrUpdate: async (data: any) => apiCall('/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// WA Templates API (Public GET)
export const waTemplatesAPI = {
  getAll: async () => dataManager.fetchWithCache('/wa-templates'),
  create: async (data: any) => {
    const result = await apiCall('/wa-templates', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/wa-templates');
    return result;
  },
  update: async (id: number, data: any) => {
    const result = await apiCall(`/wa-templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/wa-templates');
    return result;
  },
  delete: async (id: number) => {
    const result = await apiCall(`/wa-templates/${id}`, {
        method: 'DELETE',
    });
    dataManager.invalidate('/wa-templates');
    return result;
  }
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'), // Health check should not be cached
};

// Blog Categories API
export const blogCategoriesAPI = {
  getAll: async () => dataManager.fetchWithCache('/blog-categories'),
  create: async (data: any) => {
    const result = await apiCall('/blog-categories', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/blog-categories');
    return result;
  },
  update: async (id: number, data: any) => {
    const result = await apiCall(`/blog-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/blog-categories');
    return result;
  },
  delete: async (id: number) => {
    const result = await apiCall(`/blog-categories/${id}`, {
        method: 'DELETE',
    });
    dataManager.invalidate('/blog-categories');
    return result;
  }
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: async () => dataManager.fetchWithCache('/blog-posts'),
  getOne: async (slug: string) => dataManager.fetchWithCache(`/blog-posts/by_slug?slug=${slug}`),
  getById: async (id: number) => dataManager.fetchWithCache(`/blog-posts/${id}`),
  create: async (data: any) => {
    const result = await apiCall('/blog-posts', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/blog-posts');
    return result;
  },
  update: async (id: number, data: any) => {
    const result = await apiCall(`/blog-posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    dataManager.invalidate('/blog-posts');
    return result;
  },
  delete: async (id: number) => {
    const result = await apiCall(`/blog-posts/${id}`, {
        method: 'DELETE',
    });
    dataManager.invalidate('/blog-posts');
    return result;
  }
};

// Home Content API
export const homeContentAPI = {
  get: async () => dataManager.fetchWithCache('/home-content'),
};

// About Content API
export const aboutContentAPI = {
  get: async () => dataManager.fetchWithCache('/about-content'),
};

// AI API
export const aiAPI = {
    fetchModels: (data: any) => apiCall('/ai/models', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

// Aggregate API export
export const api = {
    profile: profileAPI,
    projects: projectsAPI,
    projectCategories: projectCategoriesAPI,
    experience: experienceAPI,
    skills: skillsAPI,
    skillCategories: skillCategoriesAPI,
    certificateCategories: certificateCategoriesAPI,
    education: educationAPI,
    certificates: certificatesAPI,
    socialLinks: socialLinksAPI,
    messages: messagesAPI,
    siteSettings: siteSettingsAPI,
    waTemplates: waTemplatesAPI,
    health: healthAPI,
    blogCategories: blogCategoriesAPI,
    blogPosts: blogPostsAPI,
    homeContent: homeContentAPI,
    aboutContent: aboutContentAPI,
    ai: aiAPI
};
