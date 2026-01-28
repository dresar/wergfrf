export const FALLBACK_PROJECT_CATEGORIES = [
  {"id":8,"name":"Web Development","slug":"web-development"},
  {"id":9,"name":"Mobile Apps","slug":"mobile-apps"},
  {"id":10,"name":"UI/UX Design","slug":"uiux-design"}
];

export const FALLBACK_CERTIFICATE_CATEGORIES = [
  {"id":1,"name":"biasa","slug":"biasa"},
  {"id":2,"name":"Backend Development","slug":"backend-development"},
  {"id":3,"name":"Frontend Development","slug":"frontend-development"},
  {"id":4,"name":"Cloud Computing","slug":"cloud-computing"},
  {"id":5,"name":"DevOps","slug":"devops"},
  {"id":6,"name":"Data Science","slug":"data-science"}
];

export const FALLBACK_BLOG_POSTS = [
  {
    "id": 33,
    "category_details": {
      "id": 9,
      "name": "Life Hacks",
      "slug": "life-hacks",
      "description": ""
    },
    "category": {
      "id": 9,
      "name": "Life Hacks",
      "slug": "life-hacks"
    },
    "title": "The Future of Life Hacks: Insight 1",
    "slug": "the-future-of-life-hacks-insight-1",
    "excerpt": "Discover the latest trends and techniques in Life Hacks. This article covers everything you need to know about Insight 1.",
    "content": "<h2>Introduction</h2><p>Welcome to this comprehensive guide about <strong>The Future of Life Hacks: Insight 1</strong>. In this article, we will explore the key concepts and practical applications of this topic in the realm of Life Hacks.</p><p><img src=\"https://picsum.photos/seed/The Future of Life Hacks: Insight 1-1/800/600\" alt=\"Illustration 1\" /></p><h3>Why This Matters</h3><p>Understanding these principles is crucial for modern developers. Whether you are a beginner or an expert, mastering these skills will significantly enhance your productivity.</p><h3>Key Takeaways</h3><ul><li>Fundamental concepts explained simply.</li><li>Real-world examples and use cases.</li><li>Best practices for implementation.</li></ul><p><img src=\"https://picsum.photos/seed/The Future of Life Hacks: Insight 1-2/800/600\" alt=\"Illustration 2\" /></p><h3>Deep Dive</h3><p>Let's look closer at the implementation details. The code structure should be clean and maintainable. Always consider scalability when designing your solutions.</p><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/kUMe1FH4CHE\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe><h3>Conclusion</h3><p>We hope this article has provided valuable insights.</p>",
    "thumbnail": "https://picsum.photos/seed/life-hacks-1/800/600",
    "cover_image": null,
    "created_at": "2026-01-25T12:00:00Z",
    "updated_at": "2026-01-25T12:00:00Z",
    "is_published": true,
    "author": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    }
  }
];

export const FALLBACK_PROJECTS = [
  {
    "id": 44,
    "images": [
      {
        "id": 1,
        "image": "https://porto.apprentice.cyou/media/projects/gallery/Purple_Modern_Digital_Marketing_LinkedIn_Banner_1.png",
        "caption": "",
        "order": 0
      },
      {
        "id": 2,
        "image": "https://porto.apprentice.cyou/media/projects/gallery/row-1-column-3.png",
        "caption": "",
        "order": 0
      },
      {
        "id": 3,
        "image": "https://porto.apprentice.cyou/media/projects/gallery/1.webp",
        "caption": "",
        "order": 0
      }
    ],
    "category_details": {
      "id": 9,
      "name": "Mobile Apps",
      "slug": "mobile-apps"
    },
    "summaries": [],
    "title": "Mobile Apps Project 1: Beta System",
    "description": "A high-performance mobile apps solution designed to optimize workflow and enhance user productivity. Built with modern technologies.",
    "content": "<h3>About This Project</h3><p>This is a comprehensive dummy project generated for testing purposes. It simulates a real-world application in the <strong>Mobile Apps</strong> domain. The project focuses on solving core user problems through intuitive design and robust engineering.</p><p>Key challenges included handling large datasets and ensuring sub-second response times. We utilized modern caching strategies and optimized database queries to achieve this.</p><h3>Technical Implementation</h3><ul><li><p>Implemented secure authentication using JWT.</p></li><li><p>Designed a responsive UI mobile-first approach.</p></li><li><p>Integrated third-party APIs for payment processing.</p></li></ul><p>The outcome was a 40% increase in user engagement and positive feedback from early adopters.</p>",
    "thumbnail": "https://picsum.photos/seed/mobile-apps-1/800/600",
    "cover_image": null,
    "video_file": null,
    "techStack": [
      "Python",
      "Django",
      "TypeScript",
      "Docker"
    ],
    "demoUrl": "https://example.com/demo",
    "repoUrl": "https://github.com/example/repo",
    "video_url": "https://www.youtube.com/watch?v=SqcY0GlETPk",
    "is_featured": true,
    "links": [],
    "order": 1,
    "createdAt": "2026-01-25T19:50:29.617379+07:00",
    "updatedAt": "2026-01-27T04:57:34.673705+07:00",
    "is_published": true,
    "publish_at": null,
    "category": 9
  }
];

export const FALLBACK_SKILLS = [
  {
    "id": 1,
    "category_details": {
      "id": 1,
      "name": "Frontend Development",
      "slug": "frontend-development"
    },
    "name": "React",
    "percentage": 61,
    "category": 1
  },
  {
    "id": 2,
    "category_details": {
      "id": 1,
      "name": "Frontend Development",
      "slug": "frontend-development"
    },
    "name": "Vue.js",
    "percentage": 87,
    "category": 1
  },
  {
    "id": 6,
    "category_details": {
      "id": 2,
      "name": "Backend Development",
      "slug": "backend-development"
    },
    "name": "Python",
    "percentage": 79,
    "category": 2
  },
  {
    "id": 7,
    "category_details": {
      "id": 2,
      "name": "Backend Development",
      "slug": "backend-development"
    },
    "name": "Django",
    "percentage": 86,
    "category": 2
  }
];

export const FALLBACK_EXPERIENCE = [
  {
    "id": 12,
    "role": "Mid-Level Developer",
    "company": "Startup Inc 2",
    "description": "Responsible for backend API development, frontend integration, and mentoring junior developers. Achieved 20% performance improvement in legacy systems.",
    "startDate": "2024-01-26",
    "endDate": "2024-11-21",
    "isCurrent": false,
    "location": "Remote"
  },
  {
    "id": 17,
    "role": "Mid-Level Developer",
    "company": "Startup Inc 7",
    "description": "Responsible for backend API development, frontend integration, and mentoring junior developers. Achieved 20% performance improvement in legacy systems.",
    "startDate": "2019-01-27",
    "endDate": "2019-11-23",
    "isCurrent": false,
    "location": "Jakarta, Indonesia"
  }
];

export const FALLBACK_EDUCATION = [
    {
        "id": 1,
        "institution": "Universitas Sumatera Utara",
        "degree": "Bachelor of Computer Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2017-08-01",
        "endDate": "2021-08-01",
        "description": "Graduated with honors."
    }
];

export const FALLBACK_PROFILE = {
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

export const FALLBACK_SETTINGS = {
    "id": 1,
    "theme": "dark",
    "seoTitle": "My Portfolio",
    "seoDesc": "Welcome to my portfolio website",
    "cdn_url": null,
    "maintenanceMode": false,
    "maintenance_end_time": "2026-01-28T03:17:00+07:00",
    "ai_provider": "gemini"
};

export const FALLBACK_CERTIFICATES = [
  {"id":13,"category_details":{"id":4,"name":"Cloud Computing","slug":"cloud-computing"},"name":"Certified Developer Level 1","issuer":"Coursera","issueDate":"2025-04-08","expiryDate":"2027-01-25","credentialUrl":"https://example.com/cert","image":"https://picsum.photos/seed/cert0/400/300","verified":true,"credentialId":"CERT-59982","category":4},
  {"id":14,"category_details":{"id":3,"name":"Frontend Development","slug":"frontend-development"},"name":"Certified Developer Level 2","issuer":"Udemy","issueDate":"2024-09-12","expiryDate":null,"credentialUrl":"https://example.com/cert","image":"https://picsum.photos/seed/cert1/400/300","verified":true,"credentialId":"CERT-77274","category":3}
];

export const FALLBACK_SKILL_CATEGORIES = [
  {"id":1,"name":"Frontend Development","slug":"frontend-development"},
  {"id":2,"name":"Backend Development","slug":"backend-development"},
  {"id":3,"name":"Database Management","slug":"database-management"},
  {"id":4,"name":"DevOps & Cloud","slug":"devops-cloud"},
  {"id":5,"name":"Soft Skills","slug":"soft-skills"},
  {"id":6,"name":"biasa","slug":"biasa"}
];

export const FALLBACK_SOCIAL_LINKS = [
  {"id":21,"platform":"dev.to","url":"https://dev.to/eka","icon":"dev.to"},
  {"id":22,"platform":"website","url":"https://eka.com","icon":"website"},
  {"id":23,"platform":"WhatsApp","url":"https://wa.me/6282392115909","icon":"MessageCircle"}
];
