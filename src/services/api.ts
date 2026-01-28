// API Service untuk koneksi ke backend
// Implementasi Real-time Data Fetching (In-Memory Only)
const DIRECT_URL = "/api";

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

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // ignore json parse error
      }
      
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`API Call Error (${endpoint}):`, error);
    // Re-throw error agar bisa ditangani oleh React Query / UI
    throw error;
  }
}

// Profile API
export const profileAPI = {
  get: async () => apiCall('/profile/'),
};

// Projects API
export const projectsAPI = {
  getAll: async () => apiCall('/projects/'),
  getById: (id: number) => apiCall(`/projects/${id}/`),
};

// Project Categories API
export const projectCategoriesAPI = {
  getAll: async () => apiCall('/project-categories/'),
};

// Experience API
export const experienceAPI = {
  getAll: async () => apiCall('/experience/'),
};

// Skills API
export const skillsAPI = {
  getAll: async () => apiCall('/skills/'),
};

// Skill Categories API
export const skillCategoriesAPI = {
  getAll: async () => apiCall('/skill-categories/'),
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: async () => apiCall('/certificate-categories/'),
};

// Education API
export const educationAPI = {
  getAll: async () => apiCall('/education/'),
};

// Certificates API
export const certificatesAPI = {
  getAll: async () => apiCall('/certificates/'),
};

// Social Links API
export const socialLinksAPI = {
  getAll: async () => apiCall('/social-links/'),
};

// Messages API (Public POST only)
export const messagesAPI = {
  create: (data: any) => apiCall('/messages/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Site Settings API
export const siteSettingsAPI = {
  get: async () => apiCall('/settings/'),
};

// WA Templates API (Public GET)
export const waTemplatesAPI = {
  getAll: async () => apiCall('/wa-templates/'),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health/'),
};

// Blog Categories API
export const blogCategoriesAPI = {
  getAll: async () => apiCall('/blog-categories/'),
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: async () => apiCall('/blog-posts/'),
  getOne: async (slug: string) => apiCall(`/blog-posts/${slug}/`),
};

// Home Content API
export const homeContentAPI = {
  get: async () => apiCall('/home-content/'),
};

// About Content API
export const aboutContentAPI = {
  get: async () => apiCall('/about-content/'),
};
