
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UserRole, getRolePermissions } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Trash, History, User as UserIcon } from 'lucide-react';
import UserAllocationHistory from '@/components/UserAllocationHistory';

const UserManagement = () => {
  const { currentUser, getAllUsers, addUser, updateUser, deleteUser, isAdmin } = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.Regular,
  });

  // Refresh user list
  const refreshUserList = () => {
    setUsers(getAllUsers());
  };

  // Check if user has admin permissions
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <h1 className="text-2xl font-bold mb-6">User Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </>
    );
  }

  const handleAddUser = () => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: getRolePermissions(formData.role),
    };

    addUser(newUser);
    refreshUserList(); // Refresh the user list immediately
    setIsAddDialogOpen(false);
    setFormData({ name: '', email: '', role: UserRole.Regular });
    
    toast({
      title: 'User added',
      description: `${newUser.name} has been added as ${newUser.role}`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: getRolePermissions(formData.role),
    };

    updateUser(updatedUser);
    refreshUserList(); // Refresh the user list immediately
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: 'User updated',
      description: `${updatedUser.name}'s information has been updated`,
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    deleteUser(selectedUser.id);
    refreshUserList(); // Refresh the user list immediately
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: 'User deleted',
      description: `${selectedUser.name} has been removed`,
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const openHistoryDrawer = (user: User) => {
    setSelectedUser(user);
    setIsHistoryDrawerOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2" size={16} />
            Add User
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openHistoryDrawer(user)}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.role === UserRole.Administrator 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === UserRole.DomainManager 
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === UserRole.DomainAccountable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openHistoryDrawer(user);
                      }}
                      className="mr-2"
                    >
                      <History size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(user);
                      }}
                      disabled={user.id === currentUser?.id}
                      className="mr-2"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(user);
                      }}
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update this user's information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedUser?.name}'s account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* User Allocation History Drawer */}
      <UserAllocationHistory 
        user={selectedUser}
        isOpen={isHistoryDrawerOpen}
        onOpenChange={setIsHistoryDrawerOpen}
      />
    </>
  );
};

export default UserManagement;
