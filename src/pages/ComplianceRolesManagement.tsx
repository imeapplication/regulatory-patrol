
import React, { useState } from 'react';
import { UserRole, getRolePermissions, UserPermissions } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const ComplianceRolesManagement = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<UserRole[]>(Object.values(UserRole));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [permissionsForm, setPermissionsForm] = useState<UserPermissions>({
    canAddItems: false,
    canModifyItems: false,
    canDeleteItems: false,
    canAssignRoles: false,
    canViewReports: false
  });

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setPermissionsForm(getRolePermissions(role));
    setIsEditDialogOpen(true);
  };

  const handleSavePermissions = () => {
    // In a real application, this would update permissions in the backend
    toast({
      title: 'Permissions updated',
      description: 'Role permissions have been updated successfully',
    });
    setIsEditDialogOpen(false);
  };

  const togglePermission = (permission: keyof UserPermissions) => {
    setPermissionsForm(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center mb-6">
          <Button variant="outline" asChild className="mr-4">
            <Link to="/roles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roles Overview
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Manage Compliance Roles</h1>
        </div>
        <p className="mb-8 text-muted-foreground">
          Configure permissions for each compliance role in the system.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Roles Configuration</CardTitle>
            <CardDescription>Edit permissions for each compliance role</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{UserRole.Administrator}</TableCell>
                  <TableCell>
                    Has full access to all features and can manage users, domains, and settings
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditRole(UserRole.Administrator)}>
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{UserRole.DomainManager}</TableCell>
                  <TableCell>
                    Can manage specific domains they are assigned to, including adding and modifying tasks
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditRole(UserRole.DomainManager)}>
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{UserRole.DomainAccountable}</TableCell>
                  <TableCell>
                    Accountable for specific domains, can approve changes but cannot add new items
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditRole(UserRole.DomainAccountable)}>
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{UserRole.TaskManager}</TableCell>
                  <TableCell>
                    Manages specific tasks they are assigned to, can modify tasks and their subtasks
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditRole(UserRole.TaskManager)}>
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{UserRole.Regular}</TableCell>
                  <TableCell>
                    Basic access to view information without the ability to modify content
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditRole(UserRole.Regular)}>
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Current Permissions Matrix</CardTitle>
            <CardDescription>Overview of permissions for each role</CardDescription>
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
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Role Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {selectedRole} Permissions</DialogTitle>
            <DialogDescription>
              Configure what this role is allowed to do in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="add-items">Add Items</Label>
              <Switch 
                id="add-items" 
                checked={permissionsForm.canAddItems}
                onCheckedChange={() => togglePermission('canAddItems')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="modify-items">Modify Items</Label>
              <Switch 
                id="modify-items" 
                checked={permissionsForm.canModifyItems}
                onCheckedChange={() => togglePermission('canModifyItems')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="delete-items">Delete Items</Label>
              <Switch 
                id="delete-items" 
                checked={permissionsForm.canDeleteItems}
                onCheckedChange={() => togglePermission('canDeleteItems')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assign-roles">Assign Roles</Label>
              <Switch 
                id="assign-roles" 
                checked={permissionsForm.canAssignRoles}
                onCheckedChange={() => togglePermission('canAssignRoles')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="view-reports">View Reports</Label>
              <Switch 
                id="view-reports" 
                checked={permissionsForm.canViewReports}
                onCheckedChange={() => togglePermission('canViewReports')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplianceRolesManagement;
