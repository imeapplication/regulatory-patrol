
import { User, UserRole } from '@/types/compliance';
import { AllocationHistoryEntry } from '@/types/userAllocation';
import { TaskForUI } from '@/hooks/useDomainDetail';

interface TaskManagementProps {
  users: User[];
  updateUser: (user: User) => void;
  addAllocationHistoryEntry: (entry: AllocationHistoryEntry) => void;
}

export const useTaskManagement = ({ 
  users, 
  updateUser, 
  addAllocationHistoryEntry 
}: TaskManagementProps) => {
  
  // Function to assign a task to a Task Manager
  const assignTaskToManager = (userId: string, domainName: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      // Only add if not already assigned
      if (!manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: [...manageableTasks, taskName]
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          taskName,
          action: 'assigned',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
        return true;
      }
    }
    return false;
  };

  // Function to remove a task from a Task Manager
  const removeTaskFromManager = (userId: string, domainName: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      if (manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: manageableTasks.filter(task => task !== taskName)
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          taskName,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
        return true;
      }
    }
    return false;
  };

  // Function to get all Task Manager users
  const getTaskManagerUsers = (): User[] => {
    return users.filter(user => user.role === UserRole.TaskManager);
  };
  
  // Function to update task owner in the domain
  const updateTaskOwner = (
    currentOwnerId: string | undefined, 
    newOwnerId: string, 
    domainName: string, 
    task: TaskForUI
  ) => {
    // If there's a current owner, remove the task from them
    if (currentOwnerId) {
      removeTaskFromManager(currentOwnerId, domainName, task.title);
    }
    
    // Assign the task to the new owner
    const success = assignTaskToManager(newOwnerId, domainName, task.title);
    
    if (success) {
      // Return timestamp of assignment for tracking purposes
      return new Date().toISOString();
    }
    
    return null;
  };

  // Function to synchronize tasks with permissions
  const syncTasksWithPermissions = (tasks: TaskForUI[], domainName: string) => {
    if (!tasks || tasks.length === 0) return;
    
    // Get all task managers
    const taskManagers = getTaskManagerUsers();
    
    tasks.forEach(task => {
      if (task.owner?.id) {
        // Find the corresponding user
        const ownerUser = users.find(user => user.id === task.owner?.id);
        
        if (ownerUser && ownerUser.role === UserRole.TaskManager) {
          const manageableTasks = ownerUser.permissions.manageableTasks || [];
          
          // If the task is not in their permissions, add it
          if (!manageableTasks.includes(task.title)) {
            const updatedUser = {
              ...ownerUser,
              permissions: {
                ...ownerUser.permissions,
                manageableTasks: [...manageableTasks, task.title]
              }
            };
            
            updateUser(updatedUser);
            
            // Add allocation history entry
            const historyEntry: AllocationHistoryEntry = {
              userId: ownerUser.id,
              domainName,
              taskName: task.title,
              action: 'assigned',
              timestamp: new Date().toISOString(),
              role: 'TaskManager'
            };
            
            addAllocationHistoryEntry(historyEntry);
          }
        }
      } else {
        // If no owner assigned, check if any task manager has this in their permissions
        for (const manager of taskManagers) {
          const manageableTasks = manager.permissions.manageableTasks || [];
          
          if (manageableTasks.includes(task.title)) {
            // Found a manager with this task in permissions - this should be reflected in UI
            return {
              id: manager.id,
              firstName: manager.name.split(' ')[0] || '',
              lastName: manager.name.split(' ')[1] || '',
              role: manager.businessRole || manager.role
            };
          }
        }
      }
    });
  };

  return {
    assignTaskToManager,
    removeTaskFromManager,
    getTaskManagerUsers,
    updateTaskOwner,
    syncTasksWithPermissions
  };
};
