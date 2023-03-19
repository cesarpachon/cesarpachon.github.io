import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as notesStore from '../notesStore.js';
import BrailleCanvas from '../Braille/BrailleCanvas.js';

export default function UserPage() {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [mode, setMode] = useState(''); //edit, rename, none?
  const [text, setText] = useState(''); // text being edited
  useEffect(() => {
    const n = notesStore.getNote(+id);
    console.log(n);
    setNote(n);
  }, [id]);

  function rename() {
   console.log("todo rename"); 
  }

  function edit() {
    setMode('edit');
    setText(note.txt);
  }

  function onChange(newtext) {
    setText(newtext);
  }

return (
  <>
  <h1>Note: {note.title}
  <button type="button" onClick={rename}>Rename</button>
  <button type="button" onClick={edit}>Edit</button>
  { mode === 'edit' &&
    <BrailleCanvas onChange={onChange} />
  }
  </h1>
<div>{note.text}</div>
</>
);
}
