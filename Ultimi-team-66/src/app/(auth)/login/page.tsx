'use client';

import '../../globals.css';
import { Eye, EyeOff } from 'lucide-react';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ensure form is empty on mount
  useEffect(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;

      router.push('/dashboard');
      toast.success('Login successful');
      // toast.success('Welcome back ${});
    } catch (err: unknown) {
      const msg =
        (err as { response: { message: string } })?.response?.message ||
        (err as { message: string }).message ||
        'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-primary/10 via-background to-background transition-all duration-500 ease-in-out">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="w-[370px] max-w-md auth-card flex flex-col gap-4"
      >

        
        <Box
          as="form"
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <Box as="h1" className="text-2xl font-bold text-center text-primary">
            Welcome back
          </Box>

          <Box className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </Box>

          <Box className="grid gap-2 relative">
            <Label>Password</Label>
            <Box as="div" className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Box
                as="span"
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Box>
            </Box>
          </Box>

          <Button
            type="submit"
            className="w-full bg-primary cursor-pointer hover:bg-primary-dark transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Box className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Box as="a" href="/register" className="text-primary hover:underline transition-colors duration-200">
              Sign up
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
