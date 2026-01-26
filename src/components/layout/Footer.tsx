import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { useProfile } from '@/hooks/useProfile';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';
import { FloatingWhatsApp } from '../effects/FloatingWhatsApp'; // Import FloatingWhatsApp logic/component if needed separately or trigger it

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { socialLinks = [] } = useSocialLinks();
  const { profile } = useProfile();
  const { settings } = useSettings();
  const [waModalOpen, setWaModalOpen] = useState(false);

  const logoText = settings?.siteName || profile?.fullName?.split(' ')[0] || 'Portfolio';
  const logoFirstLetter = logoText.charAt(0);
  const logoRest = logoText.slice(1);

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-xl font-heading font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-primary">{logoFirstLetter}</span>{logoRest}
            <span className="text-primary">.</span>
          </motion.a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} {profile?.fullName}. Made with{' '}
            <Heart className="w-4 h-4 inline text-destructive mx-1" fill="currentColor" />
            in Indonesia
          </p>

          {/* Quick Links */}
          <div className="flex gap-4">
            {socialLinks.slice(0, 4).map((social) => {
              const isWhatsApp = (social.platform || '').toLowerCase() === 'whatsapp' || 
                               social.url.includes('wa.me') || 
                               social.url.includes('whatsapp.com');

              if (isWhatsApp) {
                return (
                  <button
                    key={social.id}
                    onClick={() => setWaModalOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {social.platform}
                  </button>
                );
              }

              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.platform}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <FloatingWhatsApp forceOpen={waModalOpen} onClose={() => setWaModalOpen(false)} />
    </footer>
  );
};
