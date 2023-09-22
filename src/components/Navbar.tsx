'use client';

import { useEffect, useState } from 'react';
import InternalLink from './ui/InternalLink';
import { getUserData, logoutUser } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAuthContext } from '@/context/authContext';

export default function Navbar() {
  const { authStatus, setAuthStatus, setUser } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    getUserData()
      .then(data => {
        const { name, email } = data.user;
        setAuthStatus(true);
        setUser({ name, email });
      })
      .catch(() => {
        setAuthStatus(false);
        setUser({ name: '', email: '' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <nav className="py-4 flex justify-between font-thin">
      <div>
        <InternalLink text="simple-txt" href="/" />
      </div>
      <ul className="flex gap-8 items-center">
        <li>
          <InternalLink className="text-sm" text="Home" href="/" />
        </li>
        <li>
          <InternalLink className="text-sm" text="About" href="/#about" />
        </li>
        {authStatus ? (
          <>
            <li>
              <InternalLink
                className="text-sm"
                text="Dashboard"
                href="/dashboard"
              />
            </li>
            <li>
              <InternalLink
                className="text-sm"
                text="Profile"
                href="/profile"
              />
            </li>
            <Button
              className="p-0 h-fit font-thin text-sm"
              variant="link"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <li>
              <InternalLink
                className="text-sm"
                text="Register"
                href="/register"
              />
            </li>
            <li>
              <InternalLink className="text-sm" text="Login" href="/login" />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
