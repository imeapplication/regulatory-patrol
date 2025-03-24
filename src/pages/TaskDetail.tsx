
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task, SubTask } from '@/types/compliance';
import GlassCard from '@/components/ui-components/GlassCard';
import SubTaskList from '@/components/SubTaskList';
import Badge from '@/components/ui-components/Badge';
import Navbar from '@/components/Navbar';
import { ChevronRight, Users, Edit, Trash, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
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
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const TaskDetail = () => {
  const { domainName, taskName } = useParams<{ domainName: string; taskName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isDomainAccountableFor } = useUser();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [canEditTasks, setCanEditTasks] = useState(false);
  
  // Task editor state
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [taskNameInput, setTaskNameInput] = useState('');
  const [taskDescriptionInput, setTaskDescriptionInput] = useState('');
  const [taskManDayCostInput, setTaskManDayCostInput] = useState('0');
  const [taskRolesInput, setTaskRolesInput] = useState('');
  
  // Subtask editor state
  const [newSubtask, setNewSubtask] = useState<Partial<SubTask>>({
    name: '',
    description: '',
    man_day_cost: 0,
    role: []
  });
  
  // Available roles for dropdown
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  useEffect(() => {
    // Try to get from location state first
    if (location.state?.domain && location.state?.task) {
      setDomain(location.state.domain);
      setTask(location.state.task);
      return;
    }
    
    // If not available in state, find in data
    if (domainName && taskName) {
      const foundDomain = complianceData.regulations.domains.find(
        d => d.name === decodeURIComponent(domainName)
      );
      
      if (foundDomain) {
        setDomain(foundDomain);
        const foundTask = foundDomain.tasks.find(
          t => t.name === decodeURIComponent(taskName)
        );
        setTask(foundTask || null);
      }
    }
  }, [domainName, taskName, location.state]);

  useEffect(() => {
    if (task) {
      // Initialize editor state
      setEditTask(task);
      setTaskNameInput(task.name);
      setTaskDescriptionInput(task.description);
      setTaskManDayCostInput(task.man_day_cost.toString());
      setTaskRolesInput(task.roles.join(', '));
      
      // Collect available roles from task and subtasks for the dropdown
      const roles = new Set<string>(task.roles);
      task.subtasks.forEach(subtask => {
        subtask.role.forEach(role => roles.add(role));
      });
      
      // Also add common roles from the domain if available
      if (domain) {
        domain.tasks.forEach(t => {
          t.roles.forEach(role => roles.add(role));
          t.subtasks.forEach(st => {
            st.role.forEach(role => roles.add(role));
          });
        });
      }
      
      setAvailableRoles(Array.from(roles).sort());
    }
  }, [task, domain]);

  useEffect(() => {
    // Determine if user can edit tasks in this domain
    if (domainName) {
      const decodedDomainName = decodeURIComponent(domainName);
      setCanEditTasks(isAdmin || isDomainAccountableFor(decodedDomainName));
    }
  }, [domainName, isAdmin, isDomainAccountableFor]);

  const handleDeleteTask = () => {
    if (!domain || !task) return;
    
    // In a real app, you would make an API call here
    // For now, we'll just simulate it by updating the local data
    const updatedDomain = { ...domain };
    updatedDomain.tasks = domain.tasks.filter(t => t.name !== task.name);
    
    // Update domain's man_day_cost
    updatedDomain.man_day_cost -= task.man_day_cost;
    
    toast({
      title: 'Task deleted',
      description: `${task.name} has been removed from ${domain.name}.`
    });
    
    // Navigate back to domain detail
    navigate(`/domain/${encodeURIComponent(domain.name)}`, { state: { domain: updatedDomain } });
  };

  const handleUpdateTask = () => {
    if (!domain || !task) return;
    
    const updatedTask: Task = {
      name: taskNameInput,
      description: taskDescriptionInput,
      man_day_cost: parseFloat(taskManDayCostInput) || 0,
      roles: taskRolesInput.split(',').map(role => role.trim()).filter(Boolean),
      subtasks: task.subtasks
    };
    
    // Update in the domain
    const updatedDomain = { ...domain };
    const taskIndex = updatedDomain.tasks.findIndex(t => t.name === task.name);
    
    if (taskIndex !== -1) {
      // Update domain's man_day_cost
      updatedDomain.man_day_cost = updatedDomain.man_day_cost - task.man_day_cost + updatedTask.man_day_cost;
      
      updatedDomain.tasks[taskIndex] = updatedTask;
      
      setDomain(updatedDomain);
      setTask(updatedTask);
      
      toast({
        title: 'Task updated',
        description: `${updatedTask.name} has been updated.`
      });
    }
  };

  const handleAddSubtask = () => {
    if (!domain || !task || !newSubtask.name) return;
    
    // Create the subtask with roles from dropdown selection
    const subtask: SubTask = {
      name: newSubtask.name,
      description: newSubtask.description || '',
      man_day_cost: newSubtask.man_day_cost || 0,
      role: selectedRoles
    };
    
    // Update the task with the new subtask
    const updatedTask = { ...task };
    updatedTask.subtasks = [...updatedTask.subtasks, subtask];
    
    // Update task's man_day_cost
    updatedTask.man_day_cost += subtask.man_day_cost;
    
    // Update in the domain
    const updatedDomain = { ...domain };
    const taskIndex = updatedDomain.tasks.findIndex(t => t.name === task.name);
    
    if (taskIndex !== -1) {
      updatedDomain.tasks[taskIndex] = updatedTask;
      
      // Update domain's man_day_cost
      updatedDomain.man_day_cost += subtask.man_day_cost;
      
      setDomain(updatedDomain);
      setTask(updatedTask);
      
      // Reset the new subtask form
      setNewSubtask({
        name: '',
        description: '',
        man_day_cost: 0,
        role: []
      });
      setSelectedRoles([]);
      
      toast({
        title: 'Subtask added',
        description: `${subtask.name} has been added to ${task.name}.`
      });
    }
  };
  
  const toggleRole = (role: string) => {
    setSelectedRoles(current => 
      current.includes(role)
        ? current.filter(r => r !== role)
        : [...current, role]
    );
  };
  
  if (!domain || !task) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <GlassCard>
            <h2 className="text-xl font-medium">Task not found</h2>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-primary hover:underline"
            >
              Return to Dashboard
            </button>
          </GlassCard>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <a href="/" className="hover:text-foreground">Dashboard</a>
            <ChevronRight className="w-4 h-4" />
            <a 
              href={`/domain/${encodeURIComponent(domain.name)}`}
              className="hover:text-foreground"
            >
              {domain.name}
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{task.name}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Task</h2>
            
            {canEditTasks && (
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={taskNameInput}
                          onChange={(e) => setTaskNameInput(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={taskDescriptionInput}
                          onChange={(e) => setTaskDescriptionInput(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="man_day_cost">Estimated effort (man-days)</Label>
                        <Input 
                          id="man_day_cost" 
                          type="number" 
                          min="0" 
                          step="0.5"
                          value={taskManDayCostInput}
                          onChange={(e) => setTaskManDayCostInput(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roles">Required roles (comma-separated)</Label>
                        <Input 
                          id="roles" 
                          value={taskRolesInput}
                          onChange={(e) => setTaskRolesInput(e.target.value)}
                          placeholder="Role 1, Role 2, Role 3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateTask}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the task "{task.name}" and all its subtasks.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
          <GlassCard className="mb-8 animate-slide-down">
            <h1 className="text-2xl font-semibold">{task.name}</h1>
            <p className="mt-2 text-muted-foreground">{task.description}</p>
            
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                <div className="font-medium">Estimated effort</div>
                <div className="text-xl font-semibold mt-1">{task.man_day_cost} man-days</div>
              </div>
              
              <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                <div className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Required roles</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.roles.map((role, index) => (
                    <Badge key={index} variant="primary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Subtasks</h2>
              
              {canEditTasks && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Add Subtask
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Subtask</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="subtask-name">Name</Label>
                        <Input 
                          id="subtask-name" 
                          value={newSubtask.name}
                          onChange={(e) => setNewSubtask({...newSubtask, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtask-description">Description</Label>
                        <Textarea 
                          id="subtask-description" 
                          value={newSubtask.description}
                          onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtask-man_day_cost">Estimated effort (man-days)</Label>
                        <Input 
                          id="subtask-man_day_cost" 
                          type="number" 
                          min="0" 
                          step="0.5"
                          value={newSubtask.man_day_cost}
                          onChange={(e) => setNewSubtask({
                            ...newSubtask, 
                            man_day_cost: parseFloat(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtask-roles">Required roles</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-between"
                            >
                              {selectedRoles.length > 0 
                                ? `${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''} selected` 
                                : 'Select roles'}
                              <ChevronRight className="h-4 w-4 ml-1 rotate-90 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-popover">
                            <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {availableRoles.map((role) => (
                              <DropdownMenuCheckboxItem
                                key={role}
                                checked={selectedRoles.includes(role)}
                                onCheckedChange={() => toggleRole(role)}
                              >
                                {role}
                              </DropdownMenuCheckboxItem>
                            ))}
                            {availableRoles.length === 0 && (
                              <DropdownMenuItem disabled>No roles available</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedRoles.map((role) => (
                            <Badge key={role} variant="primary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddSubtask}>Add Subtask</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <SubTaskList subtasks={task.subtasks} />
          </div>
        </div>
      </main>
    </>
  );
};

export default TaskDetail;
