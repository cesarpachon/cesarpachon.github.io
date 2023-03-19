import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import * as notesStore from '../notesStore.js'
export default function UserPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    setNotes(notesStore.getNotes());
  }, []);

  function onNote(noteid) {
    console.log(noteid);
    navigate(`/edit/${noteid}`);
  }

  function newNote() {
    notesStore.addNote("new note");
    setNotes(notesStore.getNotes());
  }

  return (
  <>
    <h1>Your Notes: <button type="button" onClick={newNote}>Add</button></h1>
    <ul>
      { notes && notes.map((note) => <li
      key={note.id}
      onClick={() => onNote(note.id)}
      >
          {note.title}
        </li>
        )
      }
    </ul>

</>
);
}
