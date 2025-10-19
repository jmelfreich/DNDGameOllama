// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CampaignSetup from './pages/CampaignSetup';
import CharacterCreation from './pages/CharacterCreation';
import Game from './pages/Game';
import Settings from './pages/Settings';
import { loadGameState, saveGameState } from './utils/gameState';

function App() {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = loadGameState();
    if (loaded) {
      console.log('Loaded game state:', loaded);
      setGameState(loaded);
    }
    setLoading(false);
  }, []);

  const updateGameState = (newState) => {
    console.log('Updating game state:', newState);
    setGameState(newState);
    saveGameState(newState);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home gameState={gameState} />} />
          <Route 
            path="/campaign" 
            element={<CampaignSetup updateGameState={updateGameState} />} 
          />
          <Route 
            path="/character" 
            element={<CharacterCreation updateGameState={updateGameState} gameState={gameState} />} 
          />
          <Route 
            path="/game" 
            element={
              gameState && gameState.character ? 
              <Game gameState={gameState} updateGameState={updateGameState} /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route path="/settings" element={<Settings />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;