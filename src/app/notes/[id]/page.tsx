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

export default function NoteById({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState({ _id: '', title: '', body: '' });
  const [updatedNote, setUpdatedNote] = useState({
    _id: '',
    title: '',
    body: '',
  });

  const loadNote = () => {
    setLoading(true);
    getNoteById(params.id)
      .then(data => {
        setNote(data.note);
        setLoading(false);
      })
      .catch(error => {
        toast({ variant: 'destructive', description: error.message });
        setLoading(false);
        router.push('/dashboard');
      });
  };

  useEffect(
    () => loadNote(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const editNote = () => {
    setUpdatedNote(note);
    setEditMode(!editMode);
  };

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

  const updateNote = () => {
    updateNoteById(note._id, {
      title: updatedNote.title,
      body: updatedNote.body,
    })
      .then(data => {
        toast({ description: data.message });
        loadNote();
        setEditMode(!editMode);
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
            <Input
              className="p-2 h-fit text-3xl text-center"
              value={updatedNote.title}
              onChange={e =>
                setUpdatedNote({ ...updatedNote, title: e.target.value })
              }
            />
          ) : (
            <h1 className="p-2 text-3xl border border-transparent text-center">
              {note.title}
            </h1>
          )}
          <div className="mt-8 font-thin">
            {editMode ? (
              <Textarea
                className="p-2 text-base"
                value={updatedNote.body}
                onChange={e =>
                  setUpdatedNote({ ...updatedNote, body: e.target.value })
                }
              />
            ) : (
              <p className="p-2 border border-transparent">{note.body}</p>
            )}
          </div>
          <div className="text-center">
            <Button
              className="mt-16 font-normal"
              variant="link"
              onClick={editNote}
            >
              {editMode ? 'Cancel & exit edit mode' : 'Edit'}
            </Button>
            {editMode ? (
              <Button
                className="font-normal"
                variant="link"
                onClick={updateNote}
              >
                Update
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="text-destructive font-normal"
                    variant="link"
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
                      This will permanently delete the note titled -{' '}
                      {note.title}.
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
            )}
          </div>
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
