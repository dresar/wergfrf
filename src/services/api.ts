import { 
  FALLBACK_PROFILE, 
  FALLBACK_SETTINGS, 
  FALLBACK_PROJECTS, 
  FALLBACK_SKILLS, 
  FALLBACK_EXPERIENCE, 
  FALLBACK_EDUCATION 
} from '../data/fallbackData';

// API Service untuk koneksi ke backend
const DIRECT_URL = "/api";

// Helper function untuk API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const url = `${DIRECT_URL}${endpoint}`;

    const response = await fetch(url, {
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

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Profile API
export const profileAPI = {
  get: async () => {
    try {
      return await apiCall('/profile/');
    } catch (error) {
      console.warn('Using fallback profile data due to error:', error);
      return FALLBACK_PROFILE;
    }
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    try {
      return await apiCall('/projects/');
    } catch (error) {
      console.warn('Using fallback projects data due to error:', error);
      return FALLBACK_PROJECTS;
    }
  },
  getById: (id: number) => apiCall(`/projects/${id}/`),
};

// Project Categories API
export const projectCategoriesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/project-categories/');
    } catch (error) {
      return [];
    }
  },
};

// Experience API
export const experienceAPI = {
  getAll: async () => {
    try {
      return await apiCall('/experience/');
    } catch (error) {
      console.warn('Using fallback experience data due to error:', error);
      return FALLBACK_EXPERIENCE;
    }
  },
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    try {
      return await apiCall('/skills/');
    } catch (error) {
      console.warn('Using fallback skills data due to error:', error);
      return FALLBACK_SKILLS;
    }
  },
};

// Skill Categories API
export const skillCategoriesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/skill-categories/');
    } catch (error) {
      return [];
    }
  },
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/certificate-categories/');
    } catch (error) {
      return [];
    }
  },
};

// Education API
export const educationAPI = {
  getAll: async () => {
    try {
      return await apiCall('/education/');
    } catch (error) {
      console.warn('Using fallback education data due to error:', error);
      return FALLBACK_EDUCATION;
    }
  },
};

// Certificates API
export const certificatesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/certificates/');
    } catch (error) {
      return [];
    }
  },
};

// Social Links API
export const socialLinksAPI = {
  getAll: async () => {
    try {
      return await apiCall('/social-links/');
    } catch (error) {
      return [];
    }
  },
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
  get: async () => {
    try {
      return await apiCall('/settings/');
    } catch (error) {
      console.warn('Using fallback settings data due to error:', error);
      return FALLBACK_SETTINGS;
    }
  },
};

// WA Templates API (Public GET)
export const waTemplatesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/wa-templates/');
    } catch (error) {
      return [];
    }
  },
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health/'),
};

// Blog Categories API
export const blogCategoriesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/blog-categories/');
    } catch (error) {
      return [];
    }
  },
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: async () => {
    try {
      return await apiCall('/blog-posts/');
    } catch (error) {
      return [];
    }
  },
  getBySlug: (slug: string) => apiCall(`/blog-posts/by_slug/?slug=${slug}`),
  getById: (id: number) => apiCall(`/blog-posts/${id}/`),
};

// Home Content API
export const homeContentAPI = {
  get: async () => {
    try {
      return await apiCall('/home-content/');
    } catch (error) {
      return null;
    }
  },
};

// About Content API
export const aboutContentAPI = {
  get: async () => {
    try {
      return await apiCall('/about-content/');
    } catch (error) {
      return null;
    }
  },
};
