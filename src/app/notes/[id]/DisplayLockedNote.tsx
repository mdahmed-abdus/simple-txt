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
import { unlockNote, viewLockedNote } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { unlockNoteSchema } from '@/validation/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function DisplayLockedNote({
  note,
  setNote,
  deleteNote,
  enterEditMode,
  setNotePassword,
}: {
  note: Note;
  setNote: Dispatch<SetStateAction<Note>>;
  deleteNote: () => void;
  enterEditMode: () => void;
  setNotePassword: Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const [currentLock, setCurrentLock] = useState(note.locked);

  const form = useForm<z.infer<typeof unlockNoteSchema>>({
    resolver: zodResolver(unlockNoteSchema),
    defaultValues: { notePassword: '' },
  });

  const getDecryptedNoteBody = ({
    notePassword,
  }: z.infer<typeof unlockNoteSchema>) => {
    setLoading(true);

    viewLockedNote(note._id, notePassword)
      .then(data => {
        toast({ description: data.message });
        setNotePassword(notePassword);
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

  const resetCurrentLock = () => {
    form.reset();
    setNotePassword('');
    setNote({ ...note, body: '' });
    setCurrentLock(true);
  };

  const removeLock = ({ notePassword }: z.infer<typeof unlockNoteSchema>) => {
    setLoading(true);

    unlockNote(note._id, notePassword)
      .then(data => {
        toast({ description: data.message });
        setNote(data.note);
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => {
        setLoading(false);
        setNotePassword('');
      });
  };

  const getNoteBody = () =>
    currentLock ? (
      <p className="italic text-center text-sm">
        Note is locked. Enter password to view.
      </p>
    ) : (
      note.body.split('\n').map((p, i) => (
        <p key={`noteBodyP_${i}`} className="border border-transparent">
          {p}
        </p>
      ))
    );

  return (
    <>
      <h1 className="p-2 text-3xl border border-transparent text-center">
        {note.title}
      </h1>
      <div className="mt-8 font-thin p-2">{getNoteBody()}</div>
      {currentLock && (
        <Form {...form}>
          <form className="mt-8 flex flex-col items-center">
            <div className="md:w-3/4 lg:w-1/2 md:mx-auto text-center">
              <FormField
                control={form.control}
                name="notePassword"
                render={({ field }) => (
                  <FormItem className="mt-4 w-full">
                    <FormLabel>Note Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 p-0 text-center"
                        type="password"
                        placeholder="Enter note password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Separator />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8 flex">
              <Button
                className="font-normal text-destructive"
                variant="link"
                onClick={form.handleSubmit(removeLock)}
                disabled={loading}
              >
                Remove lock
              </Button>
              <Button
                className="font-normal"
                variant="link"
                onClick={form.handleSubmit(getDecryptedNoteBody)}
                disabled={loading}
              >
                Unlock
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!currentLock && (
        <div className="text-center mt-16">
          <Button
            className="font-normal"
            variant="link"
            onClick={resetCurrentLock}
          >
            Lock
          </Button>
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
        </div>
      )}
    </>
  );
}
