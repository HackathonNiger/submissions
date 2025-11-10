'use client';

import '../../globals.css';
import { Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [showStrength, setShowStrength] = useState(false);

  // Ensure form is empty on mount
  useEffect(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setUserType('student');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
    setPasswordStrength(0);
    setShowStrength(false);
    setCriteria({
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    });
  }, []);

  // Password criteria rules
  const rules = [
    { key: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { key: 'lowercase', label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { key: 'uppercase', label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { key: 'number', label: 'One number', test: (p: string) => /\d/.test(p) },
    { key: 'special', label: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  // Generate random strong password suggestion
  const generatePassword = () => {
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specials = '!@#$%^&*(),.?":{}|<>';

    const getRandomChar = (str: string) => str[Math.floor(Math.random() * str.length)];

    let newPass = '';
    newPass += getRandomChar(lowers);
    newPass += getRandomChar(uppers);
    newPass += getRandomChar(numbers);
    newPass += getRandomChar(specials);

    const allChars = lowers + uppers + numbers + specials;
    while (newPass.length < 12) {
      newPass += getRandomChar(allChars);
    }

    return newPass.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Update password strength and criteria
  useEffect(() => {
    if (password) {
      setShowStrength(true);
      const newCriteria = {} as typeof criteria;
      let strength = 0;
      rules.forEach(rule => {
        const met = rule.test(password);
        newCriteria[rule.key as keyof typeof criteria] = met;
        if (met) strength++;
      });
      setCriteria(newCriteria);
      setPasswordStrength(strength);
    } else {
      setShowStrength(false);
      setPasswordStrength(0);
      setCriteria({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [password]);

  // Get strength label and color
  const getStrengthLabel = () => {
    if (passwordStrength >= 5) return 'Strong';
    if (passwordStrength >= 3) return 'Medium';
    if (passwordStrength >= 1) return 'Weak';
    return 'None';
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 5) return 'bg-green-500';
    if (passwordStrength >= 3) return 'bg-yellow-500';
    if (passwordStrength >= 1) return 'bg-red-500';
    return 'bg-gray-500';
  };

  // Local validation
  const validate = () => {
    if (!firstName.trim()) return toast.error('First name is required');
    if (!lastName.trim()) return toast.error('Last name is required');
    if (!email.trim()) return toast.error('Email is required');
    if (!password) return toast.error('Password is required');
    if (!confirmPassword) return toast.error('Confirm password is required');
    if (password !== confirmPassword)
      return toast.error('Passwords do not match');
    return true;
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        toast.error(error.message || 'Signup failed');
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase.from('profiles').upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          email,
          is_verified: false,
        });
        if (insertError) {
          toast.error(insertError.message || 'Failed to create profile');
          return;
        }
      }

      toast.success(
        'Signup successful! Check your email to verify your account.'
      );
      router.push('/login');
    } catch (err: unknown) {
      const msg =
        (err as { response: { message: string } })?.response?.message ||
        (err as { messgae: string }).messgae ||
        'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="" />;

  return (
    <Box className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-primary/10 via-background to-background transition-all duration-500 ease-in-out">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="w-[370px] max-w-md auth-card flex flex-col gap-4"
      >
        <Box
          as="form"
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >
          <Box as="h1" className="text-2xl font-bold text-center text-primary">
            Create an account
          </Box>

          <Box className="grid gap-2">
            <Label>First Name</Label>
            <Input
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </Box>

          <Box className="grid gap-2">
            <Label>Last Name</Label>
            <Input
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </Box>

          <Box className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Box>

          <Box className="grid gap-2">
            <Label>User Type</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="sponsor">Sponsor</SelectItem>
              </SelectContent>
            </Select>
          </Box>

          <Box className="grid gap-2 relative">
            <Label>Password</Label>
            <Box className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Box as="div"
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Box>
            </Box>
            {showStrength && (
              <Box as="div" className="mt-2 space-y-1">
                <Box as="div" className="flex items-center gap-2">
                  <Box as="div" className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <Box as="div"
                      className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></Box>
                  </Box>
                  <Box as="div" className="text-sm font-medium text-muted-foreground">
                    {getStrengthLabel()}
                  </Box>
                </Box>
                <Box as="div" className="space-y-1">
                  {rules.map((rule) => (
                    <Box as="div"
                      key={rule.key}
                      className="flex items-center gap-2 text-xs transition-colors duration-200"
                    >
                      <Box as="div"
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          criteria[rule.key as keyof typeof criteria] ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></Box>
                      <Box as="div" className={criteria[rule.key as keyof typeof criteria] ? 'text-green-600' : 'text-gray-500'}>
                        {rule.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
                {passwordStrength < 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => setPassword(generatePassword())}
                  >
                    Generate strong password
                  </Button>
                )}
              </Box>
            )}
          </Box>

          <Box className="grid gap-2 relative">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <Box as="div"
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </Box>
            </div>
          </Box>

          <Button
            type="submit"
            className="w-full bg-primary cursor-pointer hover:bg-primary-dark transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>

          <Box className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline transition-colors duration-200">
              Login
            </a>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}