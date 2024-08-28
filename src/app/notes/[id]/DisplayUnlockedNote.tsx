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
import { lockNote } from '@/services/apiService';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { lockNoteSchema } from '@/validation/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function DisplayUnlockedNote({
  note,
  setNote,
  deleteNote,
  enterEditMode,
}: {
  note: Note;
  setNote: Dispatch<SetStateAction<Note>>;
  deleteNote: () => void;
  enterEditMode: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [lockNoteSelected, setLockNoteSelected] = useState(false);

  const form = useForm<z.infer<typeof lockNoteSchema>>({
    resolver: zodResolver(lockNoteSchema),
    defaultValues: { notePassword: '', confirmNotePassword: '' },
  });

  const onSubmit = (values: z.infer<typeof lockNoteSchema>) => {
    setLoading(true);

    lockNote(note._id, values)
      .then(data => {
        toast({ description: data.message });
        setNote(data.note);
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setLoading(false));
  };

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
      <div className="mt-16 mb-8 flex justify-center items-center space-x-2">
        <Checkbox
          checked={lockNoteSelected}
          onCheckedChange={() => setLockNoteSelected(!lockNoteSelected)}
        />
        <label className="text-sm">Lock this note</label>
      </div>
      {lockNoteSelected && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center text-left"
          >
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
              <FormField
                control={form.control}
                name="confirmNotePassword"
                render={({ field }) => (
                  <FormItem className="mt-4 w-full">
                    <FormLabel>Confirm note password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-0 p-0 text-center"
                        type="password"
                        placeholder="Confirm note password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Separator />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="mt-8 p-0 w-fit h-fit font-normal"
              variant="link"
              disabled={loading}
            >
              Add lock
            </Button>
          </form>
        </Form>
      )}
      <div className="text-center">
        <Button
          className="font-normal"
          variant="link"
          onClick={enterEditMode}
          disabled={loading}
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="text-destructive font-normal"
              variant="link"
              disabled={loading}
            >
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
