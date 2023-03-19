export function getNotes() {
  let db = localStorage.getItem("notes");
  if (!db) {
    db = "[]";
  }
  return JSON.parse(db);
}

export function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function addNote(title){
  const notes = getNotes();
  notes.push({
    id: Date.now(),
    title,
    text: '',
  });
  saveNotes(notes);
}

export function getNote(noteid) {
  const notes = getNotes();
  return notes.find(n => n.id === noteid);
}
