'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/context/authContext';
import { getAllNotes } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const [notes, setNotes] = useState<
    { _id: string; title: string; body: string }[]
  >([]);

  useEffect(() => {
    getAllNotes()
      .then(data => setNotes(data.notes))
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-16 md:mt-32 font-thin">
      <h1 className="text-3xl text-center">
        Welcome back, <span className="font-normal">{user.name}</span>
      </h1>
      <Table className="mt-16 hidden sm:table">
        <TableCaption>
          {notes.length > 0 ? (
            'A list of your notes.'
          ) : (
            <div>
              <p>You do not have any notes.</p>
              <p>
                Click on{' '}
                <span className="inline font-normal">Add new note</span> to add
                a new note.
              </p>
            </div>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Body</TableHead>
            <TableHead className="text-right">
              <Button
                className="p-0 font-thin"
                variant="link"
                onClick={() => router.push('notes/new')}
              >
                Add new note
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map(({ _id, title, body }, index) => (
            <TableRow key={`dashboardTableRow_${_id}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-normal">{title}</TableCell>
              <TableCell>
                {body.length > 100 ? body.slice(0, 100) + '...' : body}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className="font-thin"
                  variant="link"
                  onClick={() => router.push(`notes/${_id}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className="mt-16 table sm:hidden">
        <TableCaption>
          {notes.length > 0 ? (
            'A list of your notes.'
          ) : (
            <div>
              <p>You do not have any notes.</p>
              <p>
                Click on{' '}
                <span className="inline font-normal">Add new note</span> to add
                a new note.
              </p>
            </div>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                className="p-0 font-thin"
                variant="link"
                onClick={() => router.push('notes/new')}
              >
                Add new note
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map(({ _id, title, body }, index) => (
            <TableRow key={`dashboard2TableRow_${_id}`}>
              <TableCell onClick={() => router.push(`notes/${_id}`)}>
                <p className="text-xs">No. {index + 1}</p>
                <p className="font-normal mt-2">{title}</p>
                <p className="mt-1">
                  {body.length > 100 ? body.slice(0, 100) + '...' : body}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
