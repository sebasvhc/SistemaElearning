import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Login from './components/LogIn'
import SignUp from './components/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="relative bg-gray-900 h-screen bg-cover">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/LogIn" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </Router>
      
      {/* <div className='w-full xl:max-w-[1250px] mx-auto px-4'>
        <Hero />        
      </div> */}
    </main>
  )
}

export default App
