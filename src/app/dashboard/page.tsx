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
    { _id: string; title: string; body: string; locked: boolean }[]
  >([]);

  useEffect(() => {
    getAllNotes()
      .then(data => setNotes(data.notes))
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAddNewNoteBtn = () => (
    <Button
      className="p-0 font-thin whitespace-nowrap"
      variant="link"
      onClick={() => router.push('notes/new')}
    >
      Add new note
    </Button>
  );

  const getTableCaption = () => (
    <TableCaption>
      {notes.length > 0 ? (
        'A list of your notes.'
      ) : (
        <div>
          <p>You do not have any notes.</p>
          <p>
            Click on <span className="inline font-normal">Add new note</span> to
            add a new note.
          </p>
        </div>
      )}
    </TableCaption>
  );

  const getTableNoteBody = (locked: boolean, body: string) =>
    locked ? (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    ) : body.length > 100 ? (
      body.slice(0, 100) + '...'
    ) : (
      body
    );

  const viewNote = (id: string) => router.push(`notes/${id}`);

  return (
    <div className="container mt-16 md:mt-32 font-thin">
      <h1 className="text-3xl text-center">
        Welcome back, <span className="font-normal">{user.name}</span>
      </h1>
      <Table className="mt-16 hidden sm:table">
        {getTableCaption()}
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Body</TableHead>
            <TableHead className="text-right">{getAddNewNoteBtn()}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map(({ _id, title, body, locked }, index) => (
            <TableRow key={`dashboardTableRow_${_id}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-normal">{title}</TableCell>
              <TableCell>{getTableNoteBody(locked, body)}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="font-thin"
                  variant="link"
                  onClick={() => viewNote(_id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className="mt-16 table sm:hidden">
        {getTableCaption()}
        <TableHeader>
          <TableRow>
            <TableHead>{getAddNewNoteBtn()}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map(({ _id, title, body, locked }, index) => (
            <TableRow key={`dashboard2TableRow_${_id}`}>
              <TableCell onClick={() => viewNote(_id)}>
                <p className="text-xs">No. {index + 1}</p>
                <p className="font-normal mt-2">{title}</p>
                <p className="mt-1">{getTableNoteBody(locked, body)}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
