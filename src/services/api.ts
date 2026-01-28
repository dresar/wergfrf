// API Service untuk koneksi ke backend
const DIRECT_URL = "/api";

const FALLBACK_PROFILE = {
    "id": 1,
    "fullName": "Eka Syarif Maulana",
    "greeting": "Selamat Datang",
    "role": "[\"Developer\",\"Designer\"]",
    "bio": "",
    "heroImage": "https://porto.apprentice.cyou/media/profile/Untitled_design.png",
    "heroImageFile": "https://porto.apprentice.cyou/media/profile/Untitled_design.png",
    "aboutImage": "https://porto.apprentice.cyou/media/profile/Gemini_Generated_Image_d7i0h6d7i0h6d7i0.png",
    "aboutImageFile": "https://porto.apprentice.cyou/media/profile/Gemini_Generated_Image_d7i0h6d7i0h6d7i0.png",
    "resumeUrl": "",
    "resumeFile": "https://porto.apprentice.cyou/media/resume/Biru_Kuning_Modern_Presentasi_Seminar_Proposal_1.pdf",
    "location": "medan city",
    "email": "eka.ckp16799@gmail.com",
    "phone": "6282392115909",
    "stats_project_count": "29",
    "stats_exp_years": "5",
    "map_embed_url": null,
    "total_certificates": 12,
    "total_skills": 22
};

const FALLBACK_SETTINGS = {
    "id": 1,
    "theme": "dark",
    "seoTitle": "My Portfolio",
    "seoDesc": "Welcome to my portfolio website",
    "cdn_url": null,
    "maintenanceMode": false,
    "maintenance_end_time": "2026-01-28T03:17:00+07:00",
    "ai_provider": "gemini"
};

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
