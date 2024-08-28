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

export default function DisplayUnlockedNote({
  note,
  deleteNote,
  enterEditMode,
}: {
  note: Note;
  deleteNote: () => void;
  enterEditMode: () => void;
}) {
  return (
    <>
      <h1 className="p-2 text-3xl border border-transparent text-center">
        {note.title}
      </h1>
      <div className="mt-8 font-thin p-2">
        {note.body.split('\n').map((p, i) => (
          <p key={`noteBodyP_${i}`} className="border border-transparent">
            {p}
          </p>
        ))}
      </div>
      <div className="text-center mt-16">
        <Button className="font-normal" variant="link" onClick={enterEditMode}>
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
              <AlertDialogAction onClick={deleteNote}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
