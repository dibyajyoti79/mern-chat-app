import './App.css';
import { Button } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/HomePage";
import Chat from "./pages/ChatPage.js";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>


  );
}

export default App;
