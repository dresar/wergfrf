import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, User, Clock, Target, Lightbulb, TrendingUp, ChevronLeft, ChevronRight, Award, FileText, Building } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import { useState } from 'react';

export const GlobalModal = () => {
  const { isOpen, modalType, projectData, educationData, documentUrl, documentTitle, certificateData, closeModal } = useModalStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const nextImage = () => {
    if (educationData?.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % educationData.gallery.length);
    }
    if (projectData?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % projectData.images.length);
    }
  };

  const prevImage = () => {
    if (educationData?.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + educationData.gallery.length) % educationData.gallery.length);
    }
    if (projectData?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + projectData.images.length) % projectData.images.length);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-foreground"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Project Modal */}
            {modalType === 'project' && projectData && (
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary mb-4">
                    {projectData.category.toUpperCase()}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{projectData.title}</h2>
                  <p className="text-muted-foreground text-lg">{projectData.fullDescription}</p>
                </div>

                {/* Image Gallery */}
                <div className="relative mb-8 rounded-xl overflow-hidden bg-muted aspect-video">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-lg">Project Screenshot {currentImageIndex + 1}</span>
                  </div>
                  {projectData.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Project Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm">Client</span>
                        </div>
                        <p className="font-medium">{projectData.modalDetails.client}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Duration</span>
                        </div>
                        <p className="font-medium">{projectData.modalDetails.duration}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">Role</span>
                        </div>
                        <p className="font-medium">{projectData.modalDetails.role}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <p className="font-medium">{new Date(projectData.completedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectData.technologies.map((tech) => (
                          <span
                            key={tech.id}
                            className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Challenges */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-destructive" />
                        <h4 className="font-semibold">Challenges</h4>
                      </div>
                      <ul className="space-y-2">
                        {projectData.modalDetails.challenges.map((challenge) => (
                          <li key={challenge.id} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-destructive mt-1">•</span>
                            {challenge.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Solutions</h4>
                      </div>
                      <ul className="space-y-2">
                        {projectData.modalDetails.solutions.map((solution) => (
                          <li key={solution.id} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            {solution.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Results</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {projectData.modalDetails.results.map((result) => (
                      <div key={result.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                        <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{result.value}</p>
                        <p className="text-sm text-muted-foreground">{result.metric}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  {projectData.liveUrl && (
                    <a
                      href={projectData.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {projectData.githubUrl && (
                    <a
                      href={projectData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Education Gallery Modal */}
            {modalType === 'education-gallery' && educationData && (
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">{educationData.institution}</h2>
                
                {/* Gallery Carousel */}
                <div className="relative mb-6 rounded-xl overflow-hidden bg-muted aspect-video">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-lg">{educationData.gallery[currentImageIndex]?.caption || 'Gallery Image'}</span>
                  </div>
                  {educationData.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {educationData.gallery.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-muted ${
                        currentImageIndex === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Education Document Modal */}
            {modalType === 'education-document' && documentUrl && (
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  {documentTitle}
                </h2>
                <div className="rounded-xl overflow-hidden bg-muted aspect-[3/4] max-h-[70vh] flex items-center justify-center">
                  <span className="text-muted-foreground">Document Preview</span>
                </div>
              </div>
            )}

            {/* Certificate Modal */}
            {modalType === 'certificate' && certificateData && (
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">{certificateData.title}</h2>
                    <p className="text-muted-foreground">{certificateData.issuer}</p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden bg-muted aspect-[4/3] mb-6 flex items-center justify-center">
                  <span className="text-muted-foreground">Certificate Image</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="px-4 py-2 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Issue Date: </span>
                    <span className="font-medium">{new Date(certificateData.issueDate).toLocaleDateString()}</span>
                  </div>
                  {certificateData.credentialId && (
                    <div className="px-4 py-2 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Credential ID: </span>
                      <span className="font-medium">{certificateData.credentialId}</span>
                    </div>
                  )}
                </div>

                {certificateData.credentialUrl && (
                  <a
                    href={certificateData.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Verify Certificate
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
