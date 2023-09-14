'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function NoteById({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState({ id: '', title: '', body: '' });
  const [updatedNote, setUpdatedNote] = useState({
    id: '',
    title: '',
    body: '',
  });

  useEffect(() => {
    setNote({
      id: '60f94b03e52b1f001c050235',
      title: 'Notes from the Unknown',
      body: 'In the quiet corners of uncertainty, I collect these fragments of knowledge and wonder. Each note is a step deeper into the uncharted territory of discovery.',
    });
    setLoading(false);
  }, [params.id]);

  const editNote = () => {
    setUpdatedNote(note);
    setEditMode(!editMode);
  };

  const deleteNote = () => {};

  const updateNote = () => {};

  return (
    <div className="mt-16 md:mt-32">
      {loading ? (
        <div>
          <Skeleton className="w-1/2 h-[30px] mx-auto" />
          <Skeleton className="mt-8 mb-16 w-3/4 h-[200px] mx-auto" />
        </div>
      ) : (
        <div>
          {editMode ? (
            <Input
              className="p-2 h-fit text-3xl"
              value={updatedNote.title}
              onChange={e => setUpdatedNote({ ...note, title: e.target.value })}
            />
          ) : (
            <h1 className="p-2 text-3xl border border-transparent">
              {note.title}
            </h1>
          )}
          <div className="mt-8 font-thin">
            {editMode ? (
              <Textarea
                className="p-2 text-base"
                value={updatedNote.body}
                onChange={e =>
                  setUpdatedNote({ ...note, body: e.target.value })
                }
              />
            ) : (
              <p className="p-2 border border-transparent">{note.body}</p>
            )}
          </div>
          <div className="text-center">
            <Button
              className="mt-16 font-normal"
              variant="link"
              onClick={editNote}
            >
              {editMode ? 'Cancel & exit edit mode' : 'Edit'}
            </Button>
            {editMode ? (
              <Button
                className="font-normal"
                variant="link"
                onClick={updateNote}
              >
                Update
              </Button>
            ) : (
              <Button
                className="text-destructive font-normal"
                variant="link"
                onClick={deleteNote}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="text-center">
        <Button variant="link" className="font-normal" asChild>
          <Link href="/dashboard">All notes</Link>
        </Button>
      </div>
    </div>
  );
}
