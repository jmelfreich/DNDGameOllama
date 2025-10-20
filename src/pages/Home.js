// frontend/src/pages/Home.js - FIXED NULL CHARACTER CHECK
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearGameState } from '../utils/gameState';

function Home({ gameState }) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNewCampaign = () => {
    if (gameState) {
      if (window.confirm('Starting a new campaign will delete your current game. Continue?')) {
        clearGameState();
        navigate('/campaign');
      }
    } else {
      navigate('/campaign');
    }
  };

  const handleContinueGame = () => {
    // Check if we have both campaign and character
    if (gameState && gameState.character) {
      navigate('/game');
    } else if (gameState && gameState.campaign && !gameState.character) {
      // If campaign exists but no character, go to character creation
      navigate('/character');
    }
  };

  const handleDeleteSave = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    clearGameState();
    setShowDeleteConfirm(false);
    window.location.reload();
  };

  // Check if we have a complete save (both campaign and character)
  const hasCompleteSave = gameState && gameState.character;
  // Check if we have a partial save (campaign but no character)
  const hasPartialSave = gameState && gameState.campaign && !gameState.character;

  return (
    <div className="page home-page">
      <div className="container">
        <header className="header">
          <h1 className="title">D&D OLLAMA</h1>
          <div className="subtitle">AI-Powered Dungeon Master</div>
        </header>

        <div className="menu-grid">
          <button 
            className="menu-button"
            onClick={handleNewCampaign}
          >
            <span className="menu-number">01</span>
            <span className="menu-text">New Campaign</span>
          </button>

          {gameState && (
            <button 
              className="menu-button"
              onClick={handleContinueGame}
            >
              <span className="menu-number">02</span>
              <span className="menu-text">
                {hasPartialSave ? 'Continue Setup' : 'Continue Game'}
              </span>
            </button>
          )}

          <button 
            className="menu-button"
            onClick={() => navigate('/settings')}
          >
            <span className="menu-number">03</span>
            <span className="menu-text">Settings</span>
          </button>

          {gameState && (
            <button 
              className="menu-button"
              onClick={handleDeleteSave}
            >
              <span className="menu-number">04</span>
              <span className="menu-text">Delete Save</span>
            </button>
          )}
        </div>

        {/* Show character info only if we have a complete save */}
        {hasCompleteSave && (
          <div className="game-info">
            <div className="info-header">
              <div className="info-title">Current Save</div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Character</div>
                <div className="info-value">{gameState.character.name}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Race</div>
                <div className="info-value">{gameState.character.race}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Class</div>
                <div className="info-value">{gameState.character.class}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Level</div>
                <div className="info-value">{gameState.character.level}</div>
              </div>
              <div className="info-item">
                <div className="info-label">HP</div>
                <div className="info-value">{gameState.character.hp}/{gameState.character.maxHp}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Campaign</div>
                <div className="info-value">{gameState.campaign.title}</div>
              </div>
            </div>
          </div>
        )}

        {/* Show campaign info if we have a partial save */}
        {hasPartialSave && (
          <div className="game-info">
            <div className="info-header">
              <div className="info-title">Campaign in Progress</div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Campaign</div>
                <div className="info-value">{gameState.campaign.title}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Status</div>
                <div className="info-value">Character Creation</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-gray-100)', borderLeft: '4px solid var(--color-blue)' }}>
              <strong>Continue Setup:</strong> Complete your character creation to start playing!
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Delete Save Game?</h2>
              <p className="modal-message">
                This will permanently delete your current game. This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button 
                  className="modal-button modal-button-danger"
                  onClick={confirmDelete}
                >
                  Delete Save
                </button>
                <button 
                  className="modal-button modal-button-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;