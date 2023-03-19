import React from 'react'
import { Link } from 'react-router-dom'
export default function HomePage() {
  return (
    <div className='container'>
      <h1>Cesar Pachon - Braille Pad</h1>
      <p>
        <Link to='/notes'>Your Notes</Link>
      </p>
    </div>
  )
}
