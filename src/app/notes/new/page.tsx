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
import { Checkbox } from '@/components/ui/checkbox';

export default function NewNote() {
  const [saving, setSaving] = useState(false);
  const [lockNote, setLockNote] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      body: '',
      locked: false,
      notePassword: '',
      confirmNotePassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof noteSchema>) => {
    console.log(values);
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
            <FormField
              control={form.control}
              name="locked"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onClick={() => setLockNote(!lockNote)}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Lock this note
                  </FormLabel>
                </FormItem>
              )}
            />
            {lockNote && (
              <>
                <FormField
                  control={form.control}
                  name="notePassword"
                  render={({ field }) => (
                    <FormItem className="mt-4 w-full">
                      <FormLabel>Note Password</FormLabel>
                      <FormControl>
                        <Input
                          className="border-0 p-0"
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
                          className="border-0 p-0"
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
                <ul className="mt-16 text-sm">
                  <li>
                    Please remember the password and keep it somewhere safe.
                  </li>
                  <li>
                    To change password - unlock the note, and lock it again with
                    new password.
                  </li>
                  <li className="text-destructive">
                    Password cannot be reset.
                  </li>
                  <li className="text-destructive">
                    Without password, note cannot be decrypted and data cannot
                    be recovered.
                  </li>
                </ul>
              </>
            )}
            <div className="mt-16 text-center">
              <Button
                className="font-normal"
                variant="link"
                onClick={router.back}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-fit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
