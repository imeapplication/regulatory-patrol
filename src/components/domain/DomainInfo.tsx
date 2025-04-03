
import React from 'react';
import { DomainForUI } from '@/hooks/useDomainDetail';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { UserRole } from '@/types/compliance';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentText, Calendar, Users } from 'lucide-react';

interface DomainInfoProps {
  domain: DomainForUI;
  canEdit: boolean;
  onResponsibleChange: (userId: string) => void;
}

const DomainInfo = ({ domain, canEdit, onResponsibleChange }: DomainInfoProps) => {
  const { getAllUsers } = useUser();
  const { getAllocationHistory } = useAllocationHistory();
  const users = getAllUsers();
  const allocationHistory = getAllocationHistory();
  
  // Filter users who can be responsible (Domain Accountable role)
  const accountableUsers = users.filter(user => 
    user.role === UserRole.DomainAccountable
  );
  
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Find when the current responsible user was assigned
  const getAssignmentDate = () => {
    if (!domain.responsible?.id) return null;
    
    const ownerHistory = allocationHistory.filter(
      entry => entry.userId === domain.responsible?.id && 
              entry.domainName === domain.title && 
              entry.action === 'assigned'
    );
    
    if (ownerHistory.length > 0) {
      // Sort by timestamp, newest first
      ownerHistory.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      return formatDate(ownerHistory[0].timestamp);
    }
    
    return null;
  };
  
  const assignmentDate = getAssignmentDate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{domain.title}</h1>
      {domain.description && <p className="text-gray-600 mb-6">{domain.description}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <DocumentText className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Effort</div>
            <div className="font-medium">{domain.mandays} man-days</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Timeline</div>
            <div className="font-medium">
              {formatDate(domain.startDate)} - {formatDate(domain.endDate)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Accountable</div>
            <div className="font-medium">
              {canEdit ? (
                <div>
                  <Select 
                    value={domain.responsible?.id} 
                    onValueChange={onResponsibleChange}
                  >
                    <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto">
                      <SelectValue placeholder="Assign accountable">
                        {domain.responsible ? 
                          `${domain.responsible.firstName} ${domain.responsible.lastName}`.trim() : 
                          "Unassigned"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50 shadow-md">
                      {accountableUsers.length > 0 ? (
                        accountableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} {user.businessRole && `(${user.businessRole})`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No Domain Accountable users available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {assignmentDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Assigned since {assignmentDate}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {domain.responsible ? 
                    <span>
                      {`${domain.responsible.firstName} ${domain.responsible.lastName}`.trim()}
                      <span className="ml-2 text-xs text-gray-500">({domain.responsible.role})</span>
                    </span> : 
                    <span className="text-gray-400 italic">Not assigned</span>}
                  
                  {assignmentDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Assigned since {assignmentDate}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {domain.documentLink && (
        <div className="mt-4 flex items-center">
          <DocumentText className="h-4 w-4 mr-2 text-blue-500" />
          <a 
            href={domain.documentLink}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            View documentation
          </a>
        </div>
      )}
    </div>
  );
};

export default DomainInfo;
