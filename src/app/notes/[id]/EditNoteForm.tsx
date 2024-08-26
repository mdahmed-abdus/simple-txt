'use client';

import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import { Note } from './types';

export default function EditNoteForm({
  note,
  loading,
  setLoading,
  exitEditMode,
  updateNote,
}: {
  note: Note;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  exitEditMode: () => void;
  updateNote: (values: { title: string; body: string }) => void;
}) {
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
            key={`editNoteFormField_${index}`}
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
                <Separator />
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
