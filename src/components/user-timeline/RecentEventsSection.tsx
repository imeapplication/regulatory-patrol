
import React from 'react';
import { format, parseISO } from 'date-fns';
import { History } from 'lucide-react';
import { User } from '@/types/compliance';

interface RecentEventsSectionProps {
  recentEvents: any[];
  users: User[];
}

const RecentEventsSection = ({ recentEvents, users }: RecentEventsSectionProps) => {
  if (recentEvents.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          Recent Allocation Events
        </h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {recentEvents.map((event, index) => {
            const user = users.find(u => u.id === event.userId);
            const roleText = {
              'DomainAccountable': 'Domain Accountable',
              'DomainManager': 'Domain Manager',
              'TaskManager': 'Task Manager'
            }[event.role] || event.role;

            return (
              <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    was {event.action === 'assigned' ? 'assigned to' : 'removed from'}{' '}
                    {event.taskName ? (
                      <>
                        task <span className="font-medium">{event.taskName}</span> in domain {event.domainName}
                      </>
                    ) : (
                      <>domain <span className="font-medium">{event.domainName}</span></>
                    )}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    Role: {roleText}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(parseISO(event.timestamp), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentEventsSection;
