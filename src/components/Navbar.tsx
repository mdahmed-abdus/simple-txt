'use client';

import { useEffect, useState } from 'react';
import InternalLink from './ui/InternalLink';
import { getUserData, logoutUser } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAuthContext } from '@/context/authContext';

export default function Navbar() {
  const [navToggle, setNavToggle] = useState(false);
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
      <div onClick={() => setNavToggle(false)}>
        <InternalLink text="simple-txt" href="/" />
      </div>
      <div className="flex flex-col items-end">
        <svg
          className="h-[25px] sm:hidden p-0 font-thin text-sm"
          onClick={() => setNavToggle(!navToggle)}
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {navToggle ? (
            <path
              d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          ) : (
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          )}
        </svg>
        <ul
          className={`text-right sm:flex gap-8 items-center ${
            !navToggle && 'hidden'
          }`}
        >
          <li className="mt-2 sm:mt-0" onClick={() => setNavToggle(!navToggle)}>
            <InternalLink className="text-sm" text="Home" href="/" />
          </li>
          <li className="mt-2 sm:mt-0" onClick={() => setNavToggle(!navToggle)}>
            <InternalLink className="text-sm" text="About" href="/#about" />
          </li>
          {authStatus ? (
            <>
              <li
                className="mt-2 sm:mt-0"
                onClick={() => setNavToggle(!navToggle)}
              >
                <InternalLink
                  className="text-sm"
                  text="Dashboard"
                  href="/dashboard"
                />
              </li>
              <li
                className="mt-2 sm:mt-0"
                onClick={() => setNavToggle(!navToggle)}
              >
                <InternalLink
                  className="text-sm"
                  text="Profile"
                  href="/profile"
                />
              </li>
              <Button
                className="mt-2 sm:mt-0 p-0 h-fit font-thin text-sm"
                variant="link"
                onClick={() => {
                  logout();
                  setNavToggle(!navToggle);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <li
                className="mt-2 sm:mt-0"
                onClick={() => setNavToggle(!navToggle)}
              >
                <InternalLink
                  className="text-sm"
                  text="Register"
                  href="/register"
                />
              </li>
              <li
                className="mt-2 sm:mt-0"
                onClick={() => setNavToggle(!navToggle)}
              >
                <InternalLink className="text-sm" text="Login" href="/login" />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
