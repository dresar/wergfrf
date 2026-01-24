import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skillsData, techStackData } from '@/data/portfolioData';
import { TiltedCard } from '@/components/effects/Cards';
import { Code2, Palette, Users, Globe } from 'lucide-react';

const categories = [
  { id: 'technical', label: 'Technical', icon: Code2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'soft', label: 'Soft Skills', icon: Users },
  { id: 'language', label: 'Languages', icon: Globe },
];

export const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const filteredSkills = skillsData.filter((skill) => skill.category === activeTab);

  return (
    <section id="skills" className="py-20 md:py-32 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            My Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical abilities, design skills, and soft skills.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Skills Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filteredSkills.map((skill, index) => (
            <TiltedCard key={skill.id}>
              <div className="p-6 rounded-xl bg-card border border-border h-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">{skill.name}</h4>
                  <span className="text-primary font-bold">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-[hsl(180,80%,50%)] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${skill.level}%` : 0 }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </TiltedCard>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-heading font-bold text-center mb-8">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techStackData.map((tech, index) => (
              <motion.div
                key={tech.id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-card border border-border group-hover:border-primary group-hover:glow-primary transition-all duration-300">
                  <span className="text-2xl">{tech.icon}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="px-3 py-1 rounded-lg bg-popover text-popover-foreground text-sm whitespace-nowrap shadow-lg">
                    {tech.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
