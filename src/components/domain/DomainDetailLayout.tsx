
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface DomainDetailLayoutProps {
  domainTitle?: string;
  children: React.ReactNode;
}

const DomainDetailLayout = ({ domainTitle, children }: DomainDetailLayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <Link to="/" className="hover:text-foreground">Dashboard</Link>
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-foreground">{domainTitle}</span>
          </div>

          {children}
        </div>
      </main>
    </>
  );
};

export default DomainDetailLayout;
