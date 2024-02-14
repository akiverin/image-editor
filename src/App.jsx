import React from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { ImageProvider } from './ImageProvider';

function App() {
  
  return (
    <ImageProvider>
      <AppRouter /> 
    </ImageProvider>
  )
}

export default App
