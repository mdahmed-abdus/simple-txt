export type NoteFromDb = {
  _id: string;
  title: string;
  body: string;
  locked: false;
  iv?: Buffer;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicNote = {
  _id: string;
  title: string;
  body: string;
  locked: false;
  createdAt: Date;
  updatedAt: Date;
};

export function filterPublicNote({
  _id,
  title,
  body,
  locked,
  createdAt,
  updatedAt,
}: NoteFromDb): PublicNote {
  return { _id, title, body: locked ? '' : body, locked, createdAt, updatedAt };
}

export function filterPublicNotes(notes: NoteFromDb[]): PublicNote[] {
  const result: PublicNote[] = [];
  notes.forEach(note => result.push(filterPublicNote(note)));
  return result;
}
