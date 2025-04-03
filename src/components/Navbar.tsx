
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, UserCog, ScrollText, UserCheck, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useUser();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-blue-600">CLA</Link>
            
            <nav className="hidden md:flex gap-1">
              <Button
                variant={isActive('/') ? "secondary" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/">Dashboard</Link>
              </Button>
              
              <Button
                variant={isActive('/json-view') ? "secondary" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/json-view">JSON View</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <span>Administration</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/users">
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>User Management</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/roles">
                      <UserCheck className="mr-2 h-4 w-4" />
                      <span>Compliance Roles</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/business-roles">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>Business Roles</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/domain-allocation">
                      <ScrollText className="mr-2 h-4 w-4" />
                      <span>Domain Allocation</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/user-timeline">
                      <Menu className="mr-2 h-4 w-4" />
                      <span>Timeline</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-gray-500">{currentUser.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
