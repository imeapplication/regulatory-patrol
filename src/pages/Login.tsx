
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import GlassCard from '@/components/ui-components/GlassCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('cla@example.com');
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(email);
    if (success) {
      toast({
        title: 'Logged in successfully',
        description: 'Welcome to Regulatory Patrol'
      });
      navigate('/');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email. Try cla@example.com',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <GlassCard className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Regulatory Patrol</h1>
          <p className="text-center text-muted-foreground">Sign in to manage compliance domains and tasks</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Try: cla@example.com (Administrator) or manager@example.com (Manager)
            </p>
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Login;
