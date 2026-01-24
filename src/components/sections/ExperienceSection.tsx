import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';
import { experienceData, organizationData } from '@/data/portfolioData';

export const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 md:py-32 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            Experience
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Work & Organization
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and organizational involvement.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-primary" />
              Work Experience
            </h3>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

              {experienceData.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="relative pl-12 pb-8 last:pb-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2 w-4 h-4 rounded-full bg-primary glow-primary" />

                  {/* Card */}
                  <div className="group glass-strong rounded-xl p-6 hover:glow-primary transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {exp.position}
                        </h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      {exp.isCurrent && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary animate-pulse">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(exp.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'Present'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4">{exp.description}</p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {exp.details.map((detail) => (
                        <li key={detail.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">▹</span>
                          {detail.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              Organizations
            </h3>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

              {organizationData.map((org, index) => (
                <motion.div
                  key={org.id}
                  className="relative pl-12 pb-8 last:pb-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2 w-4 h-4 rounded-full bg-primary glow-primary" />

                  {/* Card */}
                  <div className="group glass-strong rounded-xl p-6 hover:glow-primary transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {org.role}
                        </h4>
                        <p className="text-primary font-medium">{org.name}</p>
                      </div>
                      {org.isCurrent && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary animate-pulse">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(org.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })} - {org.endDate ? new Date(org.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'Present'}
                    </div>

                    <p className="text-muted-foreground text-sm">{org.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
