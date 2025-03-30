
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_DOMAINS, GET_USERS } from '@/graphql/queries';
import { Domain } from '@/types/graphqlTypes';
import GlassCard from '@/components/ui-components/GlassCard';
import DomainCard from '@/components/DomainCard';
import AnimatedCounter from '@/components/ui-components/AnimatedCounter';
import TimeDisplay from '@/components/ui-components/TimeDisplay';
import Navbar from '@/components/Navbar';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon, RotateCcw, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isHistoricalView, setIsHistoricalView] = useState(false);
  
  const { loading: loadingDomains, error: domainsError, data: domainsData } = useQuery(GET_DOMAINS);
  const { loading: loadingUsers, error: usersError, data: usersData } = useQuery(GET_USERS);
  
  const loading = loadingDomains || loadingUsers;
  const error = domainsError || usersError;
  
  const domains = domainsData?.domains || [];
  
  const handleDomainClick = (domain: Domain) => {
    navigate(`/domain/${domain.id}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsHistoricalView(true);
    }
  };

  const resetToCurrentView = () => {
    setSelectedDate(new Date());
    setIsHistoricalView(false);
  };
  
  // Calculate total mandays
  const totalManDays = domains.reduce((sum: number, domain: Domain) => sum + domain.mandays, 0);
  
  // Get unique roles from users
  const allRoles = new Set<string>();
  if (usersData?.users) {
    usersData.users.forEach((user: any) => {
      if (user.role) {
        allRoles.add(user.role);
      }
    });
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg">Loading compliance data...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-red-800 mb-2">Error loading data</h2>
              <p className="text-red-600">{error.message}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="animate-slide-down">
                <h1 className="text-3xl md:text-4xl font-semibold mb-3">Regulatory Compliance</h1>
                <p className="text-muted-foreground max-w-3xl">
                  Manage your company's regulatory compliance requirements
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                <TimeDisplay className="mb-2 md:mb-0" />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                {isHistoricalView && (
                  <Button variant="ghost" size="icon" onClick={resetToCurrentView} title="Reset to current view">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {isHistoricalView && (
              <div className="bg-blue-50 p-3 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100">Historical View</Badge>
                  <span className="text-sm text-blue-800">
                    Showing data as of {format(selectedDate!, 'PPP')}
                  </span>
                </div>
              </div>
            )}
            
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
                  <AnimatedCounter end={domains.length} />
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
              {domains.map((domain: Domain) => (
                <DomainCard 
                  key={domain.id}
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
