'use client';

import { Note } from './types';
import { Dispatch, SetStateAction } from 'react';
import DisplayLockedNote from './DisplayLockedNote';
import DisplayUnlockedNote from './DisplayUnlockedNote';

export default function DisplayNote({
  note,
  setNote,
  deleteNote,
  enterEditMode,
  notePassword,
  setNotePassword,
}: {
  note: Note;
  setNote: Dispatch<SetStateAction<Note>>;
  deleteNote: () => void;
  enterEditMode: () => void;
  notePassword: string;
  setNotePassword: Dispatch<SetStateAction<string>>;
}) {
  return note.locked ? (
    <DisplayLockedNote
      note={note}
      setNote={setNote}
      deleteNote={deleteNote}
      enterEditMode={enterEditMode}
      notePassword={notePassword}
      setNotePassword={setNotePassword}
    />
  ) : (
    <DisplayUnlockedNote
      note={note}
      deleteNote={deleteNote}
      enterEditMode={enterEditMode}
    />
  );
}
