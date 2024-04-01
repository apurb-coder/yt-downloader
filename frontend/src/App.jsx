import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import InputBar from './components/InputBar'
import DownloadPage from './components/DownloadPage'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      <Navbar />
      {/* for showing toast */}
      <ToastContainer className="mt-20" />
      <Routes>
        <Route path="/" element={<InputBar />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </div>
  );
}

export default App