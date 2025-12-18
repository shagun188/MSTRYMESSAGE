'use client';

import { ApiResponse } from "@/types/apiresponse";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from "@/hooks/useDebounce";
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from "@/app/schemas/signUpSchema";

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Check username uniqueness
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) return;
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  // Submit Sign-Up
  // In your SignUpForm component (the file you shared with the form UI)
// Find the onSubmit function and replace it with this:

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true);
  
  // 🔍 DEBUG LOGGING - Add these lines
  console.log('=== SIGN UP DEBUG ===');
  console.log('Form data:', data);
  console.log('Username:', data.username, '| Length:', data.username?.length);
  console.log('Email:', data.email);
  console.log('Password length:', data.password?.length);
  console.log('====================');
  
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data);

    toast({
      title: 'Success',
      description: response.data.message,
    });

    // Redirect to verify page with token from backend
    router.push(
      `/verify?token=${response.data.verificationToken}&email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`
    );

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const errorMessage = axiosError.response?.data.message || 'Sign-up failed. Please try again.';
    
    // 🔍 MORE DEBUG LOGGING - Add these lines
    console.error('=== SIGN UP ERROR ===');
    console.error('Status:', axiosError.response?.status);
    console.error('Error message:', errorMessage);
    console.error('Full error:', axiosError.response?.data);
    console.error('====================');
    
    toast({
      title: 'Sign Up Failed',
      description: errorMessage,
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-800/80 backdrop-blur-xl p-8 shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <p className='text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
