
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DomainDetailLayout from '@/components/domain/DomainDetailLayout';
import DomainLoading from '@/components/domain/DomainLoading';
import DomainError from '@/components/domain/DomainError';
import DomainContent from '@/components/domain/DomainContent';
import { useDomainDetail, TaskForUI } from '@/hooks/useDomainDetail';
import { useUser } from '@/contexts/UserContext';

const DomainDetail = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { loading, domain, setDomain } = useDomainDetail(domainId);
  const { getAllUsers } = useUser();

  // Sync domain with user assignments when loading is complete
  useEffect(() => {
    if (!loading && domain) {
      const users = getAllUsers();
      const accountableUser = users.find(user => 
        user.permissions.accountableDomains?.includes(domain.title)
      );
      
      if (accountableUser && (!domain.responsible || domain.responsible.id !== accountableUser.id)) {
        // If domain responsible doesn't match the user permissions, update it
        setDomain(prevDomain => {
          if (!prevDomain) return null;
          
          return {
            ...prevDomain,
            responsible: {
              id: accountableUser.id,
              firstName: accountableUser.name.split(' ')[0] || '',
              lastName: accountableUser.name.split(' ')[1] || '',
              role: accountableUser.businessRole || accountableUser.role
            }
          };
        });
      }
    }
  }, [loading, domain, getAllUsers, setDomain]);

  const onSelectTask = (task: TaskForUI) => {
    if (domain) {
      navigate(`/domain/${domainId}/task/${encodeURIComponent(task.title)}`);
    }
  };

  if (loading) {
    return <DomainLoading />;
  }

  if (!domain) {
    return <DomainError />;
  }

  return (
    <DomainDetailLayout domainTitle={domain?.title}>
      <DomainContent 
        domain={domain} 
        setDomain={setDomain}
        onSelectTask={onSelectTask}
      />
    </DomainDetailLayout>
  );
};

export default DomainDetail;
