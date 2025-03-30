
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Task } from '@/types/graphqlTypes';
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
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/graphql/queries';

const taskSchema = z.object({
  title: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  mandays: z.coerce.number().min(1, {
    message: "Man day cost must be at least 1.",
  }),
  ownerId: z.string().min(1, {
    message: "An owner is required.",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onTaskCreated: (task: Partial<Task>) => void;
  onCancel: () => void;
}

const TaskForm = ({ onTaskCreated, onCancel }: TaskFormProps) => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  const { loading, error, data } = useQuery(GET_USERS);
  
  // Get all users who can be task owners
  const users = data?.users || [];
  
  const defaultValues: Partial<TaskFormValues> = {
    title: "",
    description: "",
    mandays: 1,
    ownerId: currentUser?.id || "",
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  function onSubmit(data: TaskFormValues) {
    try {
      // Find the selected user
      const selectedUser = users.find((user: any) => user.id === data.ownerId);
      
      const newTask: Partial<Task> = {
        title: data.title,
        description: data.description,
        mandays: data.mandays,
        owner: selectedUser ? {
          id: selectedUser.id,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          role: selectedUser.role
        } : undefined
      };
      
      onTaskCreated(newTask);
      
      toast({
        title: "Task Created",
        description: `Task "${data.title}" has been created successfully.`,
      });
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error loading users: {error.message}</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
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
          name="mandays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Man Days</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Owner</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Task Owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role})
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
