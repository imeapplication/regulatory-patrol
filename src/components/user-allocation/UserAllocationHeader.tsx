
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { User } from '@/types/compliance';

interface UserAllocationHeaderProps {
  user: User;
  createdAt: string;
}

const UserAllocationHeader = ({ user, createdAt }: UserAllocationHeaderProps) => {
  return (
    <>
      <div className="text-center text-xl font-bold">{user.name}</div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>{user.email}</span>
          <span>•</span>
          <span className="capitalize">{user.role}</span>
        </div>
      </div>
      
      <div className="mb-6 mt-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">Account Created</div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(createdAt), 'PPP')}</span>
        </div>
      </div>
    </>
  );
};

export default UserAllocationHeader;
