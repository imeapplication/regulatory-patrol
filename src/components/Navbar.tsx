
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';
  
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md", className)}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-medium">Regulatory Patrol</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" exact>Dashboard</NavLink>
          <NavLink to="/domains">Domains</NavLink>
          <NavLink to="/json-view">JSON View</NavLink>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  exact?: boolean;
}

const NavLink = ({ children, to, exact = false }: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
  
  return (
    <a 
      href={to} 
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      )}
    >
      {children}
    </a>
  );
};

export default Navbar;
