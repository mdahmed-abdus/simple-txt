'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Note } from './types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { viewLockedNote } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';

export default function DisplayNote({
  note,
  setNote,
  currentLock,
  setCurrentLock,
  deleteNote,
  enterEditMode,
  notePassword,
  setNotePassword,
}: {
  note: Note;
  setNote: Dispatch<SetStateAction<Note>>;
  currentLock: boolean;
  setCurrentLock: Dispatch<SetStateAction<boolean>>;
  deleteNote: () => void;
  enterEditMode: () => void;
  notePassword: string;
  setNotePassword: Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);

  const getDecryptedNoteBody = () => {
    setLoading(true);

    viewLockedNote(note._id, notePassword)
      .then(data => {
        console.log(data);
        toast({ description: data.message });
        setNote({ ...note, body: data.note.decryptedBody });
        setCurrentLock(false);
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
        setNote({ ...note, body: '' });
        setCurrentLock(true);
      })
      .finally(() => setLoading(false));
  };

  const getNoteBody = () => {
    if (currentLock) {
      return (
        <p className="italic text-center text-sm">
          Note is locked. Enter password to view.
        </p>
      );
    }
    return note.body.split('\n').map((p, i) => (
      <p key={`noteBodyP_${i}`} className="border border-transparent">
        {p}
      </p>
    ));
  };

  const resetCurrentLock = () => {
    setNotePassword('');
    setNote({ ...note, body: '' });
    setCurrentLock(true);
  };

  return (
    <>
      <h1 className="p-2 text-3xl border border-transparent text-center">
        {note.title}
      </h1>
      <div className="mt-8 font-thin p-2">{getNoteBody()}</div>
      {currentLock && (
        <div className="mt-16 mb-16 md:w-3/4 lg:w-1/2 md:mx-auto flex flex-col items-center">
          <Input
            className="border-0 p-0 text-center"
            value={notePassword}
            onChange={e => setNotePassword(e.target.value)}
            type="password"
            placeholder="Enter note password"
          />
          <Separator className="mt-2" />
          <Button
            className="mt-8 w-fit"
            onClick={getDecryptedNoteBody}
            disabled={loading}
          >
            {loading ? 'Unlocking' : 'Unlock'}
          </Button>
        </div>
      )}
      <div className="text-center mt-16">
        {note.locked && !currentLock && (
          <Button
            className="font-normal"
            variant="link"
            onClick={resetCurrentLock}
          >
            Lock
          </Button>
        )}
        {(!note.locked || !currentLock) && (
          <>
            <Button
              className="font-normal"
              variant="link"
              onClick={enterEditMode}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-destructive font-normal" variant="link">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                    <br />
                    This will permanently delete the note titled - {note.title}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteNote}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </>
  );
}
