'use client';

import InternalLink from '@/components/ui/InternalLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { sendVerificationEmail, verifyEmail } from '@/services/apiService';
import { emailVerificationSchema } from '@/validation/validationSchemas';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function VerifyEmail() {
  return (
    <div className="container mt-16 md:mt-32 text-center font-thin">
      <h1 className="text-3xl text-center font-normal">Verify your email</h1>
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

  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(false);

  useEffect(() => {
    if (tokenId) {
      setLoading(true);
      verifyEmail(tokenId)
        .then(data => {
          toast({ description: data.message });
          setVerificationStatus(true);
        })
        .catch(error => {
          toast({ variant: 'destructive', description: error.message });
          setVerificationStatus(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendEmail = (email: string) => {
    setSendingEmail(true);
    sendVerificationEmail(email)
      .then(data => {
        toast({ description: data.message });
        setSendingEmail(false);
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
        setSendingEmail(false);
      });
  };

  return loading ? (
    <Skeleton className="mt-4 w-1/2 h-[50px] mx-auto" />
  ) : tokenId ? (
    <WithToken
      verificationStatus={verificationStatus}
      sendEmail={sendEmail}
      sendingEmail={sendingEmail}
    />
  ) : (
    <WithoutToken sendEmail={sendEmail} sendingEmail={sendingEmail} />
  );
}

function WithToken({ verificationStatus, sendEmail, sendingEmail }: any) {
  return (
    <div className="mt-4 text-center font-thin">
      {verificationStatus ? (
        <>
          <p>Email verified</p>
          <InternalLink text="Login here" href="/login" />
        </>
      ) : (
        <>
          <p className="text-destructive">
            Email is already verified or verification link has expired.
          </p>
          <div className="mt-16">
            <p>Enter your email and we will send a new verification link.</p>
            <EmailForm sendingEmail={sendingEmail} sendEmail={sendEmail} />
          </div>
        </>
      )}
    </div>
  );
}

function WithoutToken({ sendEmail, sendingEmail }: any) {
  return (
    <>
      <p className="mt-4 text-center font-thin">
        Please check your inbox and spam for email verification link.
      </p>
      <div className="mt-16">
        <p>Did not receive the email?</p>
        <p>Enter your email and we will send it again.</p>
        <EmailForm sendingEmail={sendingEmail} sendEmail={sendEmail} />
      </div>
    </>
  );
}

function EmailForm({ sendingEmail, sendEmail }: any) {
  const form = useForm<z.infer<typeof emailVerificationSchema>>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: z.infer<typeof emailVerificationSchema>) => {
    sendEmail(values.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
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
        <div className="mt-16 text-center">
          <Button type="submit" className="mt-4" disabled={sendingEmail}>
            {sendingEmail ? 'Sending email' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
