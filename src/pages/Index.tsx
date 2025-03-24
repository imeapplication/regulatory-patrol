
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task } from '@/types/compliance';
import GlassCard from '@/components/ui-components/GlassCard';
import DomainCard from '@/components/DomainCard';
import AnimatedCounter from '@/components/ui-components/AnimatedCounter';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();
  const { regulations } = complianceData;
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  
  // Calculate total man-days
  const totalManDays = regulations.domains.reduce((sum, domain) => sum + domain.man_day_cost, 0);
  
  // Get all roles across the data
  const allRoles = new Set<string>();
  regulations.domains.forEach(domain => {
    domain.tasks.forEach(task => {
      task.roles.forEach(role => allRoles.add(role));
    });
  });
  
  const handleDomainClick = (domain: Domain) => {
    navigate(`/domain/${encodeURIComponent(domain.name)}`, { state: { domain } });
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <section className="mb-12">
            <div className="animate-slide-down">
              <h1 className="text-3xl md:text-4xl font-semibold text-center mb-3">Regulatory Compliance</h1>
              <p className="text-center text-muted-foreground max-w-3xl mx-auto">
                {regulations.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <GlassCard className="text-center">
                <h3 className="text-lg font-medium mb-2">Total Effort</h3>
                <p className="text-3xl font-semibold text-primary">
                  <AnimatedCounter end={totalManDays} suffix=" man-days" />
                </p>
              </GlassCard>
              
              <GlassCard className="text-center">
                <h3 className="text-lg font-medium mb-2">Domains</h3>
                <p className="text-3xl font-semibold text-primary">
                  <AnimatedCounter end={regulations.domains.length} />
                </p>
              </GlassCard>
              
              <GlassCard className="text-center">
                <h3 className="text-lg font-medium mb-2">Required Roles</h3>
                <p className="text-3xl font-semibold text-primary">
                  <AnimatedCounter end={allRoles.size} />
                </p>
              </GlassCard>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Compliance Domains</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regulations.domains.map((domain, index) => (
                <DomainCard 
                  key={`${domain.name}-${index}`}
                  domain={domain}
                  onClick={() => handleDomainClick(domain)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Index;
