import { create } from 'zustand';
import type { Project, Education, Certificate } from '@/types';

export type ModalType = 'project' | 'education-gallery' | 'education-document' | 'certificate' | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  projectData: Project | null;
  educationData: Education | null;
  documentUrl: string | null;
  documentTitle: string | null;
  certificateData: Certificate | null;
  
  openProjectModal: (project: Project) => void;
  openEducationGalleryModal: (education: Education) => void;
  openEducationDocumentModal: (url: string, title: string) => void;
  openCertificateModal: (certificate: Certificate) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  projectData: null,
  educationData: null,
  documentUrl: null,
  documentTitle: null,
  certificateData: null,

  openProjectModal: (project) => set({
    isOpen: true,
    modalType: 'project',
    projectData: project,
  }),

  openEducationGalleryModal: (education) => set({
    isOpen: true,
    modalType: 'education-gallery',
    educationData: education,
  }),

  openEducationDocumentModal: (url, title) => set({
    isOpen: true,
    modalType: 'education-document',
    documentUrl: url,
    documentTitle: title,
  }),

  openCertificateModal: (certificate) => set({
    isOpen: true,
    modalType: 'certificate',
    certificateData: certificate,
  }),

  closeModal: () => set({
    isOpen: false,
    modalType: null,
    projectData: null,
    educationData: null,
    documentUrl: null,
    documentTitle: null,
    certificateData: null,
  }),
}));
