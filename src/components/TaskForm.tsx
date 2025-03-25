
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Task } from '@/types/compliance';
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
import { UserRole } from '@/types/compliance';

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
  roles: z.string().min(1, {
    message: "At least one role is required.",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm = ({ onTaskCreated, onCancel }: TaskFormProps) => {
  const { toast } = useToast();
  const { getAllUsers } = useUser();
  
  // Get all Domain Accountable users
  const allUsers = getAllUsers();
  const accountableUsers = allUsers.filter(user => user.role === UserRole.DomainAccountable);
  
  const defaultValues: Partial<TaskFormValues> = {
    name: "",
    description: "",
    man_day_cost: 1,
    roles: "",
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  function onSubmit(data: TaskFormValues) {
    try {
      // For this version, we're using a single selected user role
      const rolesArray = [data.roles];
      
      const newTask: Task = {
        name: data.name,
        description: data.description,
        man_day_cost: data.man_day_cost,
        roles: rolesArray,
        subtasks: [],
      };
      
      onTaskCreated(newTask);
      
      toast({
        title: "Task Created",
        description: `Task "${data.name}" has been created successfully.`,
      });
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
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Domain Accountable" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
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
