
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task } from '@/types/compliance';
import GlassCard from '@/components/ui-components/GlassCard';
import SubTaskList from '@/components/SubTaskList';
import Badge from '@/components/ui-components/Badge';
import Navbar from '@/components/Navbar';
import { ChevronRight, Users } from 'lucide-react';

const TaskDetail = () => {
  const { domainName, taskName } = useParams<{ domainName: string; taskName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  
  useEffect(() => {
    // Try to get from location state first
    if (location.state?.domain && location.state?.task) {
      setDomain(location.state.domain);
      setTask(location.state.task);
      return;
    }
    
    // If not available in state, find in data
    if (domainName && taskName) {
      const foundDomain = complianceData.regulations.domains.find(
        d => d.name === decodeURIComponent(domainName)
      );
      
      if (foundDomain) {
        setDomain(foundDomain);
        const foundTask = foundDomain.tasks.find(
          t => t.name === decodeURIComponent(taskName)
        );
        setTask(foundTask || null);
      }
    }
  }, [domainName, taskName, location.state]);
  
  if (!domain || !task) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <GlassCard>
            <h2 className="text-xl font-medium">Task not found</h2>
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
            <a 
              href={`/domain/${encodeURIComponent(domain.name)}`}
              className="hover:text-foreground"
            >
              {domain.name}
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{task.name}</span>
          </div>
          
          <GlassCard className="mb-8 animate-slide-down">
            <h1 className="text-2xl font-semibold">{task.name}</h1>
            <p className="mt-2 text-muted-foreground">{task.description}</p>
            
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                <div className="font-medium">Estimated effort</div>
                <div className="text-xl font-semibold mt-1">{task.man_day_cost} man-days</div>
              </div>
              
              <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                <div className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Required roles</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.roles.map((role, index) => (
                    <Badge key={index} variant="primary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Subtasks</h2>
            <SubTaskList subtasks={task.subtasks} />
          </div>
        </div>
      </main>
    </>
  );
};

export default TaskDetail;
