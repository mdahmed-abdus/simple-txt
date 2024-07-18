import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/context/authContext';
import WelcomeCookie from '@/components/WelcomeCookie';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'simple-txt',
  description: 'A minimalistic app designed for taking notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      <AuthContextProvider>
        <body className={rubik.className + ' container mb-10'}>
          <Navbar />
          <div>{children}</div>
          <Toaster />
          <WelcomeCookie />
        </body>
      </AuthContextProvider>
    </html>
  );
}
