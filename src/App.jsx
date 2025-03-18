// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Work from './components/upload'
import SignInPage from './components/signin'
import SignupPage from './components/signup'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGenerationPage from './components/generator';
import Home from './components/home';
import Contact from './components/contact';
import Navbar from './components/navbar';

function App() {
  // const [count, setCount] = useState(0)

  return (

    <Router>
      
      <Navbar /> 
      
      <Routes>
        <Route path = "/" element={<SignInPage/>} />   
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/signin" element={<SignInPage/>} /> 
        <Route path="/upload" element={<Work/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/generator" element={<ImageGenerationPage/>} />
    </Routes>
  </Router>
  )
}

export default App






{/* <Route path = '/home'

element = {
<>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src={viteLogo} className="logo" alt="Vite logo" />
    </a>
    <a href="https://react.dev" target="_blank">
      <img src={reactLogo} className="logo react" alt="React logo" />
    </a>
  </div>
  <h1>Vite + React</h1>
  <div className="card">
    <button onClick={() => setCount((count) => count + 1)}>
      count is {count}
    </button>
    <p>
      Edit <code>src/App.jsx</code> and save to test HMR
    </p>
  </div>
  <p className="read-the-docs">
    Click on the Vite and React logos to learn more
  </p>
</>
}
/> */}