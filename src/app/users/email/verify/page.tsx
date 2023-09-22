'use client';

import InternalLink from '@/components/ui/InternalLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { sendVerificationEmail, verifyEmail } from '@/services/apiService';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(false);

  useEffect(() => {
    if (tokenId) {
      setLoading(true);
      verifyEmail(tokenId)
        .then(data => {
          toast({ description: data.message });
          setVerificationStatus(true);
          setLoading(false);
        })
        .catch(error => {
          toast({ variant: 'destructive', description: error.message });
          setVerificationStatus(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = () => {
    if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
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
    } else {
      toast({ variant: 'destructive', description: 'Invalid email' });
    }
  };

  return (
    <div className="container mt-16 md:mt-32 text-center font-thin">
      <h1 className="text-3xl text-center font-normal">Verify your email</h1>
      {loading ? (
        <Skeleton className="mt-4 w-1/2 h-[50px] mx-auto" />
      ) : tokenId ? (
        <WithToken
          verificationStatus={verificationStatus}
          email={email}
          setEmail={setEmail}
          onSubmit={onSubmit}
          sendingEmail={sendingEmail}
        />
      ) : (
        <WithoutToken
          email={email}
          setEmail={setEmail}
          onSubmit={onSubmit}
          sendingEmail={sendingEmail}
        />
      )}
    </div>
  );
}

function WithToken({
  verificationStatus,
  email,
  setEmail,
  onSubmit,
  sendingEmail,
}: any) {
  return (
    <div className="mt-4 text-center font-thin">
      {verificationStatus ? (
        <>
          <p>Email verified</p>
          <InternalLink text="Login here" href="/login" />
        </>
      ) : (
        <>
          <p className="text-destructive">Email not verified.</p>
          <div className="mt-16">
            <p>Enter your email and we will send a new verification link.</p>
            <Input
              className="mt-4 mx-auto p-2 md:w-1/2 text-center border-0"
              value={email}
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
            />
            <Separator className="mx-auto md:w-1/2" />
            <Button className="mt-4" onClick={onSubmit} disabled={sendingEmail}>
              {sendingEmail ? 'Sending email' : 'Submit'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function WithoutToken({ email, setEmail, onSubmit, sendingEmail }: any) {
  return (
    <>
      <p className="mt-4 text-center font-thin">
        Please check your inbox and spam for email verification link.
      </p>
      <div className="mt-16">
        <p>Did not receive the email?</p>
        <p>Enter your email and we will send it again.</p>
        <Input
          className="mt-4 mx-auto p-2 md:w-1/2 text-center border-0"
          value={email}
          placeholder="Enter your email"
          onChange={e => setEmail(e.target.value)}
        />
        <Separator className="mx-auto md:w-1/2" />
        <Button className="mt-4" onClick={onSubmit} disabled={sendingEmail}>
          {sendingEmail ? 'Sending email' : 'Submit'}
        </Button>
      </div>
    </>
  );
}
