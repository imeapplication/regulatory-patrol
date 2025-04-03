
import React from 'react';
import { Domain, User } from '@/types/compliance';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DomainTableProps {
  domains: Domain[];
  users: User[];
  assignments: {[key: string]: string};
  onAssignUser: (domainName: string, userId: string | null) => void;
  label: string;
}

const DomainTable = ({ 
  domains, 
  users, 
  assignments, 
  onAssignUser,
  label 
}: DomainTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Assigned {label}</TableHead>
          <TableHead className="w-48">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <TableRow key={`${label.toLowerCase()}-${domain.name}`}>
            <TableCell className="font-medium">{domain.name}</TableCell>
            <TableCell className="max-w-md truncate">{domain.description}</TableCell>
            <TableCell>
              {assignments[domain.name] ? (
                users.find(user => user.id === assignments[domain.name])?.name || 'Unknown'
              ) : (
                <span className="text-gray-400">Not assigned</span>
              )}
            </TableCell>
            <TableCell>
              <Select
                value={assignments[domain.name] || "none"}
                onValueChange={(value) => onAssignUser(domain.name, value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DomainTable;
