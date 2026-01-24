import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Image, FileText } from 'lucide-react';
import { educationData } from '@/data/portfolioData';
import { useModalStore } from '@/store/modalStore';
import { ShinyButton } from '@/components/effects/Buttons';

export const EducationSection = () => {
  const { openEducationGalleryModal, openEducationDocumentModal } = useModalStore();

  return (
    <section id="education" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            Education
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            My Learning Journey
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-primary z-10" />

              {/* Content Card */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="glass-strong rounded-2xl p-6 hover:glow-primary transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold mb-1">{edu.institution}</h3>
                      <p className="text-primary font-medium">{edu.degree}</p>
                      <p className="text-muted-foreground text-sm">{edu.field}</p>
                    </div>
                  </div>

                  {/* Date & GPA */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4" />
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <Award className="w-4 h-4" />
                      GPA: {edu.gpa}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">{edu.description}</p>

                  {/* Highlights */}
                  {edu.highlights.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {edu.highlights.map((highlight) => (
                          <span
                            key={highlight.id}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            <Award className="w-3 h-3" />
                            {highlight.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => openEducationGalleryModal(edu)}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      Lihat Kampus
                    </button>
                    {edu.documents.length > 0 && (
                      <button
                        onClick={() => openEducationDocumentModal(edu.documents[0].imageUrl, edu.documents[0].title)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Lihat Ijazah
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
