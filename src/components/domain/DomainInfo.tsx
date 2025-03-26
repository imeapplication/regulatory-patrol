
import React from 'react';
import { Domain } from '@/types/compliance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, FileText, CalendarClock } from 'lucide-react';
import AnimatedCounter from '@/components/ui-components/AnimatedCounter';

interface DomainInfoProps {
  domain: Domain;
  domainName: string | undefined;
  isAdmin: boolean;
  accountableUsers: { id: string; name: string }[];
  assignedAccountableId: string;
  onAssignAccountable: (userId: string) => void;
}

const DomainInfo = ({
  domain,
  domainName,
  isAdmin,
  accountableUsers,
  assignedAccountableId,
  onAssignAccountable,
}: DomainInfoProps) => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {domain.name}
        </h1>
        
        {isAdmin && (
          <div className="mt-4 md:mt-0 w-full md:w-64">
            <Select
              value={assignedAccountableId}
              onValueChange={onAssignAccountable}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Assign Domain Accountable" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">None</SelectItem>
                {accountableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {assignedAccountableId && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 animate-fade-in">
          <div className="flex items-center gap-2 text-blue-700">
            <UserCheck className="h-5 w-5" />
            <p className="font-medium">
              <span className="opacity-70">Domain Accountable:</span>{' '}
              {accountableUsers.find(user => user.id === assignedAccountableId)?.name}
            </p>
          </div>
        </div>
      )}

      <p className="text-gray-700 mb-8 leading-relaxed">
        {domain.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-blue-500 mb-2">
              <CalendarClock className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Estimated Effort</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              <AnimatedCounter end={domain.man_day_cost} suffix=" man-days" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-green-500 mb-2">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Total Tasks</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              <AnimatedCounter end={domain.tasks.length} />
            </div>
          </CardContent>
        </Card>
        
        {domain.accountableRole && (
          <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-purple-500 mb-2">
                <UserCheck className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Accountable Role</span>
              </div>
              <div className="text-md font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                {domain.accountableRole}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DomainInfo;
