'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');

  const [email, setEmail] = useState('');

  return (
    <div className="container mt-16 md:mt-32 text-center font-thin">
      <h1 className="text-3xl text-center font-normal">Verify your email</h1>
      <p className="mt-4 text-center font-thin">
        Please check your inbox and spam for email verification link.
      </p>
      {!tokenId && (
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
          <Button className="mt-4">Submit</Button>
        </div>
      )}
    </div>
  );
}
