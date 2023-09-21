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
import { loginUser } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/authContext';

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .min(8, { message: 'Email must be at least 8 characters' })
    .max(254, { message: 'Email must be at most 128 characters' }),
  password: z
    .string()
    .trim()
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u, {
      message:
        'Password must contain at least: 1 uppercase, 1 lowercase, 1 digit',
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(72, { message: 'Password must be at most 72 characters' }),
});

export default function Login() {
  const { setAuthStatus, setUser } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const formFields = [
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
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginUser(values)
      .then(data => {
        toast({ description: data.message });
        setAuthStatus(true);
        setUser({ name: data.user.name, email: data.user.email });
        router.push('/dashboard');
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
        setAuthStatus(false);
        setUser({ name: '', email: '' });
      });
  }

  return (
    <div className="container md:mt-32 grid grid-cols-1 md:grid-cols-2">
      <div className="h-[400px] md:h-full relative">
        <Image
          src="/illustrations/login.jpg"
          layout="fill"
          style={{ objectFit: 'contain' }}
          alt="Illustration of a person entering a pin to unlock the system"
        />
      </div>
      <div>
        <h1 className="text-3xl text-center">Login to your account</h1>
        <p className="mt-4 text-center font-thin">
          Don&apos;t have an account?{' '}
          <InternalLink text="Register here" href="/register" />
        </p>
        <div className="mt-16 sm:w-1/2 mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              {formFields.map((formField, index) => (
                <FormField
                  key={`loginFormFormField_${index}`}
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
                Login
              </Button>
              <p className="mt-8 font-thin text-sm">
                Email not verified?{' '}
                <InternalLink
                  className="text-sm"
                  text="Verify here"
                  href="/users/email/verify"
                />
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
