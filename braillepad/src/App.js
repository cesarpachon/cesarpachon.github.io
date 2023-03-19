import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { createBrowserHistory } from 'history';
// We will create these two pages in a moment
import HomePage from './pages/HomePage'
import EditPage from './pages/EditPage'
import NotesPage from './pages/NotesPage'

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/notes' element={<NotesPage/>} />
      <Route path='/edit/:id' element={<EditPage/>} />
    </Routes>
  )
}
