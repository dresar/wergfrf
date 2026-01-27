// API Service untuk koneksi ke backend
const DIRECT_URL = "https://porto.apprentice.cyou/api";

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
  get: () => apiCall('/profile/'),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiCall('/projects/'),
  getById: (id: number) => apiCall(`/projects/${id}/`),
};

// Project Categories API
export const projectCategoriesAPI = {
  getAll: () => apiCall('/project-categories/'),
};

// Experience API
export const experienceAPI = {
  getAll: () => apiCall('/experience/'),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiCall('/skills/'),
};

// Skill Categories API
export const skillCategoriesAPI = {
  getAll: () => apiCall('/skill-categories/'),
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: () => apiCall('/certificate-categories/'),
};

// Education API
export const educationAPI = {
  getAll: () => apiCall('/education/'),
};

// Certificates API
export const certificatesAPI = {
  getAll: () => apiCall('/certificates/'),
};

// Social Links API
export const socialLinksAPI = {
  getAll: () => apiCall('/social-links/'),
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
  get: () => apiCall('/settings/'),
};

// WA Templates API (Public GET)
export const waTemplatesAPI = {
  getAll: () => apiCall('/wa-templates/'),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health/'),
};

// Blog Categories API
export const blogCategoriesAPI = {
  getAll: () => apiCall('/blog-categories/'),
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: () => apiCall('/blog-posts/'),
  getBySlug: (slug: string) => apiCall(`/blog-posts/by_slug/?slug=${slug}`),
  getById: (id: number) => apiCall(`/blog-posts/${id}/`),
};

// Home Content API
export const homeContentAPI = {
  get: () => apiCall('/home-content/'),
};

// About Content API
export const aboutContentAPI = {
  get: () => apiCall('/about-content/'),
};
