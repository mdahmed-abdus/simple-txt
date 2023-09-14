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

export default function Dashboard() {
  const user = {
    name: 'John Doe',
    email: 'johndoe@domain.com',
  };

  const notes: { id: string; title: string; body: string }[] = [
    {
      id: '60f94b03e52b1f001c050235',
      title: 'Notes from the Unknown',
      body: 'In the quiet corners of uncertainty, I collect these fragments of knowledge and wonder. Each note is a step deeper into the uncharted territory of discovery.',
    },
    {
      id: '60f94b19e52b1f001c050236',
      title: 'A Day in Reflection',
      body: 'As the sun sets on another day, I take a moment to reflect on the journey traveled. These notes serve as the mirror to my thoughts, capturing the ripples of experiences.',
    },
    {
      id: '60f94b2ce52b1f001c050237',
      title: 'Chronicles of Curiosity',
      body: 'Curiosity is a relentless companion, and these chronicles are its testament. With every entry, I venture further into the realms of the unknown, driven by the thirst for knowledge.',
    },
  ];

  const viewNote = (id: string) => {};

  const addNewNote = () => {};

  return (
    <div className="container mt-16 md:mt-32 font-thin">
      <h1 className="text-3xl text-center">
        Welcome back, <span className="font-normal">{user.name}</span>
      </h1>

      <Table className="mt-16">
        <TableCaption>
          {notes.length > 0 ? (
            'A list of your notes.'
          ) : (
            <div>
              <p>You do not have any notes.</p>
              <p>
                Click on <p className="inline font-normal">Add new note</p> to
                add a new note.
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
              <Button className="font-thin" variant="link" onClick={addNewNote}>
                Add new note
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map(({ id, title, body }, index) => (
            <TableRow key={`dashboardTableRow_${id}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-normal">{title}</TableCell>
              <TableCell>{body.slice(0, 100) + '...'}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="font-thin"
                  variant="link"
                  onClick={() => viewNote(id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
