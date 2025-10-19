// frontend/src/pages/Game.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NormalPlay from '../components/NormalPlay';
import Battle from '../components/Battle';
import Dialog from '../components/Dialog';
import CharacterSheet from '../components/CharacterSheet';
import LevelUp from '../components/LevelUp';

function Game({ gameState, updateGameState }) {
  const navigate = useNavigate();
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Safety check - if no game state, redirect to home
  if (!gameState || !gameState.character) {
    console.error('No game state found, redirecting to home');
    navigate('/');
    return null;
  }

  const handleLevelUp = () => {
    setShowLevelUp(true);
  };

  const completeLevelUp = (updatedCharacter) => {
    updateGameState({
      ...gameState,
      character: updatedCharacter
    });
    setShowLevelUp(false);
  };

  const renderGameMode = () => {
    if (showLevelUp) {
      return <LevelUp character={gameState.character} onComplete={completeLevelUp} />;
    }

    if (showCharacterSheet) {
      return (
        <CharacterSheet 
          character={gameState.character} 
          onClose={() => setShowCharacterSheet(false)}
        />
      );
    }

    switch (gameState.encounterType) {
      case 'battle':
        return (
          <Battle 
            gameState={gameState} 
            updateGameState={updateGameState}
            onLevelUp={handleLevelUp}
          />
        );
      case 'dialog':
      case 'shopping':
        return (
          <Dialog 
            gameState={gameState} 
            updateGameState={updateGameState}
          />
        );
      default:
        return (
          <NormalPlay 
            gameState={gameState} 
            updateGameState={updateGameState}
            onLevelUp={handleLevelUp}
          />
        );
    }
  };

  return (
    <div className="page game-page">
      <nav className="game-nav">
        <button className="nav-button" onClick={() => navigate('/')}>
          ← Menu
        </button>
        <div className="nav-info">
          <span className="nav-item">{gameState.character.name}</span>
          <span className="nav-separator">|</span>
          <span className="nav-item">Lv {gameState.character.level}</span>
          <span className="nav-separator">|</span>
          <span className="nav-item">HP: {gameState.character.hp}/{gameState.character.maxHp}</span>
          <span className="nav-separator">|</span>
          <span className="nav-item">XP: {gameState.character.xp}/{gameState.character.xpToNextLevel}</span>
        </div>
        <button 
          className="nav-button"
          onClick={() => setShowCharacterSheet(!showCharacterSheet)}
        >
          Character
        </button>
      </nav>

      <div className="game-container">
        {renderGameMode()}
      </div>
    </div>
  );
}

export default Game;