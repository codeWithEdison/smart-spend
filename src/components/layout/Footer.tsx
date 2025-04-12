
import React from 'react';
import { ExternalLink, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 border-t mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              © {currentYear} Smart Budget Management. Developed by Code with Edison
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/codewithedison" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a 
              href="mailto:contact@example.com" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a 
              href="https://example.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Website"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
