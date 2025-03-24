
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAdmin } = useUser();
  const { toast } = useToast();
  const showBackButton = location.pathname !== '/';
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully'
    });
    navigate('/login');
  };
  
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
        
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-1 mr-4">
            <NavLink to="/" exact>Dashboard</NavLink>
            <NavLink to="/domains">Domains</NavLink>
            <NavLink to="/json-view">JSON View</NavLink>
          </nav>
          
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <User className="w-4 h-4 mr-2" />
                  {currentUser.name}
                  {isAdmin && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                  <div className="text-xs font-semibold mt-1">{currentUser.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
