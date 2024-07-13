'use client';

import { useCookies } from 'react-cookie';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function WelcomeCookie() {
  const [visible, setVisible] = useState(true);
  const [cookie, setCookie] = useCookies(['welcomeCookie']);

  useEffect(() => {
    setVisible(!cookie.welcomeCookie);
  }, [cookie.welcomeCookie]);

  const today = new Date();
  const nextYear = new Date();
  nextYear.setDate(today.getDate() + 365);

  return visible ? (
    <div className="mt-16">
      <div className="text-black font-light text-center">
        <p className="text-xs italic">
          By using this website, you agree to our use of cookies.{' '}
          <Button
            onClick={() => {
              setCookie('welcomeCookie', true, { expires: nextYear });
              setVisible(false);
            }}
            type="button"
            className="h-auto p-0 font-normal text-xs italic"
            variant="link"
          >
            Okay.
          </Button>
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}
