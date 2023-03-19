import React from 'react'
import { Route, Routes } from 'react-router-dom'
// We will create these two pages in a moment
import HomePage from './pages/HomePage'
import EditPage from './pages/EditPage'
import NotesPage from './pages/NotesPage'
export default function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/notes' element={<NotesPage/>} />
      <Route path='/edit/:id' element={<EditPage/>} />
    </Routes>
  )
}
