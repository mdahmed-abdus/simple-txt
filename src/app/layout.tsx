import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthContextProvider } from '@/context/authContext';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body className={rubik.className + ' container mb-10'}>
          <Navbar />
          <div>{children}</div>
          <Toaster />
        </body>
      </AuthContextProvider>
    </html>
  );
}
