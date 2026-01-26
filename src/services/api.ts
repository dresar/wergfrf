// API Service untuk koneksi ke backend
const API_BASE_URL = "https://porto.apprentice.cyou/api";

// Helper function untuk API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (optional: redirect to login or clear token)
        // localStorage.removeItem('token');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
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
  create: (data: any) => apiCall('/profile/', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/profile/${id}/`, { method: 'PATCH', body: data instanceof FormData ? data : JSON.stringify(data) }),
};

// Projects API
export const projectsAPI = {                                                                        
  getAll: () => apiCall('/projects/'),
  getById: (id: number) => apiCall(`/projects/${id}/`),
  create: (data: any) => apiCall('/projects/', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/projects/${id}/`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/projects/${id}/`, { method: 'DELETE' }),
  deleteImage: (projectId: number, imageId: number) => apiCall(`/projects/${projectId}/delete_image/`, { method: 'POST', body: JSON.stringify({ image_id: imageId }) }),
  reorder: (items: { id: number; order: number }[]) => apiCall('/projects/reorder/', { method: 'POST', body: JSON.stringify({ items }) }),
};

// Project Categories API
export const projectCategoriesAPI = {
  getAll: () => apiCall('/project-categories/'),
  create: (data: any) => apiCall('/project-categories/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/project-categories/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/project-categories/${id}/`, { method: 'DELETE' }),
};

// Experience API
export const experienceAPI = {
  getAll: () => apiCall('/experience/'),
  create: (data: any) => apiCall('/experience/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/experience/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/experience/${id}/`, { method: 'DELETE' }),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiCall('/skills/'),
  create: (data: any) => apiCall('/skills/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/skills/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/skills/${id}/`, { method: 'DELETE' }),
};

// Skill Categories API
export const skillCategoriesAPI = {
  getAll: () => apiCall('/skill-categories/'),
  create: (data: any) => apiCall('/skill-categories/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/skill-categories/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/skill-categories/${id}/`, { method: 'DELETE' }),
};

// Certificate Categories API
export const certificateCategoriesAPI = {
  getAll: () => apiCall('/certificate-categories/'),
  create: (data: any) => apiCall('/certificate-categories/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/certificate-categories/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/certificate-categories/${id}/`, { method: 'DELETE' }),
};

// Education API
export const educationAPI = {
  getAll: () => apiCall('/education/'),
  create: (data: any) => apiCall('/education/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/education/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/education/${id}/`, { method: 'DELETE' }),
};

// Certificates API
export const certificatesAPI = {
  getAll: () => apiCall('/certificates/'),
  create: (data: any) => apiCall('/certificates/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/certificates/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/certificates/${id}/`, { method: 'DELETE' }),
};

// Social Links API
export const socialLinksAPI = {
  getAll: () => apiCall('/social-links/'),
  create: (data: any) => apiCall('/social-links/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/social-links/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/social-links/${id}/`, { method: 'DELETE' }),
};

// Messages API
export const messagesAPI = {
  getAll: () => apiCall('/messages/'),
  create: (data: any) => apiCall('/messages/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/messages/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/messages/${id}/`, { method: 'DELETE' }),
};

// Site Settings API
export const siteSettingsAPI = {
  get: () => apiCall('/settings/'),
  create: (data: any) => apiCall('/settings/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/settings/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
};

// WA Templates API
export const waTemplatesAPI = {
  getAll: () => apiCall('/wa-templates/'),
  create: (data: any) => apiCall('/wa-templates/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/wa-templates/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/wa-templates/${id}/`, { method: 'DELETE' }),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health/'),
};

// Media Upload API
export const mediaAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall('/upload/', { method: 'POST', body: formData });
  }
};

// Blog Categories API
export const blogCategoriesAPI = {
  getAll: () => apiCall('/blog-categories/'),
  create: (data: any) => apiCall('/blog-categories/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/blog-categories/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/blog-categories/${id}/`, { method: 'DELETE' }),
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: () => apiCall('/blog-posts/'),
  getBySlug: (slug: string) => apiCall(`/blog-posts/by_slug/?slug=${slug}`),
  getById: (id: number) => apiCall(`/blog-posts/${id}/`),
  create: (data: any) => apiCall('/blog-posts/', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/blog-posts/${id}/`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/blog-posts/${id}/`, { method: 'DELETE' }),
};
