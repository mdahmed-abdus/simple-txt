'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
import InternalLink from '@/components/ui/InternalLink';
import {
  deleteNoteById,
  getNoteById,
  updateNoteById,
} from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { noteSchema } from '@/validation/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function NoteById({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState({ _id: '', title: '', body: '' });

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

  useEffect(
    () => loadNote(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deleteNote = () => {
    deleteNoteById(note._id)
      .then(data => {
        toast({ description: data.message });
        router.push('/dashboard');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
  };

  const updateNote = (values: { title: string; body: string }) => {
    updateNoteById(note._id, {
      title: values.title,
      body: values.body,
    })
      .then(data => {
        toast({ description: data.message });
        loadNote();
        exitEditMode();
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      );
  };

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
              loading={loading}
              setLoading={setLoading}
              updateNote={updateNote}
              exitEditMode={exitEditMode}
            />
          ) : (
            <ShowNote
              note={note}
              deleteNote={deleteNote}
              enterEditMode={enterEditMode}
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

function EditNoteForm({
  note,
  loading,
  setLoading,
  exitEditMode,
  updateNote,
}: any) {
  const formFields = [
    {
      name: 'title' as const,
      label: 'Title',
      inputType: 'text',
      inputPlaceholder: 'Enter note title',
    },
    {
      name: 'body' as const,
      label: 'Body',
      inputType: 'text',
      inputPlaceholder: 'Enter note body',
    },
  ];

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note.title, body: note.body },
  });

  const onSubmit = (values: z.infer<typeof noteSchema>) => {
    setLoading(true);
    updateNote(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {formFields.map((formField, index) => (
          <FormField
            key={`editNoteFormFormField_${index}`}
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FormItem className="mt-4 w-full">
                <FormLabel>{formField.label}</FormLabel>
                <FormControl>
                  {formField.name === 'body' ? (
                    <Textarea
                      className="border-0 p-0 min-h-fit"
                      placeholder={formField.inputPlaceholder}
                      {...field}
                    />
                  ) : (
                    <Input
                      className="border-0 p-0"
                      type={formField.inputType}
                      autoComplete="on"
                      placeholder={formField.inputPlaceholder}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="text-center">
          <Button
            className="mt-16 font-normal"
            variant="link"
            disabled={loading}
            onClick={exitEditMode}
          >
            Cancel & exit edit mode
          </Button>
          <Button
            type="submit"
            className="font-normal"
            variant="link"
            disabled={loading}
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ShowNote({ note, deleteNote, enterEditMode }: any) {
  return (
    <>
      <h1 className="p-2 text-3xl border border-transparent text-center">
        {note.title}
      </h1>
      <div className="mt-8 font-thin">
        <p className="p-2 border border-transparent">{note.body}</p>
      </div>
      <div className="text-center">
        <Button
          className="mt-16 font-normal"
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
              <AlertDialogAction onClick={deleteNote}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
