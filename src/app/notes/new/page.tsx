'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function NewNote() {
  const router = useRouter();

  const [note, setNote] = useState({ id: '', title: '', body: '' });

  const saveNote = () => {};

  return (
    <div className="mt-16 md:mt-32">
      <h1 className="text-3xl border border-transparent">Add new note</h1>
      <div className="mt-16">
        <Label>Title</Label>
        <Input
          className="mt-4 p-0 h-fit border-0 text-base"
          value={note.title}
          placeholder="Enter note title"
          onChange={e => setNote({ ...note, title: e.target.value })}
        />
        <Separator />
        <Label className="mt-8 block">Body</Label>
        <Textarea
          className="mt-4 p-0 min-h-fit text-base border-0"
          placeholder="Enter note body"
          value={note.body}
          onChange={e => setNote({ ...note, body: e.target.value })}
        />
        <Separator />
      </div>
      <div className="mt-16 text-center">
        <Button className="font-normal" variant="link" onClick={router.back}>
          Cancel
        </Button>
        <Button className="font-normal" onClick={() => saveNote}>
          Save
        </Button>
      </div>
    </div>
  );
}
