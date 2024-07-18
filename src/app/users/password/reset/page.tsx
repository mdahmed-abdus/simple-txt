'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword, sendPasswordResetEmail } from '@/services/apiService';
import {
  newPasswordResetSchema,
  passwordResetSchema,
} from '@/validation/validationSchemas';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function VerifyEmail() {
  return (
    <div className="container mt-16 md:mt-32 text-center font-thin">
      <h1 className="text-3xl text-center font-normal">Reset your password</h1>
      <Suspense>
        <PageContent />
      </Suspense>
    </div>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const passwordReset = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    resetPassword(tokenId!, values)
      .then(data => toast({ description: data.message }))
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setLoading(false));
  };

  const sendEmail = (email: string) => {
    setLoading(true);
    sendPasswordResetEmail(email)
      .then(data => toast({ description: data.message }))
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setLoading(false));
  };

  return tokenId ? (
    <WithToken passwordReset={passwordReset} loading={loading} />
  ) : (
    <WithoutToken sendEmail={sendEmail} loading={loading} />
  );
}

function WithToken({ passwordReset, loading }: any) {
  const formFields = [
    {
      name: 'password' as const,
      label: 'New Password',
      inputType: 'password',
      inputPlaceholder: 'Enter your new password',
    },
    {
      name: 'confirmPassword' as const,
      label: 'Confirm Password',
      inputType: 'password',
      inputPlaceholder: 'Confirm your new password',
    },
  ];

  const form = useForm<z.infer<typeof newPasswordResetSchema>>({
    resolver: zodResolver(newPasswordResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (values: z.infer<typeof newPasswordResetSchema>) => {
    passwordReset(values);
  };

  return (
    <div className="mt-4 mx-auto p-2 md:w-1/2 text-center font-thin">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {formFields.map((formField, index) => (
            <FormField
              key={`passwordResetFormField_${index}`}
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <FormLabel className="mt-8 block text-left">
                    {formField.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-4 mx-auto p-0 border-0"
                      type="password"
                      autoComplete="on"
                      placeholder={formField.inputPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                  <Separator className="mx-auto" />
                </FormItem>
              )}
            />
          ))}
          <div className="mt-4 text-center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Resetting' : 'Reset'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function WithoutToken({ sendEmail, loading }: any) {
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: z.infer<typeof passwordResetSchema>) => {
    sendEmail(values.email);
  };

  return (
    <>
      <p className="mt-4 text-center font-thin">
        Please check your inbox and spam for password reset link.
      </p>
      <div className="mt-16">
        <p>Did not receive the email?</p>
        <p>Enter your email and we will send it again.</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="mt-4 mx-auto md:w-1/2 text-center border-0"
                      type="email"
                      autoComplete="on"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <Separator className="mx-auto md:w-1/2" />
                </FormItem>
              )}
            />
            <div className="mt-4 text-center">
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending email' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
