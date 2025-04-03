
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DomainDetailLayout from '@/components/domain/DomainDetailLayout';
import DomainLoading from '@/components/domain/DomainLoading';
import DomainError from '@/components/domain/DomainError';
import DomainContent from '@/components/domain/DomainContent';
import { useDomainDetail, TaskForUI } from '@/hooks/useDomainDetail';

const DomainDetail = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { loading, domain, setDomain } = useDomainDetail(domainId);

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
