'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { addNewNote } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { noteSchema } from '@/validation/validationSchemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function NewNote() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
    defaultValues: { title: '', body: '' },
  });

  const onSubmit = (values: z.infer<typeof noteSchema>) => {
    setSaving(true);

    addNewNote(values)
      .then(data => {
        toast({ description: data.message });
        router.push('/dashboard');
      })
      .catch(error =>
        toast({ variant: 'destructive', description: error.message })
      )
      .finally(() => setSaving(false));
  };

  return (
    <div className="mt-16 md:mt-32">
      <h1 className="text-3xl border border-transparent text-center">
        Add new note
      </h1>
      <div className="mt-16 md:w-3/4 lg:w-1/2 md:mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            {formFields.map((formField, index) => (
              <FormField
                key={`newNoteFormFormField_${index}`}
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
            <div className="mt-16 text-center">
              <Button
                className="font-normal"
                variant="link"
                onClick={router.back}
              >
                Cancel
              </Button>
              <Button type="submit" className="mt-16 w-fit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
