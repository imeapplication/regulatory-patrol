
import React from 'react';
import { UserRole, getRolePermissions } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserRoles = () => {
  // Get all available roles from the UserRole enum
  const roles = Object.values(UserRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">User Roles & Permissions</h1>
        <p className="mb-8 text-muted-foreground">
          This page displays all available user roles in the system and their associated permissions.
        </p>

        <div className="grid gap-8">
          {/* Roles Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Roles Overview</CardTitle>
              <CardDescription>Basic information about each role in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{UserRole.Administrator}</TableCell>
                    <TableCell>
                      Has full access to all features and can manage users, domains, and settings
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{UserRole.DomainManager}</TableCell>
                    <TableCell>
                      Can manage specific domains they are assigned to, including adding and modifying tasks
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{UserRole.DomainAccountable}</TableCell>
                    <TableCell>
                      Accountable for specific domains, can approve changes but cannot add new items
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{UserRole.TaskManager}</TableCell>
                    <TableCell>
                      Manages specific tasks they are assigned to, can modify tasks and their subtasks
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{UserRole.Regular}</TableCell>
                    <TableCell>
                      Basic access to view information without the ability to modify content
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Permissions Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions Comparison</CardTitle>
              <CardDescription>Detailed breakdown of permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Permission</TableHead>
                      {roles.map(role => (
                        <TableHead key={role} className="text-center">{role}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Add Items</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role}-add`} className="text-center">
                          {getRolePermissions(role).canAddItems ? 
                            <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                            <X className="mx-auto h-5 w-5 text-red-500" />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Modify Items</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role}-modify`} className="text-center">
                          {getRolePermissions(role).canModifyItems ? 
                            <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                            <X className="mx-auto h-5 w-5 text-red-500" />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Delete Items</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role}-delete`} className="text-center">
                          {getRolePermissions(role).canDeleteItems ? 
                            <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                            <X className="mx-auto h-5 w-5 text-red-500" />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Assign Roles</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role}-assign`} className="text-center">
                          {getRolePermissions(role).canAssignRoles ? 
                            <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                            <X className="mx-auto h-5 w-5 text-red-500" />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">View Reports</TableCell>
                      {roles.map(role => (
                        <TableCell key={`${role}-view`} className="text-center">
                          {getRolePermissions(role).canViewReports ? 
                            <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                            <X className="mx-auto h-5 w-5 text-red-500" />}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Domain Assignment</TableCell>
                      {roles.map(role => {
                        const permissions = getRolePermissions(role);
                        const hasDomains = 'manageableDomains' in permissions || 'accountableDomains' in permissions;
                        return (
                          <TableCell key={`${role}-domains`} className="text-center">
                            {hasDomains ? 
                              <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                              <X className="mx-auto h-5 w-5 text-red-500" />}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Task Assignment</TableCell>
                      {roles.map(role => {
                        const permissions = getRolePermissions(role);
                        const hasTasks = 'manageableTasks' in permissions;
                        return (
                          <TableCell key={`${role}-tasks`} className="text-center">
                            {hasTasks ? 
                              <Check className="mx-auto h-5 w-5 text-green-500" /> : 
                              <X className="mx-auto h-5 w-5 text-red-500" />}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
