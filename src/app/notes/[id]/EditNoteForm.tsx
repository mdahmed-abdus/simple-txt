'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateNoteSchema } from '@/validation/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Note } from './types';

export default function EditNoteForm({
  note,
  exitEditMode,
  updateNote,
}: {
  note: Note;
  exitEditMode: () => void;
  updateNote: (values: { title: string; body: string }) => void;
}) {
  const form = useForm<z.infer<typeof updateNoteSchema>>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: { title: note.title, body: note.body },
  });

  const onSubmit = (values: z.infer<typeof updateNoteSchema>) =>
    updateNote(values);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="border-0 p-0"
                  type="text"
                  placeholder="Enter title"
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
          name="body"
          render={({ field }) => (
            <FormItem className="mt-4 w-full">
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  className="border-0 p-0 min-h-fit"
                  placeholder="Enter body"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Separator />
            </FormItem>
          )}
        />
        <div className="text-center">
          <Button
            className="mt-16 font-normal"
            variant="link"
            onClick={exitEditMode}
          >
            Cancel & exit edit mode
          </Button>
          <Button type="submit" className="font-normal" variant="link">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
