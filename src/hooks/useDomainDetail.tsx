
import { useState, useEffect } from 'react';
import { complianceData } from '@/data/complianceData';
import { Domain as ComplianceDomain } from '@/types/compliance';
import { User } from '@/types/graphqlTypes';

export interface DomainForUI {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  responsible?: User;
  startDate: string;
  endDate: string;
  mandays: number;
  tasks?: TaskForUI[];
}

export interface TaskForUI {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  startDate: string;
  endDate: string;
  mandays: number;
  status: number;
  owner?: User;
  subtasks?: TaskForUI[];
  actions?: any[];
}

export const useDomainDetail = (domainId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<DomainForUI | null>(null);
  
  useEffect(() => {
    setLoading(true);
    if (domainId) {
      const complianceDomain = complianceData.regulations.domains.find(
        (d: ComplianceDomain) => d.name === decodeURIComponent(domainId)
      );
      
      if (complianceDomain) {
        const mappedDomain: DomainForUI = {
          id: complianceDomain.name,
          title: complianceDomain.name,
          description: complianceDomain.description,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          mandays: complianceDomain.man_day_cost,
          responsible: complianceDomain.accountableRole ? {
            id: '1',
            firstName: complianceDomain.accountableRole,
            lastName: '',
            role: complianceDomain.accountableRole
          } : undefined,
          tasks: complianceDomain.tasks.map(task => ({
            id: task.name,
            title: task.name,
            description: task.description,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            mandays: task.man_day_cost,
            status: 0,
            owner: task.roles && task.roles.length > 0 ? {
              id: '1',
              firstName: task.roles[0],
              lastName: '',
              role: task.roles[0]
            } : undefined
          }))
        };
        
        setDomain(mappedDomain);
      }
    }
    setLoading(false);
  }, [domainId]);

  return {
    loading,
    domain,
    setDomain
  };
};
