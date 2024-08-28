'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import InternalLink from '@/components/ui/InternalLink';
import {
  deleteNoteById,
  getNoteById,
  updateNoteById,
} from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Note } from './types';
import EditNoteForm from './EditNoteForm';
import DisplayNote from './DisplayNote';

export default function NoteById({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [notePassword, setNotePassword] = useState('');
  const [note, setNote] = useState<Note>({
    _id: '',
    title: '',
    body: '',
    locked: false,
  });

  const enterEditMode = () => setEditMode(true);
  const exitEditMode = () => setEditMode(false);

  const loadNote = () => {
    setLoading(true);

    getNoteById(params.id)
      .then(data => {
        setNote(data.note);
        setLoading(false);
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
        router.push('/dashboard');
      });
  };

  const deleteNote = () => {
    deleteNoteById(note._id, notePassword)
      .then(data => {
        toast({ description: data.message });
        router.push('/dashboard');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
  };

  const updateNote = (values: { title: string; body: string }) => {
    setLoading(true);

    updateNoteById(note._id, { ...values, notePassword })
      .then(data => {
        toast({ description: data.message });
        loadNote();
        exitEditMode();
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setLoading(false));
  };

  useEffect(
    () => loadNote(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="mt-16 md:mt-32">
      {loading ? (
        <div>
          <Skeleton className="w-1/2 h-[30px] mx-auto" />
          <Skeleton className="mt-8 mb-16 w-3/4 h-[200px] mx-auto" />
        </div>
      ) : (
        <div className="md:w-3/4 md:mx-auto">
          {editMode ? (
            <EditNoteForm
              note={note}
              updateNote={updateNote}
              exitEditMode={exitEditMode}
            />
          ) : (
            <DisplayNote
              note={note}
              setNote={setNote}
              deleteNote={deleteNote}
              enterEditMode={enterEditMode}
              notePassword={notePassword}
              setNotePassword={setNotePassword}
            />
          )}
        </div>
      )}
      <div className="text-center">
        <InternalLink
          className="text-sm font-normal"
          text="All notes"
          href="/dashboard"
        />
      </div>
    </div>
  );
}
