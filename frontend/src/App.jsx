import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import InputBar from './components/InputBar'
import DownloadPage from './components/DownloadPage'


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<InputBar />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </div>
  );
}

export default App