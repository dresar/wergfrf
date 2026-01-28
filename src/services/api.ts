import { 
  FALLBACK_PROFILE, 
  FALLBACK_SETTINGS, 
  FALLBACK_PROJECTS, 
  FALLBACK_SKILLS, 
  FALLBACK_EXPERIENCE, 
  FALLBACK_EDUCATION,
  FALLBACK_CERTIFICATE_CATEGORIES,
  FALLBACK_BLOG_POSTS,
  FALLBACK_PROJECT_CATEGORIES,
  FALLBACK_CERTIFICATES,
  FALLBACK_SKILL_CATEGORIES,
  FALLBACK_SOCIAL_LINKS
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
    // Suppress console.error for expected fallback scenarios to avoid alarming the user
    // console.error(`API call failed for ${endpoint}:`, error);
    
    // If it's a JSON parse error (like receiving HTML instead of JSON)
    // we still throw, but we suppressed the console log above.
    // The calling functions (profileAPI, projectsAPI, etc.) will catch this 
    // and return their specific fallback data.
    
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
      console.log('Using fallback data for project categories');
      return FALLBACK_PROJECT_CATEGORIES;
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
      console.log('Using fallback data for skill categories');
      return FALLBACK_SKILL_CATEGORIES;
    }
  },
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: async () => {
    try {
      return await apiCall('/certificate-categories/');
    } catch (error) {
      console.log('Using fallback data for certificate categories');
      return FALLBACK_CERTIFICATE_CATEGORIES;
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
      console.log('Using fallback data for certificates');
      return FALLBACK_CERTIFICATES;
    }
  },
};

// Social Links API
export const socialLinksAPI = {
  getAll: async () => {
    try {
      return await apiCall('/social-links/');
    } catch (error) {
      console.log('Using fallback data for social links');
      return FALLBACK_SOCIAL_LINKS;
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
      console.log('Using fallback data for blog posts');
      return FALLBACK_BLOG_POSTS;
    }
  },
  getOne: async (slug: string) => {
    try {
      return await apiCall(`/blog-posts/${slug}/`);
    } catch (error) {
      const post = FALLBACK_BLOG_POSTS.find(p => p.slug === slug);
      if (post) return post;
      return null;
    }
  },
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
