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
import { userRegisterSchema } from '@/validation/validationSchemas';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const [registering, setRegistering] = useState(false);
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

  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof userRegisterSchema>) {
    setRegistering(true);

    registerUser(values)
      .then(data => {
        toast({ description: data.message });
        router.push('/users/email/verify');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setRegistering(false));
  }

  return (
    <div className="container md:mt-32 grid grid-cols-1 md:grid-cols-2">
      <div className="w-full h-[500px] relative">
        <Image
          src="/illustrations/register.jpg"
          fill
          priority
          sizes="(min-width: 1480px) 636px, (min-width: 780px) calc(45.59vw - 30px), calc(100vw - 128px)"
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
              <Button
                type="submit"
                disabled={registering}
                className="mt-16 w-fit"
              >
                {registering ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
