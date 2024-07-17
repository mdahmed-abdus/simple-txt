'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { getUserData, logoutUser } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/authContext';
import { useEffect, useState } from 'react';

const passwordSchema = z
  .string()
  .trim()
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, {
    message:
      'Password must contain at least: 1 uppercase, 1 lowercase, 1 digit',
  })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(72, { message: 'Password must be at most 72 characters' });

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: 'Name must be at least 2 characters' })
      .max(128, { message: 'Name must be at most 128 characters' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Invalid email address' })
      .min(8, { message: 'Email must be at least 8 characters' })
      .max(254, { message: 'Email must be at most 128 characters' }),
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export default function Profile() {
  const { setAuthStatus, setUser } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();

  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    getUserData()
      .then(data => {
        const { name, email } = data.user;
        setUserData({ name, email });
        form.reset({ name, email });
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formFields = [
    {
      name: 'name' as const,
      label: 'Name',
      inputType: 'text',
      inputPlaceholder: 'Edit your name',
    },
    {
      name: 'email' as const,
      label: 'Email',
      inputType: 'email',
      inputPlaceholder: 'Edit your email',
    },
    {
      name: 'currentPassword' as const,
      label: 'Current Password',
      inputType: 'password',
      inputPlaceholder: 'Enter your current password',
    },
    {
      name: 'newPassword' as const,
      label: 'New Password',
      inputType: 'password',
      inputPlaceholder: 'Enter your new password',
    },
    {
      name: 'confirmNewPassword' as const,
      label: 'Confirm New Password',
      inputType: 'password',
      inputPlaceholder: 'Confirm your new password',
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({ description: 'Feature to update profile coming soon' });
  }

  const logout = () => {
    logoutUser()
      .then(data => {
        toast({ description: data.message });
        setAuthStatus(false);
        setUser({ name: '', email: '' });
        router.push('/login');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
  };

  return (
    <div className="container md:mt-32 grid grid-cols-1 md:grid-cols-2">
      <div className="w-full h-[500px] relative">
        <Image
          src="/illustrations/notes.jpg"
          fill
          priority
          sizes="(min-width: 1480px) 636px, (min-width: 780px) calc(45.59vw - 30px), calc(100vw - 128px)"
          style={{ objectFit: 'contain' }}
          alt="Illustration of a person using mobile phone"
        />
      </div>
      <div>
        <h1 className="text-3xl text-center">Edit your profile</h1>
        <p className="mt-4 text-center font-thin">
          Not {userData.name}?{' '}
          <Button
            className="font-thin text-base p-0"
            variant="link"
            onClick={logout}
          >
            Logout here
          </Button>
        </p>
        <div className="mt-16 sm:w-1/2 mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              {formFields.map((formField, index) => (
                <FormField
                  key={`profileFormField_${index}`}
                  control={form.control}
                  name={formField.name}
                  render={({ field }) => (
                    <FormItem className="mt-4 w-full">
                      <FormLabel>{formField.label}</FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 p-0"
                          type={formField.inputType}
                          autoComplete="on"
                          placeholder={formField.inputPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <Separator />
                    </FormItem>
                  )}
                />
              ))}
              <Button disabled type="submit" className="mt-16 w-fit">
                Feature coming soon
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
