
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Task, getCurrentTimestamp, UserRole } from '@/types/compliance';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const taskSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  man_day_cost: z.coerce.number().min(1, {
    message: "Man day cost must be at least 1.",
  }),
  assignedUserId: z.string().min(1, {
    message: "A user must be assigned to this task.",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm = ({ onTaskCreated, onCancel }: TaskFormProps) => {
  const { toast } = useToast();
  const { getAllUsers, saveComplianceData } = useUser();
  
  // Get all Regular users
  const allUsers = getAllUsers();
  const regularUsers = allUsers.filter(user => user.role === UserRole.Regular);
  
  const defaultValues: Partial<TaskFormValues> = {
    name: "",
    description: "",
    man_day_cost: 1,
    assignedUserId: "",
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  function onSubmit(data: TaskFormValues) {
    try {
      // Find the selected user to get their name
      const selectedUser = regularUsers.find(user => user.id === data.assignedUserId);
      if (!selectedUser) {
        throw new Error("Selected user not found");
      }
      
      // Create roles array with the selected user's name
      const rolesArray = [selectedUser.name];
      
      const timestamp = getCurrentTimestamp();
      
      const newTask: Task = {
        name: data.name,
        description: data.description,
        man_day_cost: data.man_day_cost,
        roles: rolesArray,
        subtasks: [],
        createdAt: timestamp,
        updatedAt: timestamp,
        assignedUserId: data.assignedUserId // Store the user ID for future reference
      };
      
      onTaskCreated(newTask);
      
      // Save the compliance data after task creation
      saveComplianceData();
      
      toast({
        title: "Task Created",
        description: `Task "${data.name}" has been assigned to ${selectedUser.name}.`,
      });
      
      // Close the dialog after successful task creation
      onCancel();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter task description" 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="man_day_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Man Day Cost</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assignedUserId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign User</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Regular User" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {regularUsers.length > 0 ? (
                    regularUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No regular users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
