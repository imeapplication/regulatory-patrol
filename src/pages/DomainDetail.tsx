
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task } from '@/types/compliance';
import GlassCard from '@/components/ui-components/GlassCard';
import TaskList from '@/components/TaskList';
import Navbar from '@/components/Navbar';
import { ChevronRight } from 'lucide-react';

const DomainDetail = () => {
  const { domainName } = useParams<{ domainName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [domain, setDomain] = useState<Domain | null>(null);
  
  useEffect(() => {
    // Try to get domain from location state first
    if (location.state?.domain) {
      setDomain(location.state.domain);
      return;
    }
    
    // If not available in state, find in data
    if (domainName) {
      const foundDomain = complianceData.regulations.domains.find(
        d => d.name === decodeURIComponent(domainName)
      );
      setDomain(foundDomain || null);
    }
  }, [domainName, location.state]);
  
  const handleSelectTask = (task: Task) => {
    navigate(`/domain/${encodeURIComponent(domain?.name || '')}/task/${encodeURIComponent(task.name)}`, {
      state: { domain, task }
    });
  };
  
  if (!domain) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <GlassCard>
            <h2 className="text-xl font-medium">Domain not found</h2>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-primary hover:underline"
            >
              Return to Dashboard
            </button>
          </GlassCard>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <a href="/" className="hover:text-foreground">Dashboard</a>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{domain.name}</span>
          </div>
          
          <GlassCard className="mb-8 animate-slide-down">
            <h1 className="text-2xl font-semibold">{domain.name}</h1>
            <p className="mt-2 text-muted-foreground">{domain.description}</p>
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
              <div className="font-medium">Estimated effort: {domain.man_day_cost} man-days</div>
            </div>
          </GlassCard>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Tasks</h2>
            <TaskList tasks={domain.tasks} onSelectTask={handleSelectTask} />
          </div>
        </div>
      </main>
    </>
  );
};

export default DomainDetail;
