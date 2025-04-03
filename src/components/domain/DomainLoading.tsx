
import React from 'react';
import { Loader2 } from 'lucide-react';
import DomainDetailLayout from './DomainDetailLayout';

const DomainLoading = () => {
  return (
    <DomainDetailLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg">Loading domain data...</p>
        </div>
      </div>
    </DomainDetailLayout>
  );
};

export default DomainLoading;
