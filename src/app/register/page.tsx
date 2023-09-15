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
import InternalLink from '@/components/ui/InternalLink';
import { registerUser } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

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
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const formFields = [
    {
      name: 'name' as const,
      label: 'Name',
      inputType: 'text',
      inputPlaceholder: 'Enter your name',
    },
    {
      name: 'email' as const,
      label: 'Email',
      inputType: 'email',
      inputPlaceholder: 'Enter your email',
    },
    {
      name: 'password' as const,
      label: 'Password',
      inputType: 'password',
      inputPlaceholder: 'Enter your password',
    },
    {
      name: 'confirmPassword' as const,
      label: 'Confirm Password',
      inputType: 'password',
      inputPlaceholder: 'Confirm your password',
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerUser(values)
      .then(data => {
        toast({ description: data.message });
        router.push('/users/email/verify');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
  }

  return (
    <div className="container md:mt-32 grid grid-cols-1 md:grid-cols-2">
      <div className="h-[400px] md:h-full relative">
        <Image
          src="/illustrations/register.jpg"
          layout="fill"
          style={{ objectFit: 'contain' }}
          alt="Illustration of a teacher teaching"
        />
      </div>
      <div>
        <h1 className="text-3xl text-center">Create a new account</h1>
        <p className="mt-4 text-center font-thin">
          Already have an account?{' '}
          <InternalLink className="" text="Login here" href="/login" />
        </p>
        <div className="mt-16 sm:w-1/2 mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              {formFields.map((formField, index) => (
                <FormField
                  key={`registerFormFormField_${index}`}
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
              <Button type="submit" className="mt-16 w-fit">
                Register
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
