'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword, sendPasswordResetEmail } from '@/services/apiService';
import { passwordResetSchema } from '@/validation/validationSchemas';
import { validate } from '@/validation/validator';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function PasswordReset() {
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

  const [sendingEmail, setSendingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = () => {
    const { success, errorMessage } = validate(passwordResetSchema, { email });

    if (success) {
      setSendingEmail(true);
      sendPasswordResetEmail(email)
        .then(data => {
          toast({ description: data.message });
          setSendingEmail(false);
        })
        .catch(error => {
          toast({ variant: 'destructive', description: error.message });
          setSendingEmail(false);
        });
    } else {
      toast({
        variant: 'destructive',
        description: errorMessage || 'Invalid email or email not verified',
      });
    }
  };

  const onSubmitPasswordReset = () => {
    if (!tokenId) {
      return;
    }

    if (!password.match(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)) {
      toast({
        variant: 'destructive',
        description:
          'Password must contain at least: 1 uppercase, 1 lowercase, 1 digit',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({ variant: 'destructive', description: 'Passwords do not match' });
      return;
    }

    resetPassword(tokenId, { password, confirmPassword })
      .then(data => {
        toast({ description: data.message });
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
      });
  };

  return tokenId ? (
    <WithToken
      password={password}
      confirmPassword={confirmPassword}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      onSubmit={onSubmitPasswordReset}
    />
  ) : (
    <WithoutToken
      email={email}
      setEmail={setEmail}
      onSubmit={onSubmit}
      sendingEmail={sendingEmail}
    />
  );
}

function WithToken({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onSubmit,
}: any) {
  return (
    <div className="mt-4 mx-auto p-2 md:w-1/2 text-center font-thin">
      <Label className="mt-16 block text-left">New password</Label>
      <Input
        className="mt-2"
        value={password}
        type="password"
        placeholder="Enter your new password"
        onChange={e => setPassword(e.target.value)}
      />
      <Label className="mt-8 block text-left">Confirm new password</Label>
      <Input
        className="mt-2"
        value={confirmPassword}
        type="password"
        placeholder="Confirm your new password"
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <Button className="mt-4" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
}

function WithoutToken({ email, setEmail, onSubmit, sendingEmail }: any) {
  return (
    <>
      <p className="mt-4 text-center font-thin">
        Please check your inbox and spam for password reset link.
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
